import re
from pathlib import Path

content = Path(r"c:\Users\dsuth\Documents\Joshua\literacy\comprehension-web\inferencing\level-1\handout-01.html").read_text(encoding='utf-8')

for i, line in enumerate(content.splitlines(), 1):
    m = re.findall(r'font-family:\s*([^;]+)', line, re.IGNORECASE)
    if m:
        print(f"Line {i}: {line.strip()} -> {m}")
