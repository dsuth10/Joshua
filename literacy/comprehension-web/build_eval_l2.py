import os
import re
import sys

# Add base_dir to path so we can import from build_all
sys.path.append(r"c:\Users\dsuth\Documents\Joshua\literacy\comprehension-web")
from build_all import compile_handout, generate_index_html, base_dir

# Path to Evaluation Level 2 markdown content
content_l2_dir = r"c:\Users\dsuth\Documents\Joshua\literacy\comprehension-web\content\evaluation\level-2"

def parse_part_format(content):
    # Part 1
    part1_sec = re.search(r'## Part 1: Quick Evaluation[\s\S]+?(?=## Part 2)', content)
    if not part1_sec:
        return None
        
    part1_content = part1_sec.group(0)
    # Match blockquotes and their questions
    blocks = re.findall(r'>\s*(.+?)\s*\n+\*\s*\*\*Question:\*\*\s*(.+)', part1_content)
    
    passages_p1 = [b[0].strip() for b in blocks]
    questions_p1 = [b[1].strip() for b in blocks]
    
    # Part 2
    part2_match = re.search(
        r'## Part 2: Short Passage Evaluation[\s\S]+?### Question 4:\s*(.+?)\n([\s\S]+?)\n\*\s*\*\*Questions:\*\*\s*\n([\s\S]+?)(?=## Part 3|\Z)',
        content
    )
    if not part2_match:
        return None
        
    title_p2 = part2_match.group(1).strip()
    passage_p2 = re.sub(r'^>\s*', '', part2_match.group(2).strip(), flags=re.MULTILINE)
    questions_p2_raw = part2_match.group(3)
    
    questions_p2 = []
    for line in questions_p2_raw.split("\n"):
        q_match = re.search(r'\*\s*\*\*[a-z]\.\*\*\s*(.+)', line)
        if q_match:
            questions_p2.append(q_match.group(1).strip())
            
    # Part 3
    part3_match = re.search(
        r'## Part 3: Text Comprehension & Evaluation[\s\S]+?### Question 5:\s*(.+?)\n([\s\S]+?)\n\*\s*\*\*Questions:\*\*\s*\n([\s\S]+?)(?=\Z)',
        content
    )
    if not part3_match:
        part3_match = re.search(
            r'## Part 3: Text Comprehension & Evaluation[\s\S]+?### Question 5:\s*(.+?)\n([\s\S]+?)\n\*\s*\*\*Questions:\*\*\s*\n([\s\S]+)',
            content
        )
        
    if not part3_match:
        return None
        
    title_p3 = part3_match.group(1).strip()
    passage_p3 = re.sub(r'^>\s*', '', part3_match.group(2).strip(), flags=re.MULTILINE)
    questions_p3_raw = part3_match.group(3)
    
    questions_p3 = []
    for line in questions_p3_raw.split("\n"):
        q_match = re.search(r'\*\s*\*\*[a-z]\.\*\*\s*(.+)', line)
        if q_match:
            questions_p3.append(q_match.group(1).strip())
            
    return {
        "p1_passages": passages_p1,
        "p1_questions": questions_p1,
        "p2_title": title_p2,
        "p2_passage": passage_p2,
        "p2_questions": questions_p2,
        "p3_title": title_p3,
        "p3_passage": passage_p3,
        "p3_questions": questions_p3
    }

