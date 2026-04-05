import os
import re
import json
import base64
import io
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


def _extract_keywords_from_markdown_file(full_path: str) -> list[str]:
    """Parse hashtag tokens from a Keywords: line (append_article_keywords.py)."""
    try:
        with open(full_path, "r", encoding="utf-8") as f:
            content = f.read()
    except OSError:
        return []
    m = _KEYWORDS_LINE_RE.search(content)
    if not m:
        return []
    return re.findall(r"#([a-zA-Z0-9\-]+)", m.group(1))


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

def get_lqip(image_path):
    """Generates a 16x16 base64-encoded WebP LQIP string for an image."""
    try:
        with Image.open(image_path) as img:
            img.thumbnail((16, 16))
            
            if img.mode in ("RGBA", "P"):
                img = img.convert("RGBA")
            else:
                img = img.convert("RGB")
            
            buffer = io.BytesIO()
            img.save(buffer, format="WEBP", quality=20)
            base64_str = base64.b64encode(buffer.getvalue()).decode('utf-8')
            return f"data:image/webp;base64,{base64_str}"
    except Exception:
        return None

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
                if ext in include_exts:
                    # Extract title for .md files
                    title = None
                    if ext == '.md':
                        try:
                            with open(full_path, 'r', encoding='utf-8') as f:
                                for _ in range(20): # Check first 20 lines
                                    line = f.readline()
                                    if not line: break
                                    line = line.strip()
                                    if line.startswith('# '):
                                        title = line[2:].strip()
                                        break
                                    # Handle YAML frontmatter title if no # header
                                    if line.startswith('title:'):
                                        title = line[6:].strip().strip('"').strip("'")
                                        break
                        except Exception:
                            pass
                    
                    file_data = {}
                    if title:
                        file_data["_title"] = title
                    if ext == '.md':
                        kw = _extract_keywords_from_markdown_file(full_path)
                        if kw:
                            file_data["_keywords"] = kw

                    if ext in {'.jpg', '.jpeg', '.png', '.webp'}:
                        try:
                            with Image.open(full_path) as img:
                                file_data["_width"], file_data["_height"] = img.size
                        except Exception:
                            pass
                        lqip = get_lqip(full_path)
                        if lqip:
                            file_data["_lqip"] = lqip

                    updated_iso = _index_updated_iso(full_path, repo_dir, item)
                    if updated_iso:
                        file_data["_updated"] = updated_iso
                    else:
                        rel_posix = os.path.relpath(full_path, repo_dir).replace("\\", "/")
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

    with open(output_file, 'w') as f:
        json.dump(tree, f, indent=2)
    
    print(f"Generated index.json with {count} files at {output_file}")

if __name__ == "__main__":
    generate_index()
