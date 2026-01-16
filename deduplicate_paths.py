import os

# Categories to check for doubling
CATEGORIES = ['history', 'governance', 'influence', 'cosmos', 'science', 'events']

TARGET_DIR = '/home/ari/dev/paradigm-threat-files'

def deduplicate_paths(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original_content = content
    
    for cat in CATEGORIES:
        # Fix /cat/cat/
        content = content.replace(f'/{cat}/{cat}/', f'/{cat}/')
        # Fix ./cat/cat/
        content = content.replace(f'./{cat}/{cat}/', f'./{cat}/')
        # Fix (cat/cat/
        content = content.replace(f'({cat}/{cat}/', f'({cat}/')

    # Also fix some specific doubles noticed in grep
    content = content.replace('apolloapollo', 'apollo')
    content = content.replace('covid19ovid19', 'covid19')

    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

def main():
    count = 0
    for root, dirs, files in os.walk(TARGET_DIR):
        for file in files:
            if file.endswith('.md') or file.endswith('.mdx'):
                if deduplicate_paths(os.path.join(root, file)):
                    count += 1
    print(f"Finished. Deduplicated {count} files.")

if __name__ == "__main__":
    main()
