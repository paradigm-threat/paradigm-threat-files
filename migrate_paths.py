import os
import re

# Mapping from older paths to new hierarchical paths
MAPPING = [
    # More specific first
    ('conspiracy/hollywood/', 'influence/hollywood/'),
    ('conspiracy/flat_earth/', 'cosmos/flat_earth/'),
    ('conspiracy/5g/', 'science/5g/'),
    ('conspiracy/anti_gravity/', 'science/anti_gravity/'),
    ('conspiracy/health/', 'science/health/'),
    ('conspiracy/nukes/', 'science/nukes/'),
    ('conspiracy/telepathy/', 'science/telepathy/'),
    ('conspiracy/geoengineering/', 'science/geoengineering/'),
    ('conspiracy/911/', 'events/911/'),
    ('conspiracy/apollo/', 'events/apollo/'),
    ('conspiracy/false_flag/', 'events/false_flag/'),
    ('conspiracy/jfk/', 'events/jfk/'),
    ('conspiracy/philadelphia/', 'events/philadelphia/'),
    ('chronology/', 'history/chronology/'),
    ('maps/', 'history/maps/'),
    ('mudflood/', 'history/mudflood/'),
    ('usury/', 'governance/usury/'),
    ('war/', 'governance/war/'),
    ('genocide/', 'governance/genocide/'),
    ('censorship/', 'influence/censorship/'),
    ('predictive_programming/', 'influence/predictive_programming/'),
    ('conspiracy/', 'influence/conspiracy/'),
    ('cosmology/', 'cosmos/cosmology/'),
    ('mars/', 'cosmos/mars/')
]

# We should also handle variants without trailing slashes for links
MAPPING_NO_SLASH = [(old.rstrip('/'), new.rstrip('/')) for old, new in MAPPING]

# Combine and sort by length descending to match most specific first
ALL_MAPPINGS = sorted(MAPPING + MAPPING_NO_SLASH, key=lambda x: len(x[0]), reverse=True)

TARGET_DIR = '/home/ari/dev/paradigm-threat-files'

def migrate_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original_content = content
    
    for old, new in ALL_MAPPINGS:
        # Regex to match the path. Avoid double matching already migrated paths.
        # We look for path fragments that are either:
        # 1. Preceded by / or ./ or (
        # 2. At the start of a quoted string or link
        
        # Simple string replacement for now, but we check if we already have the 'new' part
        # to avoid influence/influence/conspiracy
        
        # Check for /old or ./old or "old or 'old or (old
        # or just old if it's at the start of a link
        
        # Actually, the user's grep showed things like [Text](/conspiracy/911)
        # and src="./conspiracy/embedding.jpg"
        
        # Pattern to find the path not preceded by the new parent directories
        # This is tricky because some new paths share parts with old ones (e.g. conspiracy -> influence/conspiracy)
        
        # Let's try to match strictly old paths that AREN'T preceded by their new category
        # But for 'conspiracy' -> 'influence/conspiracy', we just need to make sure we don't
        # turn 'influence/conspiracy' into 'influence/influence/conspiracy'
        
        # Pattern matches /old, ./old, or just old if preceded by common link characters
        pattern = r'(?P<prefix>[\./"\'\(\[])' + re.escape(old)
        
        def replace_func(match):
            prefix = match.group('prefix')
            # Check if this occurrence is already migrated
            # We look at the context before the prefix if it's a slash
            return prefix + new

        content = re.sub(pattern, replace_func, content)
        
        # Also handle cases where it starts at the beginning of the line or in a property
        pattern_start = r'(?<=^)' + re.escape(old)
        content = re.sub(pattern_start, new, content, flags=re.MULTILINE)

    if content != original_content:
        # One last check to fix double migration if it happened
        # (e.g. influence/influence/conspiracy)
        for _, new in ALL_MAPPINGS:
            double_path = new + new.split('/')[-1] if new.endswith('/') else new + '/' + new.split('/')[-1]
            # This is hard to generalize safely. 
            # Let's just fix the known ones.
            parts = new.strip('/').split('/')
            if len(parts) > 1:
                # e.g. influence/conspiracy
                parent = parts[0]
                child = parts[1]
                # fix parent/parent/child
                content = content.replace(f'{parent}/{parent}/{child}', f'{parent}/{child}')

        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

def main():
    count = 0
    for root, dirs, files in os.walk(TARGET_DIR):
        if '.git' in dirs:
            dirs.remove('.git')
        for file in files:
            if file.endswith('.md') or file.endswith('.mdx'):
                if migrate_file(os.path.join(root, file)):
                    count += 1
                    print(f"Migrated: {os.path.join(root, file)}")
    print(f"Finished. Migrated {count} files.")

if __name__ == "__main__":
    main()
