import os
import re

base_dir = r"c:\Users\dsuth\Documents\Joshua\Units\English\English_Unit_2\Floods"
css_path = os.path.join(base_dir, "index.css")

# Fix index.css problems
with open(css_path, "r", encoding="utf-8") as f:
    css_content = f.read()

css_content = css_content.replace(
    "backdrop-filter: blur(12px);",
    "-webkit-backdrop-filter: blur(12px);\n  backdrop-filter: blur(12px);"
)
css_content = css_content.replace(
    "  mask-image: linear-gradient(to bottom, black 50%, transparent 100%);\n  -webkit-mask-image: linear-gradient(to bottom, black 50%, transparent 100%);",
    "  -webkit-mask-image: linear-gradient(to bottom, black 50%, transparent 100%);\n  mask-image: linear-gradient(to bottom, black 50%, transparent 100%);"
)
css_content = css_content.replace("  text-wrap: balance;\n", "")

html_files = [
    'Brisbane_History/index.html',
    'Brisbane_River_System/index.html',
    'How_Floods_Work/index.html',
    'Human_Cost/index.html',
    'The_Future/index.html',
    'index.html'
]

inline_styles = set()
style_to_class = {}

for relative_path in html_files:
    file_path = os.path.join(base_dir, relative_path.replace("/", "\\"))
    if not os.path.exists(file_path): continue
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
        matches = re.findall(r'style="([^"]+)"', content)
        for m in matches:
            inline_styles.add(m)

css_append = []
class_counter = 1

for style in sorted(inline_styles):
    if "max-width: 800px" in style: cls = "mw-800"
    elif style == "margin-top: 3rem;": cls = "mt-3rem"
    elif style == "margin-top: 4rem; margin-bottom: 4rem;": cls = "my-4rem"
    elif style == "margin-bottom: 5rem;": cls = "mb-5rem"
    elif "width: 100%" in style and "border-radius" in style: cls = "w-full-rounded"
    elif "font-size: 1.2rem" in style: cls = "text-xl"
    else:
        cls = f"util-style-{class_counter}"
        class_counter += 1
        
    style_to_class[style] = cls
    css_append.append(f".{cls} {{ {style} }}")

with open(css_path, "w", encoding="utf-8") as f:
    f.write(css_content)
    if css_append:
        f.write("\n\n/* Extracted Utility Classes */\n")
        f.write("\n".join(css_append) + "\n")

for relative_path in html_files:
    file_path = os.path.join(base_dir, relative_path.replace("/", "\\"))
    if not os.path.exists(file_path): continue
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    def replacer(match):
        full_tag = match.group(0)
        style_match = re.search(r'style="([^"]+)"', full_tag)
        if not style_match: return full_tag
        
        style_content = style_match.group(1)
        cls = style_to_class.get(style_content)
        if not cls: return full_tag
        
        new_tag = re.sub(r'\s*style="[^"]+"', '', full_tag)
        
        class_match = re.search(r'class="([^"]+)"', new_tag)
        if class_match:
            existing_classes = class_match.group(1)
            new_tag = new_tag.replace(f'class="{existing_classes}"', f'class="{existing_classes} {cls}"')
        else:
            if new_tag.endswith("/>"):
                new_tag = new_tag[:-2] + f' class="{cls}"/>'
            elif new_tag.endswith(">"):
                new_tag = new_tag[:-1] + f' class="{cls}">'
        return new_tag

    new_content = re.sub(r'<[a-zA-Z0-9]+[^>]*style="[^"]+"[^>]*>', replacer, content)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)

print(f"Extracted {len(inline_styles)} inline styles.")