def parse_markdown_handout(filepath):
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
        
    # Split sections by '---'
    sections_raw = content.split("---")
    sections = []
    
    for sec_raw in sections_raw:
        sec_raw = sec_raw.strip()
        if not sec_raw:
            continue
            
        title_match = re.search(r'^##\s+(.+)$', sec_raw, re.MULTILINE)
        if not title_match:
            continue
        title = title_match.group(1).strip()
        
        parts = re.split(r'###\s+Questions', sec_raw, flags=re.IGNORECASE)
        story_part = parts[0].strip()
        questions_part = parts[1].strip() if len(parts) > 1 else ""
        
        story_lines = []
        for line in story_part.split("\n"):
            line_str = line.strip()
            if not line_str or line_str.startswith("#"):
                continue
            story_lines.append(line_str)
        story_text = "\n\n".join(story_lines)
        
        questions = []
        for line in questions_part.split("\n"):
            line_str = line.strip()
            if not line_str:
                continue
            q_match = re.match(r'^(?:\*|-|\d+\.|\b[a-z]\s*\.\s+)\s*(.+)$', line_str, re.IGNORECASE)
            if q_match:
                questions.append(q_match.group(1).strip())
            elif line_str.endswith("?"):
                questions.append(line_str)
                
        if title and story_text and questions:
            sections.append({
                "title": title,
                "passage": story_text,
                "questions": questions
            })
            
    return sections

# List of handouts to build: handout num -> filename mapping
handouts_mapping = {
    1: "handout-01.md",
    2: "handout-02.md",
    3: "handout-03.md",
    4: "handout-04.md",
    6: "handout-06-bridge.md",
    7: "handout-07-bridge.md"
}

handouts_info = []

for num, fname in handouts_mapping.items():
    filepath = os.path.join(content_l2_dir, fname)
    
    if num in [1, 2, 3, 4]:
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()
        res = parse_part_format(content)
        if not res:
            raise ValueError(f"Failed to parse {fname} in Part format")
            
        handout_data = [
            {
                "id": "quick-evaluation",
                "title": "Part 1: Quick Evaluation",
                "short_title": "Quick Evaluation",
                "passages": res["p1_passages"],
                "questions": res["p1_questions"],
            },
            {
                "id": res["p2_title"].lower().replace(" ", "-"),
                "title": res["p2_title"],
                "short_title": res["p2_title"],
                "passage": res["p2_passage"],
                "questions": res["p2_questions"],
            },
            {
                "id": res["p3_title"].lower().replace(" ", "-"),
                "title": res["p3_title"],
                "short_title": res["p3_title"],
                "passage": res["p3_passage"],
                "questions": res["p3_questions"],
            }
        ]
        desc = f"Quick Evaluation, {res['p2_title']}, and {res['p3_title']}"
        
    elif num == 6:
        raw_sections = parse_markdown_handout(filepath)
        p_list = raw_sections[0:3]
        t_list = raw_sections[3:4]
        
        handout_data = [
            {
                "id": "quick-evaluation",
                "title": "Part 1: Quick Evaluation",
                "short_title": "Quick Evaluation",
                "passages": [x["passage"] for x in p_list],
                "questions": [x["questions"][0] for x in p_list],
            },
            {
                "id": t_list[0]["title"].lower().replace(" ", "-"),
                "title": t_list[0]["title"],
                "short_title": t_list[0]["title"],
                "passage": t_list[0]["passage"],
                "questions": t_list[0]["questions"],
            }
        ]
        desc = f"Quick Evaluation and {t_list[0]['title']}"
        
    elif num == 7:
        raw_sections = parse_markdown_handout(filepath)
        s_list = raw_sections[0:1]
        t_list = raw_sections[1:2]
        
        handout_data = [
            {
                "id": s_list[0]["title"].lower().replace(" ", "-"),
                "title": s_list[0]["title"],
                "short_title": s_list[0]["title"],
                "passage": s_list[0]["passage"],
                "questions": s_list[0]["questions"],
            },
            {
                "id": t_list[0]["title"].lower().replace(" ", "-"),
                "title": t_list[0]["title"],
                "short_title": t_list[0]["title"],
                "passage": t_list[0]["passage"],
                "questions": t_list[0]["questions"],
            }
        ]
        desc = f"{s_list[0]['title']} and {t_list[0]['title']}"
        
    # Compile handout (generates HTML and JSON marking guide)
    compile_handout("evaluation", 2, num, handout_data)
    
    # Store description for the index page
    handouts_info.append({"num": num, "desc": desc})

# Sort and generate the level index
handouts_info.sort(key=lambda x: x["num"])
generate_index_html("evaluation", 2, handouts_info)
print("Finished building Evaluation Level 2!")
