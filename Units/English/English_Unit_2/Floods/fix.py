import os
import re

directory = r'c:\Users\dsuth\Documents\Joshua\Units\English\English_Unit_2\Floods'

# Maps old util classes to new semantic ones
class_map = {
    'util-style-1': 'text-amber-bold',
    'util-style-2': 'eyebrow-flex',
    'util-style-3': 'text-primary-light',
    'util-style-4': 'grid-2-col-gap',
    'util-style-5': 'flex-col-card',
    'util-style-6': 'meta-list-padded',
    'util-style-7': 'text-meta-upper',
    'util-style-8': 'fs-95',
    'util-style-9': 'fs-95-mb-0',
    'util-style-10': 'fs-95-mb-1',
    'util-style-11': 'fs-105',
    'util-style-12': 'fs-110',
    'util-style-13': 'fs-150-mb-15',
    'util-style-14': 'text-on-surface-variant',
    'util-style-15': 'text-220',
    'util-style-16': 'text-220-amber',
    'util-style-17': 'text-250',
    'util-style-18': 'text-250-amber-dim',
    'util-style-19': 'text-250-primary-dim',
    'util-style-20': 'text-200-primary-dim',
    'util-style-21': 'h-100',
    'util-style-22': 'h-46-bg-amber',
    'util-style-23': 'h-53',
    'util-style-24': 'h-65',
    'util-style-25': 'meta-list-bare',
    'util-style-26': 'mb-1',
    'util-style-27': 'fact-box-alt',
    'util-style-28': 'section-references',
    'util-style-29': 'breadcrumb-separator',
    'util-style-30': 'm-0',
    'util-style-31': 'hero-container',
    'util-style-32': 'container-wide',
    'util-style-33': 'img-caption-centered'
}

lightbox_images = [
    'wivenhoe_dam.png',
    'moreton_bay.png',
    'mud_army.png',
    '1893_Brisbane_flood_Queen_St.jpg',
    '194880d751f11d459067494055dc286ecf2262a8.jpg'
]

# Update CSS file
css_path = os.path.join(directory, 'index.css')
with open(css_path, 'r', encoding='utf-8') as f:
    css_content = f.read()

for old_cls, new_cls in class_map.items():
    css_content = css_content.replace(f'.{old_cls}', f'.{new_cls}')
    
with open(css_path, 'w', encoding='utf-8') as f:
    f.write(css_content)

# Update HTML files
for root_path, dirs, files in os.walk(directory):
    for filename in files:
        if filename.endswith('.html'):
            filepath = os.path.join(root_path, filename)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # 1. Update utility classes
            for old_cls, new_cls in class_map.items():
                content = re.sub(rf'\b{old_cls}\b', new_cls, content)
                
            # 2. Update Grid Layout fallbacks
            # Find the sidebar styling inside the @media (max-width: 992px)
            # The CSS structure is usually: .sidebar { margin-top: 3rem; }
            # We want to make it: padding-top: 3rem; border-top: 1px solid var(--outline-variant); margin-top: 3rem;
            old_sidebar_media = r'\.sidebar\s*\{\s*margin-top:\s*3rem;\s*\}'
            new_sidebar_media = '.sidebar {\n                margin-top: 4rem;\n                padding-top: 3rem;\n                border-top: 1px solid var(--outline-variant);\n            }'
            content = re.sub(old_sidebar_media, new_sidebar_media, content)
            
            # 3. Add lightbox-trigger classes
            for img in lightbox_images:
                # Look for <img src="...img..." ... class="..."
                # Case 1: no class attribute yet
                content = re.sub(rf'(<img\s+src="[^"]*{img}"[^>]*?)(class=")([^"]*)(")', rf'\1class="\3 lightbox-trigger"', content)
                # Case 2: doesn't have class attribute, we add it just after img 
                # Doing it conditionally to avoid doubling the class
                if f'{img}' in content:
                    lines = content.split('\n')
                    for i, line in enumerate(lines):
                        if img in line and '<img ' in line and 'class=' not in line:
                            lines[i] = line.replace('<img ', '<img class="lightbox-trigger" ')
                    content = '\n'.join(lines)

            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)

print('Success')
