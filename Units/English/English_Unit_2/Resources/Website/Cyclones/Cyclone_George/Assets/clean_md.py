import re

def clean_markdown(content):
    # 1. Remove the repeated title blocks at the start
    content = re.sub(r'(?i)Meteorological Aspects of Severe Tropical Cyclone\s+George’s Impact on the Pilbara\s+27 February – 12 March 2007\s*', '', content, count=2)
    
    # 2. Fix broken lines within paragraphs
    # We look for a newline followed by a lowercase letter or a common continuation
    # This is tricky because of the Markdown formatting.
    # Let's try a different approach: join lines that don't end in a period, colon, or question mark,
    # unless the next line starts with a Markdown symbol like #, !, -, or a number.
    lines = content.split('\n')
    cleaned_lines = []
    buffer = ""
    
    for line in lines:
        stripped = line.strip()
        if not stripped:
            if buffer:
                cleaned_lines.append(buffer)
                buffer = ""
            cleaned_lines.append("")
            continue
        
        # If the line is a header or an image/list/appendix, flush the buffer
        if stripped.startswith(('#', '!', '*', '-', 'Table:', '---')) or re.match(r'^\d+\.', stripped) or re.match(r'^Appendix [A-Z]', stripped):
            if buffer:
                cleaned_lines.append(buffer)
                buffer = ""
            cleaned_lines.append(line)
            continue
            
        if buffer:
            buffer += " " + stripped
        else:
            buffer = stripped
            
        # If it ends with a sentence terminator, flush it
        if stripped.endswith(('.', ':', '?', ';')):
            cleaned_lines.append(buffer)
            buffer = ""
            
    if buffer:
        cleaned_lines.append(buffer)

    new_content = "\n".join(cleaned_lines)
    
    # 3. Clean up specific redundant captions (the script added markdown, but the text had the old caption)
    # The pattern is usually ![]() \n *Caption* \n Figure X. Caption
    new_content = re.sub(r'(!\[.*?\]\(.*?\)\n\*.*?\*)\n+(Figure [A-Z0-9.]+.*)', r'\1', new_content)
    
    # 4. Fix specific duplicate figures (like E5)
    new_content = re.sub(r'(!\[Figure E5.*?\]\(.*?\)\n\*Figure E5.*?\*)\n+Figure E5\.\s+\1', r'\1', new_content)
    
    # 5. Format headers
    new_content = re.sub(r'^Summary', r'## Summary', new_content, flags=re.M)
    new_content = re.sub(r'^(\d+)\.\s*\n*(.*)', r'## \1. \2', new_content, flags=re.M)
    new_content = re.sub(r'^(\d+-\d+ \w+)', r'### \1', new_content, flags=re.M)
    new_content = re.sub(r'^(\d+ \w+)', r'### \1', new_content, flags=re.M)
    new_content = re.sub(r'^(Formation|Abrupt southerly track shift|Intensification continues.*|Characteristics of TC George.*|Peak intensity|Radius to.*|Gale periods.*|Rate of weakening.*|De Grey Pastoral Station|Port Hedland|Storm surge|Inland|Wind|Rainfall|Summary of Warnings|Track forecast performance)', r'### \1', new_content, flags=re.M)
    new_content = re.sub(r'^(Appendix [A-Z]\..*)', r'## \1', new_content, flags=re.M)
    
    # 6. Final Polish
    # Remove triple newlines
    new_content = re.sub(r'\n{3,}', '\n\n', new_content)
    # Add a main title
    main_title = "# Meteorological Aspects of Severe Tropical Cyclone George’s Impact on the Pilbara\n\n**27 February – 12 March 2007**\n\nPerth Tropical Cyclone Warning Centre\nBureau of Meteorology\n12 October 2007\n\n---\n\n"
    new_content = main_title + new_content
    
    return new_content

with open("Cyclone_George_Digest.md", "r", encoding="utf-8") as f:
    text = f.read()

cleaned = clean_markdown(text)

with open("Cyclone_George_Digest.md", "w", encoding="utf-8") as f:
    f.write(cleaned)

print("Proofreading and paragraphing cleanup complete.")
