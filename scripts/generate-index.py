import os
import json
import base64
import io
import subprocess
from datetime import datetime, timezone
from PIL import Image

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
                    
                    if ext in {'.jpg', '.jpeg', '.png', '.webp'}:
                        try:
                            with Image.open(full_path) as img:
                                file_data["_width"], file_data["_height"] = img.size
                        except Exception:
                            pass
                        lqip = get_lqip(full_path)
                        if lqip:
                            file_data["_lqip"] = lqip

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
