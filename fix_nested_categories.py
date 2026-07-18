import os

CATEGORIES = ['history', 'governance', 'influence', 'cosmos', 'science', 'events']

TARGET_DIR = '/home/ari/dev/paradigm-threat-files'

def fix_nested_categories(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original_content = content
    
    for cat1 in CATEGORIES:
        for cat2 in CATEGORIES:
            if cat1 == cat2:
                continue
            # Fix /cat1/cat2/ to /cat2/
            content = content.replace(f'/{cat1}/{cat2}/', f'/{cat2}/')
            content = content.replace(f'./{cat1}/{cat2}/', f'./{cat2}/')
            # Also handle without trailing slash if relevant for the link
            content = content.replace(f'/{cat1}/{cat2}', f'/{cat2}')

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
                if fix_nested_categories(os.path.join(root, file)):
                    count += 1
    print(f"Finished. Fixed {count} files.")

if __name__ == "__main__":
    main()
