import os
import re
import json
import subprocess
from datetime import datetime, timezone
from typing import Dict, Optional

from PIL import Image

# Blog list UI (AutoIndex format=blog) sorts and labels by _updated. Dated posts under
# blog/ use the YYYY-MM-DD prefix from the filename as stable UTC noon for _updated.
# All other tracked files use the committer date of the latest commit that touched
# each path (one `git log` pass); untracked or missing paths fall back to mtime.
_BLOG_DATED_MD = re.compile(r"^(\d{4}-\d{2}-\d{2})-.+\.md$")
_KEYWORDS_LINE_RE = re.compile(r"^Keywords:\s*(.+)$", re.MULTILINE | re.IGNORECASE)

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


def _extract_keywords_from_markdown_file(full_path: str) -> list[str]:
    """Parse hashtag tokens from a Keywords: line (Option B: no hyphens inside tags)."""
    try:
        with open(full_path, "r", encoding="utf-8") as f:
            content = f.read()
    except OSError:
        return []
    m = _KEYWORDS_LINE_RE.search(content)
    if not m:
        return []
    # One token per #… run; disallow '-' so kebab tags fail indexing until fixed.
    return re.findall(r"#([^\s#\-]+)", m.group(1))


def _strip_markdown_lite(text: str) -> str:
    text = re.sub(r"```[\s\S]*?```", " ", text)
    text = re.sub(r"`([^`]+)`", r"\1", text)
    text = re.sub(r"!\[[^\]]*\]\([^)]*\)", " ", text)
    text = re.sub(r"\[([^\]]*)\]\([^)]*\)", r"\1", text)
    text = re.sub(r"\*\*([^*]+)\*\*", r"\1", text)
    text = re.sub(r"\*([^*]+)\*", r"\1", text)
    text = re.sub(r"^#{1,6}\s+", "", text, flags=re.MULTILINE)
    text = re.sub(r"^>\s?", "", text, flags=re.MULTILINE)
    text = re.sub(r"\*\*TL;DR:\*\*\s*", " ", text, flags=re.IGNORECASE)
    text = re.sub(r"TL;DR:\s*", " ", text, flags=re.IGNORECASE)
    text = re.sub(
        r"\b[\w./-]+\.(?:jpg|jpeg|png|gif|webp|svg|mp4|webm|pdf)\b",
        " ",
        text,
        flags=re.IGNORECASE,
    )
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def _extract_tldr_plain(content: str) -> str:
    lines = content.split("\n")
    for i, line in enumerate(lines):
        trimmed = line.strip()
        if not trimmed.startswith(">"):
            continue
        inner = re.sub(r"^>\s?", "", trimmed)
        if not re.match(r"(\*\*)?TL;DR:", inner, re.IGNORECASE):
            continue
        block: list[str] = []
        for j in range(i, len(lines)):
            tl = lines[j].strip()
            if tl.startswith(">"):
                block.append(re.sub(r"^>\s?", "", tl))
            elif block:
                break
        joined = "\n".join(block)
        joined = re.sub(r"^\*\*TL;DR:\*\*\s*", "", joined, flags=re.IGNORECASE)
        joined = re.sub(r"^TL;DR:\s*", "", joined, flags=re.IGNORECASE)
        return _strip_markdown_lite(joined)
    return ""


def _extract_search_snippet_from_markdown_file(full_path: str, max_body_chars: int = 1200) -> str | None:
    """Plain-text TL;DR + body excerpt for site search (path/title/keywords alone miss body terms)."""
    try:
        with open(full_path, "r", encoding="utf-8") as f:
            content = f.read()
    except OSError:
        return None

    parts: list[str] = []
    tldr = _extract_tldr_plain(content)
    if tldr:
        parts.append(tldr)

    body = re.sub(r"\nKeywords:\s*.+$", "", content, flags=re.IGNORECASE | re.DOTALL)
    body = re.sub(r"^#\s+.+\n", "", body, count=1)
    plain = _strip_markdown_lite(body)
    if len(plain) > max_body_chars:
        plain = plain[:max_body_chars].rsplit(" ", 1)[0]
    if plain:
        parts.append(plain)

    snippet = " ".join(p for p in parts if p).strip()
    return snippet or None


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
                # Extract title for .md files (first # heading only)
                title = None
                if ext == '.md':
                    try:
                        with open(full_path, 'r', encoding='utf-8') as f:
                            for _ in range(20):
                                line = f.readline()
                                if not line: break
                                line = line.strip()
                                if line.startswith('# '):
                                    title = line[2:].strip()
                                    break
                    except Exception:
                        pass
                
                file_data = {}
                if title:
                    file_data["_title"] = title
                if is_hooks_cs:
                    cs_title = _title_from_cs_file(full_path)
                    if cs_title:
                        file_data["_title"] = cs_title
                if ext == '.md':
                    kw = _extract_keywords_from_markdown_file(full_path)
                    if kw:
                        file_data["_keywords"] = kw
                    snippet = _extract_search_snippet_from_markdown_file(full_path)
                    if snippet:
                        file_data["_searchSnippet"] = snippet

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

if __name__ == "__main__":
    generate_index()
