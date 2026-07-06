import json
import os
import re
import subprocess
import urllib.error
import urllib.request
from datetime import datetime, timezone
from typing import Dict, Optional
from urllib.parse import urlparse

from PIL import Image

# Blog list UI (AutoIndex format=blog) sorts and labels by _updated. Dated posts under
# blog/ use the YYYY-MM-DD prefix from the filename as stable UTC noon for _updated.
# All other tracked files use the committer date of the latest commit that touched
# each path (one `git log` pass); untracked or missing paths fall back to mtime.
_BLOG_DATED_MD = re.compile(r"^(\d{4}-\d{2}-\d{2})-.+\.md$")
_KEYWORDS_LINE_RE = re.compile(r"^Keywords:\s*(.+)$", re.MULTILINE | re.IGNORECASE)
_SUBSTACK_MARKER_RE = re.compile(
    r"\*\*Substack:\*\*\s*(?:\[[^\]]+\]\((https?://[^\s)]*substack\.com/[^\s)]+)\)|<?(https?://[^\s>]*substack\.com/[^\s>]+)>?)",
    re.IGNORECASE,
)
_SUBSTACK_LOOSE_RE = re.compile(r"https?://[^\s)]*substack\.com/p/[A-Za-z0-9_\-]+", re.IGNORECASE)
_SUBSTACK_DATE_PUBLISHED_RE = re.compile(r'"datePublished"\s*:\s*"([^"]+)"')

# Minified JSON (smaller index for fetch/PWA). Images keep _width/_height only.
_JSON_DUMP_KW = {"separators": (",", ":"), "ensure_ascii": False}


def _title_from_cs_file(full_path: str) -> str | None:
    def _is_decorative(s: str) -> bool:
        t = s.strip()
        return bool(t) and len(set(t)) <= 2 and all(c in "=-#*_" for c in t)

    try:
        with open(full_path, "r", encoding="utf-8") as f:
            for _ in range(40):
                line = f.readline()
                if not line:
                    break
                s = line.strip()
                if s.startswith("//"):
                    t = s[2:].strip()
                    if t and not _is_decorative(t):
                        return t[:240]
                elif s.startswith("/*") or not s:
                    continue
                else:
                    break
    except OSError:
        pass
    return None


def _is_substack_post_url(url: str) -> bool:
    try:
        parsed = urlparse(url.strip())
    except ValueError:
        return False
    if parsed.scheme not in ("http", "https"):
        return False
    host = (parsed.netloc or "").lower()
    if not host.endswith("substack.com"):
        return False
    return "/p/" in (parsed.path or "")


def _extract_md_index_fields(full_path: str) -> tuple[str | None, list[str], str | None]:
    """Single read: title (first # line), Keywords hashtags, Substack URL."""
    try:
        with open(full_path, "r", encoding="utf-8") as f:
            content = f.read()
    except OSError:
        return None, [], None

    title = None
    for line in content.splitlines()[:20]:
        s = line.strip()
        if s.startswith("# "):
            title = s[2:].strip()
            break

    kw: list[str] = []
    m = _KEYWORDS_LINE_RE.search(content)
    if m:
        kw = re.findall(r"#([^\s#\-]+)", m.group(1))

    substack_url = None
    marker = _SUBSTACK_MARKER_RE.search(content)
    if marker:
        found = (marker.group(1) or marker.group(2) or "").strip()
        if found and _is_substack_post_url(found):
            substack_url = found
    if not substack_url:
        loose = _SUBSTACK_LOOSE_RE.search(content)
        if loose:
            candidate = loose.group(0).strip()
            if _is_substack_post_url(candidate):
                substack_url = candidate

    return title, kw, substack_url


def _extract_keywords_from_markdown_file(full_path: str) -> list[str]:
    return _extract_md_index_fields(full_path)[1]


def _extract_substack_url_from_markdown_file(full_path: str) -> str | None:
    return _extract_md_index_fields(full_path)[2]


def _normalize_substack_published_iso(raw: str) -> str | None:
    try:
        normalized = raw.strip().replace("Z", "+00:00")
        dt = datetime.fromisoformat(normalized)
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=timezone.utc)
        return dt.astimezone(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    except ValueError:
        return None


def _fetch_substack_original_published(url: str, cache: Dict[str, Optional[str]]) -> str | None:
    if not _is_substack_post_url(url):
        return None
    if url in cache:
        return cache[url]
    skip_fetch = os.environ.get("SKIP_SUBSTACK_FETCH", "").strip().lower() in ("1", "true", "yes")
    if skip_fetch:
        cache[url] = None
        return None
    try:
        req = urllib.request.Request(
            url,
            headers={"User-Agent": "paradigm-threat-index/1.0 (+https://paradigmthreat.net)"},
        )
        with urllib.request.urlopen(req, timeout=12) as resp:
            if resp.status and resp.status >= 400:
                cache[url] = None
                return None
            html = resp.read(750_000).decode("utf-8", errors="replace")
        match = _SUBSTACK_DATE_PUBLISHED_RE.search(html)
        if not match:
            cache[url] = None
            return None
        iso = _normalize_substack_published_iso(match.group(1))
        cache[url] = iso
        return iso
    except (urllib.error.URLError, TimeoutError, OSError, ValueError):
        cache[url] = None
        return None


def _git_last_commit_unix_times(repo_dir: str) -> Dict[str, int]:
    """Map repo-relative paths (forward slashes) -> Unix time of last commit touching them.

    Walks history newest-first; first sighting of a path is its last modification.
    Returns {} if not a git repo or git fails.
    """
    try:
        proc = subprocess.run(
            [
                "git",
                "-C",
                repo_dir,
                "log",
                "--no-renames",
                "--name-only",
                "--pretty=format:%ct",
            ],
            capture_output=True,
            text=True,
            check=True,
            timeout=120,
        )
    except (subprocess.CalledProcessError, FileNotFoundError, subprocess.TimeoutExpired):
        return {}

    last: Dict[str, int] = {}
    current_ts: Optional[int] = None
    for line in proc.stdout.splitlines():
        s = line.strip()
        if not s:
            continue
        if s.isdigit():
            current_ts = int(s)
            continue
        if current_ts is None:
            continue
        key = s.replace("\\", "/")
        if key not in last:
            last[key] = current_ts
    return last


def _index_updated_iso(full_path: str, repo_dir: str, basename: str) -> Optional[str]:
    rel = os.path.normpath(os.path.relpath(full_path, repo_dir))
    parts = rel.split(os.sep)
    if len(parts) < 2 or parts[0] != "blog":
        return None
    m = _BLOG_DATED_MD.match(basename)
    if not m:
        return None
    ymd = m.group(1)
    try:
        datetime.strptime(ymd, "%Y-%m-%d")
    except ValueError:
        return None
    return f"{ymd}T12:00:00Z"


def generate_index():
    # Get the directory where the script is located and go up to the repo root
    script_dir = os.path.dirname(os.path.abspath(__file__))
    repo_dir = os.path.dirname(script_dir)
    output_file = os.path.join(repo_dir, "index.json")
    
    exclude_dirs = {'.git', '.github', 'scripts', 'node_modules', '.idea', 'docs'}
    exclude_files = {
        'index.json', 
        'package-lock.json', 
        'package.json', 
        'tsconfig.json', 
        '.gitignore', 
        'REORGANIZATION_MAP.md',
        'migrate_paths.py',
        'fix_nested_categories.py',
        'deduplicate_paths.py'
    }
    
    include_exts = {'.md', '.txt', '.pdf', '.json', '.srt', '.jpg', '.jpeg', '.png', '.webp'}

    git_times = _git_last_commit_unix_times(repo_dir)
    substack_published_cache: Dict[str, Optional[str]] = {}
    substack_fetch_attempts = 0
    substack_fetch_ok = 0

    def build_tree(current_path):
        tree = {}
        total_files = 0
        
        try:
            items = os.listdir(current_path)
        except PermissionError:
            return {}, 0
            
        for item in sorted(items):
            if item in exclude_files or item.startswith('.'):
                continue
                
            full_path = os.path.join(current_path, item)
            
            if os.path.isdir(full_path):
                if item in exclude_dirs:
                    continue
                subtree, count = build_tree(full_path)
                tree[item] = subtree
                tree[item]['_count'] = count
                total_files += count
            else:
                ext = os.path.splitext(item)[1].lower()
                rel_posix = os.path.relpath(full_path, repo_dir).replace("\\", "/")
                is_hooks_cs = ext == '.cs' and rel_posix.startswith('hooks/')
                if ext not in include_exts and not is_hooks_cs:
                    continue
                title = None
                md_keywords: list[str] = []
                md_substack_url: str | None = None
                if ext == '.md':
                    title, md_keywords, md_substack_url = _extract_md_index_fields(full_path)

                file_data = {}
                if title:
                    file_data["_title"] = title
                if is_hooks_cs:
                    cs_title = _title_from_cs_file(full_path)
                    if cs_title:
                        file_data["_title"] = cs_title
                if ext == '.md':
                    if md_keywords:
                        file_data["_keywords"] = md_keywords
                    if md_substack_url:
                        nonlocal substack_fetch_attempts, substack_fetch_ok
                        substack_fetch_attempts += 1
                        published = _fetch_substack_original_published(md_substack_url, substack_published_cache)
                        if published:
                            substack_fetch_ok += 1
                            file_data["_originalPublishedAt"] = published

                if ext in {'.jpg', '.jpeg', '.png', '.webp'}:
                    try:
                        with Image.open(full_path) as img:
                            file_data["_width"], file_data["_height"] = img.size
                    except Exception:
                        pass

                updated_iso = _index_updated_iso(full_path, repo_dir, item)
                if updated_iso:
                    file_data["_updated"] = updated_iso
                else:
                    ts = git_times.get(rel_posix)
                    if ts is not None:
                        dt = datetime.fromtimestamp(ts, tz=timezone.utc)
                        file_data["_updated"] = dt.strftime("%Y-%m-%dT%H:%M:%SZ")
                    else:
                        try:
                            mtime = os.path.getmtime(full_path)
                            dt = datetime.fromtimestamp(mtime, tz=timezone.utc)
                            file_data["_updated"] = dt.strftime("%Y-%m-%dT%H:%M:%SZ")
                        except OSError:
                            pass

                tree[item] = file_data
                total_files += 1
        
        return tree, total_files

    tree, count = build_tree(repo_dir)
    tree['_count'] = count

    # Add _version for PWA cache busting (paradigm-threat-site)
    try:
        version = subprocess.check_output(
            ['git', 'rev-parse', '--short', 'HEAD'],
            cwd=repo_dir,
            stderr=subprocess.DEVNULL,
            text=True
        ).strip()
    except (subprocess.CalledProcessError, FileNotFoundError):
        version = datetime.now(timezone.utc).strftime('%Y%m%d%H%M')
    tree['_version'] = version

    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(tree, f, **_JSON_DUMP_KW)
    
    print(f"Generated index.json with {count} files at {output_file}")
    if substack_fetch_attempts:
        print(
            f"Substack original publish dates: {substack_fetch_ok}/{substack_fetch_attempts} URLs",
            end="",
        )
        if os.environ.get("SKIP_SUBSTACK_FETCH", "").strip().lower() in ("1", "true", "yes"):
            print(" (SKIP_SUBSTACK_FETCH=1)")
        else:
            print()

if __name__ == "__main__":
    generate_index()
