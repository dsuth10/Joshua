import json
import os
import re
import uuid

# Paths
base_dir = r"c:\Users\dsuth\Documents\Joshua\literacy\comprehension-web"
scratch_dir = r"C:\Users\dsuth\.gemini\antigravity-ide\brain\ee62f3da-bd8f-4bd3-9567-7e3d4a77871e\scratch"
content_dir = os.path.join(base_dir, "content")
marking_guides_dir = os.path.join(base_dir, "marking-guides")

# Helper to normalize text
def norm(txt):
    if not txt:
        return ""
    txt = txt.replace('\xa0', ' ')
    txt = txt.replace('’', "'")
    txt = txt.replace('‘', "'")
    txt = txt.replace('“', '"')
    txt = txt.replace('”', '"')
    txt = re.sub(r'\s+', ' ', txt)
    return txt.strip()

# Clean HTML text
def escape_html(txt):
    return txt.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;').replace('"', '&quot;').replace("'", '&#039;')

# Color tokens by skill and level
COLOR_TOKENS = {
    "inferencing": {
        1: {"accent": "#6BA3C9", "light": "#EAF4FA", "hover": "#4F8FB8", "dark_accent": "#7EB8D9", "dark_light": "#0F2433", "dark_hover": "#9CC9E3"},
        2: {"accent": "#2F6F95", "light": "#E3F0F7", "hover": "#245A7A", "dark_accent": "#4A9BC4", "dark_light": "#0C2230", "dark_hover": "#6BB0D1"},
        3: {"accent": "#1A3F5C", "light": "#DCE8F0", "hover": "#142F45", "dark_accent": "#5A9BC4", "dark_light": "#0A1C28", "dark_hover": "#7AAFCF"}
    },
    "evaluation": {
        1: {"accent": "#4AA8B5", "light": "#E8F6F8", "hover": "#3A8F9A", "dark_accent": "#5EC4D1", "dark_light": "#0C2A30", "dark_hover": "#7AD0DB"},
        2: {"accent": "#0E7490", "light": "#ECFEFF", "hover": "#0891B2", "dark_accent": "#06B6D4", "dark_light": "#083344", "dark_hover": "#22D3EE"},
        3: {"accent": "#0F4C5C", "light": "#E0F2F5", "hover": "#0A3A46", "dark_accent": "#2BB3C9", "dark_light": "#082830", "dark_hover": "#4DC4D6"}
    },
    "reorganization": {
        1: {"accent": "#9B8EC4", "light": "#F3F0FA", "hover": "#8474B3", "dark_accent": "#B3A5DB", "dark_light": "#1E1830", "dark_hover": "#C4B8E6"},
        2: {"accent": "#6D5A9C", "light": "#EDE9F6", "hover": "#5A4985", "dark_accent": "#9B87C9", "dark_light": "#1A1430", "dark_hover": "#B09AD6"},
        3: {"accent": "#3F2F66", "light": "#E8E4F2", "hover": "#322553", "dark_accent": "#A78BDA", "dark_light": "#161028", "dark_hover": "#BBA3E3"}
    }
}

SKILL_LABELS = {
    "inferencing": "Inferencing",
    "evaluation": "Evaluation",
    "reorganization": "Reorganisation"
}

# Parsers
def parse_inference():
    with open(os.path.join(scratch_dir, "inference_final.json"), "r", encoding="utf-8") as f:
        paragraphs = json.load(f)
        
    items = []
    current_level = ""
    current_set = ""
    current_set_type = ""
    
    for idx, p in enumerate(paragraphs):
        text = norm(p["text"])
        if not text:
            continue
            
        set_match = re.search(r'\bSET\s+(S|P|T|5)(\d+)\b', text, re.IGNORECASE)
        if set_match:
            s_type = set_match.group(1).upper()
            if s_type == "5":
                s_type = "S"
            s_num = int(set_match.group(2))
            current_set_type = s_type
            current_set = f"{s_type}{s_num}"
            continue
            
        level_match = re.search(r'^(?:KEY LEVEL|Key Level|LEVEL)\s+(ONE|TWO|THREE)\b', text, re.IGNORECASE)
        if level_match:
            lvl_word = level_match.group(1).upper()
            current_level = "LEVEL_1" if lvl_word == "ONE" else ("LEVEL_2" if lvl_word == "TWO" else "LEVEL_3")
            current_set = ""
            continue
            
        if not current_level or not current_set:
            continue
            
        if current_set_type == "S":
            sent_match = re.match(r'^(\d+)\.\s*(.*)$', text)
            if sent_match:
                num = int(sent_match.group(1))
                sentence = sent_match.group(2).strip()
                q_idx = idx + 1
                question = ""
                while q_idx < len(paragraphs):
                    q_text = norm(paragraphs[q_idx]["text"])
                    if q_text:
                        question = q_text
                        break
                    q_idx += 1
                items.append({
                    "level": current_level,
                    "set": current_set,
                    "type": "sentence",
                    "num": num,
                    "title": f"Sentence {num}",
                    "passage": sentence,
                    "questions": [question]
                })
                
        elif current_set_type in ["P", "T"]:
            item_match = re.match(r'^(?:ITEM|PRACTISE ITEM|PRACTISE\s+ITEM)\s*(\d+)\s*(.*)$', text, re.IGNORECASE)
            if item_match:
                num = int(item_match.group(1))
                title = item_match.group(2).strip()
                item_lines = []
                j = idx + 1
                while j < len(paragraphs):
                    next_text = norm(paragraphs[j]["text"])
                    if not next_text:
                        j += 1
                        continue
                    if re.match(r'^(?:ITEM|PRACTISE ITEM|PRACTISE\s+ITEM)\s*\d+', next_text, re.IGNORECASE) or "KEY into" in next_text or "LEVEL" in next_text or "SET" in next_text:
                        break
                    item_lines.append(next_text)
                    j += 1
                
                passage_paragraphs = []
                questions = []
                for line in item_lines:
                    if re.match(r'^[a-z]\s*\.?\\?\s+', line, re.IGNORECASE) or line.startswith("QUESTION:") or line.endswith("?"):
                        q_clean = re.sub(r'^[a-z]\s*\.?\\?\s+', '', line).strip()
                        if q_clean.startswith("QUESTION:"):
                            q_clean = q_clean.replace("QUESTION:", "").strip()
                        if q_clean:
                            questions.append(q_clean)
                    else:
                        if not any(line.startswith(prefix) for prefix in ["ANSWER:", "KEY WORDS:", "KEYWORDS:", "NOTE:", "PRACTISE"]):
                            passage_paragraphs.append(line)
                            
                passage = "\n\n".join(passage_paragraphs)
                items.append({
                    "level": current_level,
                    "set": current_set,
                    "type": "paragraph" if current_set_type == "P" else "text",
                    "num": num,
                    "title": title or f"Passage {num}",
                    "passage": passage,
                    "questions": questions
                })
                
    return items

def parse_reorganisation():
    with open(os.path.join(scratch_dir, "reorganisation_final.json"), "r", encoding="utf-8") as f:
        paragraphs = json.load(f)
        
    items = []
    current_level = ""
    current_set = ""
    current_set_type = ""
    
    for idx, p in enumerate(paragraphs):
        text = norm(p["text"])
        if not text:
            continue
            
        set_match = re.search(r'\bSET\s+(S|P|T|C)(\d+)\b', text, re.IGNORECASE)
        if not set_match:
            set_match = re.search(r'\bSET\s+TS\b', text, re.IGNORECASE)
            
        if set_match:
            if "TS" in set_match.group(0):
                s_type = "T"
                s_num = 8
            else:
                s_type = set_match.group(1).upper()
                s_num = int(set_match.group(2))
            current_set_type = s_type
            current_set = f"{s_type}{s_num}"
            continue
            
        level_match = re.search(r'^(?:KEY LEVEL|Key Level|LEVEL)\s+(ONE|TWO|THREE)\b', text, re.IGNORECASE)
        if level_match:
            lvl_word = level_match.group(1).upper()
            current_level = "LEVEL_1" if lvl_word == "ONE" else ("LEVEL_2" if lvl_word == "TWO" else "LEVEL_3")
            current_set = ""
            continue
            
        if not current_level or not current_set:
            continue
            
        # Parse P, C, S, T items in Reorganisation
        item_match = re.match(r'^(?:ITEM|PRACTISE ITEM|PRACTISE\s+ITEM)\s*(\d+)\s*(.*)$', text, re.IGNORECASE)
        if item_match:
            num = int(item_match.group(1))
            title = item_match.group(2).strip()
            item_lines = []
            j = idx + 1
            while j < len(paragraphs):
                next_text = norm(paragraphs[j]["text"])
                if not next_text:
                    j += 1
                    continue
                if re.match(r'^(?:ITEM|PRACTISE ITEM|PRACTISE\s+ITEM)\s*\d+', next_text, re.IGNORECASE) or "KEY into" in next_text or "LEVEL" in next_text or "SET" in next_text:
                    break
                item_lines.append(next_text)
                j += 1
            
            passage_paragraphs = []
            questions = []
            for line in item_lines:
                if re.match(r'^[a-z]\s*\.?\\?\s+', line, re.IGNORECASE) or line.startswith("QUESTION:") or line.endswith("?"):
                    q_clean = re.sub(r'^[a-z]\s*\.?\\?\s+', '', line).strip()
                    if q_clean.startswith("QUESTION:"):
                        q_clean = q_clean.replace("QUESTION:", "").strip()
                    if q_clean:
                        questions.append(q_clean)
                else:
                    if not any(line.startswith(prefix) for prefix in ["ANSWER:", "KEY WORDS:", "KEYWORDS:", "NOTE:", "PRACTISE", "REFERENT:"]):
                        passage_paragraphs.append(line)
                        
            passage = "\n\n".join(passage_paragraphs)
            items.append({
                "level": current_level,
                "set": current_set,
                "type": "paragraph" if current_set_type in ["P", "C"] else ("sentence" if current_set_type == "S" else "text"),
                "num": num,
                "title": title or f"Item {num}",
                "passage": passage,
                "questions": questions
            })
            
    return items

def parse_evaluation(json_file, level_str):
    with open(os.path.join(scratch_dir, json_file), "r", encoding="utf-8") as f:
        slides = json.load(f)
        
    items = []
    for s in slides:
        text = "\n".join(shp["text"] for shp in s["shapes"])
        
        # Check if practice slide
        code_match = re.search(r'\b(P\d|S\d|T\d)[-–\s]+(\d+)\b', text, re.IGNORECASE)
        if not code_match:
            code_match = re.search(r'Page\s+(\d+)', text, re.IGNORECASE)
        if not code_match:
            continue
            
        if "Model" in text or "MODEL" in text or "Answer:" in text or "Key Words:" in text:
            continue
            
        shapes = [shp for shp in s["shapes"] if shp["text"].strip()]
        shapes.sort(key=lambda x: len(x["text"]))
        
        story_text = ""
        title = ""
        code = ""
        
        for shp in s["shapes"]:
            shp_text = shp["text"].strip()
            if not shp_text:
                continue
            if shp_text.startswith("Model") or shp_text.startswith("Answer:") or shp_text.startswith("Key Words:"):
                continue
                
            lines = [l.strip() for l in shp_text.split("\n") if l.strip()]
            if not lines:
                continue
            
            content_lines = []
            for line in lines:
                if re.match(r'^(?:P|S|T)\d?[-–]\d+$', line) or re.match(r'^S\d\s+\d+$', line) or line.startswith("Page"):
                    code = line
                elif len(line) < 30 and not line.endswith("?") and not content_lines:
                    title = line
                else:
                    content_lines.append(line)
                    
            if content_lines:
                story_paras = []
                questions = []
                for cl in content_lines:
                    if cl.endswith("?") or re.match(r'^[a-z]\s*\.\s+', cl, re.IGNORECASE) or cl.lower().startswith("why ") or cl.lower().startswith("what ") or cl.lower().startswith("who "):
                        questions.append(re.sub(r'^[a-z]\s*\.\s+', '', cl).strip())
                    else:
                        story_paras.append(cl)
                story_text = "\n\n".join(story_paras)
                
                items.append({
                    "level": level_str,
                    "set": code or code_match.group(0),
                    "type": "paragraph" if "P" in (code or code_match.group(0)) else "text",
                    "num": len(items) + 1,
                    "title": title or f"Item {len(items) + 1}",
                    "passage": story_text,
                    "questions": questions
                })
                break
                
    return items

# Load template
template_path = r"c:\Users\dsuth\Documents\Joshua\literacy\comprehension-web\inferencing\level-1\handout-01.html"
with open(template_path, "r", encoding="utf-8") as f:
    HTML_TEMPLATE = f.read()

def compile_handout(skill, level, handout_num, handout_data):
    """
    handout_data: list of sections. Each section has:
      - title
      - short_title
      - passage
      - questions: list of question strings
    """
    # Dynamic question IDs generation
    q_num = 1
    for sec_idx, sec in enumerate(handout_data):
        sec["question_ids"] = []
        if sec["id"].startswith("quick-"):
            for q_idx in range(len(sec["questions"])):
                sec["question_ids"].append(f"q{q_num}")
                q_num += 1
        else:
            for q_idx in range(len(sec["questions"])):
                letter = chr(97 + q_idx) # a, b, c, ...
                sec["question_ids"].append(f"q{q_num}{letter}")
            q_num += 1

    h_slug = f"handout-{handout_num:02d}"
    activity_id = f"{skill}-level-{level}-{h_slug}"
    state_key = f"{skill}-l{level}-h{handout_num}-state"
    tab_key = f"{skill}-l{level}-h{handout_num}-tab"
    
    # Accent colors
    tokens = COLOR_TOKENS[skill][level]
    skill_label = SKILL_LABELS[skill]
    
    # 1. CSS ACCENTS REPLACEMENT
    modified_html = HTML_TEMPLATE
    modified_html = modified_html.replace("--accent: #6BA3C9;", f"--accent: {tokens['accent']};")
    modified_html = modified_html.replace("--accent-light: #EAF4FA;", f"--accent-light: {tokens['light']};")
    modified_html = modified_html.replace("--accent-hover: #4F8FB8;", f"--accent-hover: {tokens['hover']};")
    modified_html = modified_html.replace("--accent: #7EB8D9;", f"--accent: {tokens['dark_accent']};")
    modified_html = modified_html.replace("--accent-light: #0F2433;", f"--accent-light: {tokens['dark_light']};")
    modified_html = modified_html.replace("--accent-hover: #9CC9E3;", f"--accent-hover: {tokens['dark_hover']};")
    
    # Replace metadata tags
    modified_html = re.sub(r'<title>.*?</title>', f'<title>{skill_label} - Level {level} Handout {handout_num}</title>', modified_html)
    meta_desc = f"Interactive and printable worksheet for Literacy Rotations - {skill_label} Level {level} Handout {handout_num}."
    modified_html = re.sub(r'<meta name="description" content=".*?">', f'<meta name="description" content="{meta_desc}">', modified_html)
    modified_html = re.sub(r'<meta property="og:title" content=".*?">', f'<meta property="og:title" content="{skill_label} - Level {level} Handout {handout_num}">', modified_html)
    modified_html = re.sub(r'<meta property="og:description" content=".*?">', f'<meta property="og:description" content="{meta_desc}">', modified_html)
    
    modified_html = modified_html.replace('<html lang="en">', f'<html lang="en" data-skill="{skill}" data-level="{level}">')
    
    # 2. BREADCRUMBS
    breadcrumb_html = f"""<nav class="breadcrumb" aria-label="Breadcrumb">
            <a href="../../index.html">Home</a>
            <span class="sep">/</span>
            <a href="../index.html">{skill_label}</a>
            <span class="sep">/</span>
            <a href="index.html">Level {level}</a>
            <span class="sep">/</span>
            <span>Handout {handout_num}</span>
        </nav>"""
    modified_html = re.sub(r'<nav class="breadcrumb"[\s\S]+?</nav>', breadcrumb_html, modified_html)
    
    title_html = f"<h1>{skill_label} · Level {level}</h1>"
    modified_html = re.sub(r'<h1>Inferencing · Level 1</h1>', title_html, modified_html)
    
    default_blurbs = {
        "inferencing": "Inferencing means using clues in the text to work out what is not said directly. Read each text, then answer. Explain <strong>why</strong> using evidence from the words.",
        "evaluation": "Evaluation means judging what happened and why it matters. Read each story, then answer. Explain <strong>why</strong> using clues from the text.",
        "reorganization": "Reorganisation means sorting or reordering information from a text. Read carefully, then complete each task using details from the passage."
    }
    modified_html = re.sub(r'<p class="lede">.*?</p>', f'<p class="lede">{default_blurbs[skill]}</p>', modified_html)
    
    # 3. SIDEBAR TABS
    sidebar_tabs_html = '<div class="sidebar-tabs" role="tablist" aria-label="Passage Tabs">\n'
    for idx, sec in enumerate(handout_data):
        active_class = ' active' if idx == 0 else ''
        aria_selected = 'true' if idx == 0 else 'false'
        sidebar_tabs_html += f"""                <button class="tab-btn{active_class}" role="tab" aria-selected="{aria_selected}" aria-controls="panel-{idx}" id="tab-{idx}" onclick="switchTab({idx})">
                    <span class="tab-title">{escape_html(sec['short_title'])}</span>
                    <span class="tab-badge" id="badge-{idx}">0/{len(sec['questions'])}</span>
                </button>\n"""
    sidebar_tabs_html += '            </div>'
    
    modified_html = re.sub(r'<div class="sidebar-tabs" role="tablist"[\s\S]+?</div>\s*</div>', sidebar_tabs_html + '\n            </div>', modified_html)
    
    # 4. TAB PANELS (PASSAGES)
    tab_content_html = '<div class="tab-content">\n'
    for idx, sec in enumerate(handout_data):
        active_class = ' active' if idx == 0 else ''
        
        passage_paragraphs_html = ""
        if sec["id"].startswith("quick-"):
            for q_idx, p_text in enumerate(sec["passages"]):
                q_num = q_idx + 1
                passage_paragraphs_html += f"""                    <div class="sentence-stem">
                        <span class="stem-label">Clue {q_num}:</span>
                        <p>{escape_html(p_text)}</p>
                    </div>\n"""
        else:
            for para in sec["passage"].split("\n\n"):
                if para.strip():
                    passage_paragraphs_html += f"                    <p>{escape_html(para.strip())}</p>\n"
                    
        tab_content_html += f"""            <!-- Panel {idx}: {escape_html(sec['title'])} -->
            <section class="tab-panel{active_class}" id="panel-{idx}" role="tabpanel" aria-labelledby="tab-{idx}" tabindex="0">
                <div class="story-card">
                    <h2>{escape_html(sec['title'])}</h2>
                    <div class="story-text">
{passage_paragraphs_html}                    </div>
                </div>
            </section>\n\n"""
            
    tab_content_html += '        </div>'
    modified_html = re.sub(r'<div class="tab-content">[\s\S]+?<!-- Questions Column -->', tab_content_html + '\n\n        <!-- Questions Column -->', modified_html)
    
    # 5. QUESTIONS DRAWER
    questions_column_html = '<div class="questions-column" id="questions-drawer">\n'
    questions_column_html += f"""            <div class="drawer-header">
                <h2>Questions</h2>
                <button class="btn btn-close" onclick="toggleQuestions()" aria-label="Close questions drawer">×</button>
            </div>\n\n"""
            
    q_counter = 1
    for idx, sec in enumerate(handout_data):
        active_style = '' if idx == 0 else ' style="display: none;"'
        questions_column_html += f'            <!-- Tab {idx} Questions -->\n'
        questions_column_html += f'            <div class="questions-tab-panel" id="questions-panel-{idx}"{active_style}>\n'
        
        for q_idx, q in enumerate(sec["questions"]):
            q_id = sec["question_ids"][q_idx]
            questions_column_html += f"""                <div class="question-card">
                    <div class="question-header">
                        <span class="question-title">{escape_html(q)}</span>
                        <div class="auto-save-indicator" id="save-{q_id}"><span class="save-dot"></span> Saved</div>
                    </div>
                    <div class="textarea-container">
                        <textarea id="{q_id}" class="answer-textarea" placeholder="Type your answer here..." oninput="onAnswerInput('{q_id}', {idx})"></textarea>
                    </div>
                    <div class="card-footer">
                        <span class="word-counter" id="words-{q_id}">0 words</span>
                    </div>
                    <div class="print-answer-box" id="print-{q_id}">................................................................................................................................................................</div>
                </div>\n\n"""
        questions_column_html += '            </div>\n\n'
        
    questions_column_html += '        </div>'
    modified_html = re.sub(r'<div class="questions-column" id="questions-drawer">[\s\S]+?<!-- Audio elements -->', questions_column_html + '\n\n    <!-- Audio elements -->', modified_html)
    
    # 6. JAVASCRIPT CONFIGURATION
    section_ids_js = json.dumps([sec["id"] for sec in handout_data])
    tab_question_keys_js = json.dumps([sec["question_ids"] for sec in handout_data])
    
    default_answers_js = "{\n"
    for sec in handout_data:
        for q_id in sec["question_ids"]:
            default_answers_js += f"            {q_id}: '',\n"
    default_answers_js += "        }"
    
    js_config_replacement = f"""const ACTIVITY_ID = '{activity_id}';
        const sectionIds = {section_ids_js};
        const tabQuestionKeys = {tab_question_keys_js};
        const questionsPerTab = tabQuestionKeys.map(k => k.length);
        const totalQuestions = questionsPerTab.reduce((a, b) => a + b, 0);

        // App state
        const state = {{
            studentName: '',
            studentDate: new Date().toISOString().split('T')[0],
            submissionId: createSubmissionId(),
            startedAt: new Date().toISOString(),
            lastSavedAt: new Date().toISOString(),
            answers: {default_answers_js}
        }};
        
        const DRAFT_KEY = '{state_key}';
        const TAB_KEY = '{tab_key}';"""
        
    js_match = re.search(r'const\s+ACTIVITY_ID\s*=\s*\'[^\']+\';[\s\S]+?const\s+DRAFT_KEY\s*=\s*\'[^\']+\';\s*const\s+TAB_KEY\s*=\s*\'[^\']+\';', modified_html)
    if js_match:
        modified_html = modified_html.replace(js_match.group(0), js_config_replacement)
    
    modified_html = modified_html.replace("'inferencing'", f"'{skill}'")
    modified_html = modified_html.replace("'Inferencing'", f"'{skill_label}'")
    modified_html = modified_html.replace("level: 1", f"level: {level}")
    modified_html = modified_html.replace("handout: 1", f"handout: {handout_num}")
    
    out_dir = os.path.join(base_dir, skill, f"level-{level}")
    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, f"handout-{handout_num:02d}.html")
    
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(modified_html)
    print(f"Generated worksheet: {out_path}")
    
    # 7. GENERATE MARKING GUIDE JSON
    questions_marking_json = []
    order_num = 1
    for sec_idx, sec in enumerate(handout_data):
        for q_idx, q in enumerate(sec["questions"]):
            q_id = sec["question_ids"][q_idx]
            passage_text = sec["passages"][q_idx] if "passages" in sec else sec["passage"]
            questions_marking_json.append({
                "questionId": q_id,
                "sectionId": sec["id"],
                "order": order_num,
                "prompt": q,
                "passage": passage_text,
                "maxMarks": 1,
                "markingGuide": f"Accept student answers that show clear comprehension of the passage. Look for logical inference or details supporting the question: '{q}' based on context."
            })
            order_num += 1
            
    marking_guide_data = {
        "activityId": activity_id,
        "title": f"{skill_label} – Level {level} – Handout {handout_num}",
        "skill": skill,
        "level": level,
        "handout": handout_num,
        "totalMarks": len(questions_marking_json),
        "questions": questions_marking_json
    }
    
    guide_path = os.path.join(marking_guides_dir, f"{skill}-level-{level}-handout-{handout_num}.json")
    os.makedirs(marking_guides_dir, exist_ok=True)
    with open(guide_path, "w", encoding="utf-8") as f:
        json.dump(marking_guide_data, f, indent=2, ensure_ascii=False)
    print(f"Generated marking guide: {guide_path}")
    
    # 8. GENERATE STAGED MARKDOWN FILE
    md_content = f"# {skill_label} Level {level} - Handout {handout_num}\n\n"
    part_titles = {
        "inferencing": ["Part 1: Quick Inferences (Sentences)", "Part 2: Short Passage Inferences", "Part 3: Text Comprehension & Inference"],
        "evaluation": ["Part 1: Quick Evaluation (Paragraphs)", "Part 2: Short Passage Evaluation", "Part 3: Text Comprehension & Evaluation"],
        "reorganization": ["Part 1: Quick Reorganisation (Paragraphs)", "Part 2: Short Passage Reorganisation", "Part 3: Text Comprehension & Reorganisation"]
    }
    
    part_num = 1
    for sec_idx, sec in enumerate(handout_data):
        if sec["id"].startswith("quick-"):
            md_content += f"## {part_titles[skill][0]}\n\n"
            md_content += "Read each passage and answer the question.\n\n"
            for q_idx, q in enumerate(sec["questions"]):
                md_content += f"### Question {q_idx + 1}\n"
                md_content += f"> {sec['passages'][q_idx]}\n\n"
                md_content += f"* **Question:** {q}\n"
                md_content += "* **Answer:** \n\n"
                if q_idx < len(sec["questions"]) - 1:
                    md_content += "---\n\n"
            md_content += "\n"
            part_num = 2
        else:
            if part_num == 2:
                md_content += f"## {part_titles[skill][1]}\n\n"
                md_content += "Read the passage and answer the questions.\n\n"
                part_num = 3
                
            if part_num == 3 and sec_idx == len(handout_data) - 1:
                md_content += f"## {part_titles[skill][2]}\n\n"
                md_content += "Read the text and answer the questions.\n\n"
                
            md_content += f"### Question {sec_idx + 3}: {sec['title'].upper()}\n"
            md_content += f"> {sec['passage']}\n\n" if len(sec['questions']) <= 2 else f"{sec['passage']}\n\n"
            md_content += "* **Questions:**\n"
            for q_idx, q in enumerate(sec["questions"]):
                letter = chr(97 + q_idx)
                md_content += f"  * **{letter}.** {q}\n"
                md_content += "    * **Answer:** \n"
            md_content += "\n\n"
            
    md_dir = os.path.join(content_dir, skill, f"level-{level}")
    os.makedirs(md_dir, exist_ok=True)
    md_path = os.path.join(md_dir, f"handout-{handout_num:02d}.md")
    with open(md_path, "w", encoding="utf-8") as f:
        f.write(md_content)
    print(f"Generated Markdown source: {md_path}")


def generate_index_html(skill, level, handouts_info):
    skill_label = SKILL_LABELS[skill]
    rows_html = ""
    for info in handouts_info:
        rows_html += f'''            <div class="handout-row">
                <div class="meta">
                    <h3>Handout {info['num']}</h3>
                    <p>{escape_html(info['desc'])}</p>
                </div>
                <div class="actions">
                    <span class="status ready">Live</span>
                    <a class="btn btn-primary" href="handout-{info['num']:02d}.html">Open worksheet</a>
                    <a class="btn" href="../../content/{skill}/level-{level}/handout-{info['num']:02d}.md">Source</a>
                </div>
            </div>\n'''
            
    index_html = f'''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{skill_label} Level {level} — Handouts</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="../../shared/site.css">
</head>
<body>
    <div class="container">
        <nav class="breadcrumb" aria-label="Breadcrumb">
            <a href="../../index.html">Home</a>
            <span class="sep">/</span>
            <a href="../index.html">{skill_label}</a>
            <span class="sep">/</span>
            <span>Level {level}</span>
        </nav>

        <header class="site-header">
            <div>
                <h1>{skill_label} · Level {level}</h1>
                <p class="lede">Interactive handout pages and source Markdown files for {skill_label} Level {level}.</p>
            </div>
            <button class="btn theme-toggle" type="button" data-theme-toggle aria-label="Toggle light or dark theme">◐</button>
        </header>

        <div class="handout-list">
{rows_html}        </div>
    </div>
    <script src="../../shared/site.js"></script>
</body>
</html>'''

    out_path = os.path.join(base_dir, skill, f"level-{level}", "index.html")
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(index_html)
    print(f"Generated level index: {out_path}")


def main():
    print("Loading raw files...")
    inf_items = parse_inference()
    reorg_items = parse_reorganisation()
    eval_l1_items = parse_evaluation("eval_level_1.json", "LEVEL_1")
    eval_l3_items = parse_evaluation("eval_level_3.json", "LEVEL_3")
    
    print(f"Loaded {len(inf_items)} Inferencing, {len(reorg_items)} Reorganisation, {len(eval_l1_items)} Eval L1, {len(eval_l3_items)} Eval L3 items.")
    
    # ----------------------------------------------------
    # 1. Inferencing Level 2 (8 Handouts)
    # ----------------------------------------------------
    print("\n--- Assembling Inferencing Level 2 ---")
    inf_l2 = [x for x in inf_items if x["level"] == "LEVEL_2"]
    sents_l2 = [x for x in inf_l2 if x["type"] == "sentence"]
    paras_l2 = [x for x in inf_l2 if x["type"] == "paragraph"]
    texts_l2 = [x for x in inf_l2 if x["type"] == "text"]
    
    handouts_info = []
    for h in range(1, 9):
        # 3 sentences, 2 paragraphs, 1 text
        s_list = sents_l2[(h-1)*3 : h*3]
        p_list = paras_l2[(h-1)*2 : h*2]
        t_list = texts_l2[(h-1)*1 : h*1]
        
        if len(s_list) < 3 or len(p_list) < 2 or len(t_list) < 1:
            print(f"Warning: Insufficient items for Inf L2 Handout {h}")
            continue
            
        handout_data = [
            {
                "id": "quick-inferences",
                "title": "Part 1: Quick Inferences",
                "short_title": "Quick Inferences",
                "passages": [x["passage"] for x in s_list],
                "questions": [x["questions"][0] for x in s_list],
                
            },
            {
                "id": p_list[0]["title"].lower().replace(" ", "-"),
                "title": p_list[0]["title"],
                "short_title": p_list[0]["title"],
                "passage": p_list[0]["passage"],
                "questions": p_list[0]["questions"],
                
            },
            {
                "id": p_list[1]["title"].lower().replace(" ", "-"),
                "title": p_list[1]["title"],
                "short_title": p_list[1]["title"],
                "passage": p_list[1]["passage"],
                "questions": p_list[1]["questions"],
                
            },
            {
                "id": t_list[0]["title"].lower().replace(" ", "-"),
                "title": t_list[0]["title"],
                "short_title": t_list[0]["title"],
                "passage": t_list[0]["passage"],
                "questions": t_list[0]["questions"],
                
            }
        ]
        
        compile_handout("inferencing", 2, h, handout_data)
        desc = f"Quick Inferences, {p_list[0]['title']}, {p_list[1]['title']}, and {t_list[0]['title']}"
        handouts_info.append({"num": h, "desc": desc})
        
    generate_index_html("inferencing", 2, handouts_info)
    
    # ----------------------------------------------------
    # 2. Inferencing Level 3 (8 Handouts)
    # ----------------------------------------------------
    print("\n--- Assembling Inferencing Level 3 ---")
    inf_l3 = [x for x in inf_items if x["level"] == "LEVEL_3"]
    sents_l3 = [x for x in inf_l3 if x["type"] == "sentence"]
    paras_l3 = [x for x in inf_l3 if x["type"] == "paragraph"]
    texts_l3 = [x for x in inf_l3 if x["type"] == "text"]
    
    handouts_info = []
    for h in range(1, 9):
        s_list = sents_l3[(h-1)*3 : h*3]
        p_list = paras_l3[(h-1)*2 : h*2]
        t_list = texts_l3[(h-1)*1 : h*1]
        
        if len(s_list) < 3 or len(p_list) < 2 or len(t_list) < 1:
            print(f"Warning: Insufficient items for Inf L3 Handout {h}")
            continue
            
        handout_data = [
            {
                "id": "quick-inferences",
                "title": "Part 1: Quick Inferences",
                "short_title": "Quick Inferences",
                "passages": [x["passage"] for x in s_list],
                "questions": [x["questions"][0] for x in s_list],
                
            },
            {
                "id": p_list[0]["title"].lower().replace(" ", "-"),
                "title": p_list[0]["title"],
                "short_title": p_list[0]["title"],
                "passage": p_list[0]["passage"],
                "questions": p_list[0]["questions"],
                
            },
            {
                "id": p_list[1]["title"].lower().replace(" ", "-"),
                "title": p_list[1]["title"],
                "short_title": p_list[1]["title"],
                "passage": p_list[1]["passage"],
                "questions": p_list[1]["questions"],
                
            },
            {
                "id": t_list[0]["title"].lower().replace(" ", "-"),
                "title": t_list[0]["title"],
                "short_title": t_list[0]["title"],
                "passage": t_list[0]["passage"],
                "questions": t_list[0]["questions"],
                
            }
        ]
        
        compile_handout("inferencing", 3, h, handout_data)
        desc = f"Quick Inferences, {p_list[0]['title']}, {p_list[1]['title']}, and {t_list[0]['title']}"
        handouts_info.append({"num": h, "desc": desc})
        
    generate_index_html("inferencing", 3, handouts_info)

    # ----------------------------------------------------
    # 3. Reorganisation Level 1 (8 Handouts)
    # ----------------------------------------------------
    print("\n--- Assembling Reorganisation Level 1 ---")
    reorg_l1 = [x for x in reorg_items if x["level"] == "LEVEL_1"]
    paras_reorg = [x for x in reorg_l1 if x["type"] == "paragraph" and x["set"].startswith("P")]
    convs_reorg = [x for x in reorg_l1 if x["type"] == "paragraph" and x["set"].startswith("C")]
    shorts_reorg = [x for x in reorg_l1 if x["type"] == "sentence"] # S sets are mapped to sentences
    texts_reorg = [x for x in reorg_l1 if x["type"] == "text"]
    
    # Combine Conversations and Short Texts for Part 2
    part2_items = convs_reorg + shorts_reorg
    
    handouts_info = []
    for h in range(1, 9):
        # 3 paragraphs, 2 short texts, 1 text
        p_list = paras_reorg[(h-1)*3 : h*3]
        s_list = part2_items[(h-1)*2 : h*2]
        t_list = texts_reorg[(h-1)*1 : h*1]
        
        if len(p_list) < 3 or len(s_list) < 2 or len(t_list) < 1:
            print(f"Warning: Insufficient items for Reorg L1 Handout {h}")
            continue
            
        handout_data = [
            {
                "id": "quick-reorganisation",
                "title": "Part 1: Quick Reorganisation",
                "short_title": "Quick Reorganisation",
                "passages": [x["passage"] for x in p_list],
                "questions": [x["questions"][0] for x in p_list],
                
            },
            {
                "id": s_list[0]["title"].lower().replace(" ", "-"),
                "title": s_list[0]["title"],
                "short_title": s_list[0]["title"],
                "passage": s_list[0]["passage"],
                "questions": s_list[0]["questions"],
                "question_ids": ["q4a", "q4b"][:len(s_list[0]["questions"])]
            },
            {
                "id": s_list[1]["title"].lower().replace(" ", "-"),
                "title": s_list[1]["title"],
                "short_title": s_list[1]["title"],
                "passage": s_list[1]["passage"],
                "questions": s_list[1]["questions"],
                "question_ids": ["q5a", "q5b"][:len(s_list[1]["questions"])]
            },
            {
                "id": t_list[0]["title"].lower().replace(" ", "-"),
                "title": t_list[0]["title"],
                "short_title": t_list[0]["title"],
                "passage": t_list[0]["passage"],
                "questions": t_list[0]["questions"],
                
            }
        ]
        
        compile_handout("reorganization", 1, h, handout_data)
        desc = f"Quick Reorganisation, {s_list[0]['title']}, {s_list[1]['title']}, and {t_list[0]['title']}"
        handouts_info.append({"num": h, "desc": desc})
        
    generate_index_html("reorganization", 1, handouts_info)

    # ----------------------------------------------------
    # 4. Reorganisation Level 2 (8 Handouts)
    # ----------------------------------------------------
    print("\n--- Assembling Reorganisation Level 2 ---")
    reorg_l2 = [x for x in reorg_items if x["level"] == "LEVEL_2"]
    paras_reorg2 = [x for x in reorg_l2 if x["type"] == "paragraph" and x["set"].startswith("P")]
    convs_reorg2 = [x for x in reorg_l2 if x["type"] == "paragraph" and x["set"].startswith("C")]
    shorts_reorg2 = [x for x in reorg_l2 if x["type"] == "sentence"]
    texts_reorg2 = [x for x in reorg_l2 if x["type"] == "text"]
    
    part2_items2 = convs_reorg2 + shorts_reorg2
    
    handouts_info = []
    for h in range(1, 9):
        # 2 paragraphs, 2 short texts, 1 text (Evaluation structure)
        p_list = paras_reorg2[(h-1)*2 : h*2]
        s_list = part2_items2[(h-1)*2 : h*2]
        t_list = texts_reorg2[(h-1)*1 : h*1]
        
        if len(p_list) < 2 or len(s_list) < 2 or len(t_list) < 1:
            print(f"Warning: Insufficient items for Reorg L2 Handout {h}")
            continue
            
        handout_data = [
            {
                "id": "quick-reorganisation",
                "title": "Part 1: Quick Reorganisation",
                "short_title": "Quick Reorganisation",
                "passages": [x["passage"] for x in p_list],
                "questions": [x["questions"][0] for x in p_list],
                
            },
            {
                "id": s_list[0]["title"].lower().replace(" ", "-"),
                "title": s_list[0]["title"],
                "short_title": s_list[0]["title"],
                "passage": s_list[0]["passage"],
                "questions": s_list[0]["questions"],
                
            },
            {
                "id": s_list[1]["title"].lower().replace(" ", "-"),
                "title": s_list[1]["title"],
                "short_title": s_list[1]["title"],
                "passage": s_list[1]["passage"],
                "questions": s_list[1]["questions"],
                
            },
            {
                "id": t_list[0]["title"].lower().replace(" ", "-"),
                "title": t_list[0]["title"],
                "short_title": t_list[0]["title"],
                "passage": t_list[0]["passage"],
                "questions": t_list[0]["questions"],
                
            }
        ]
        
        compile_handout("reorganization", 2, h, handout_data)
        desc = f"Quick Reorganisation, {s_list[0]['title']}, {s_list[1]['title']}, and {t_list[0]['title']}"
        handouts_info.append({"num": h, "desc": desc})
        
    generate_index_html("reorganization", 2, handouts_info)

    # ----------------------------------------------------
    # 5. Reorganisation Level 3 (8 Handouts)
    # ----------------------------------------------------
    print("\n--- Assembling Reorganisation Level 3 ---")
    reorg_l3 = [x for x in reorg_items if x["level"] == "LEVEL_3"]
    paras_reorg3 = [x for x in reorg_l3 if x["type"] == "paragraph" and x["set"].startswith("P")]
    convs_reorg3 = [x for x in reorg_l3 if x["type"] == "paragraph" and x["set"].startswith("C")]
    shorts_reorg3 = [x for x in reorg_l3 if x["type"] == "sentence"]
    texts_reorg3 = [x for x in reorg_l3 if x["type"] == "text"]
    
    part2_items3 = convs_reorg3 + shorts_reorg3
    
    handouts_info = []
    for h in range(1, 9):
        # 3 paragraphs, 2 short texts, 1 text
        p_list = paras_reorg3[(h-1)*3 : h*3]
        s_list = part2_items3[(h-1)*2 : h*2]
        t_list = texts_reorg3[(h-1)*1 : h*1]
        
        if len(p_list) < 3 or len(s_list) < 2 or len(t_list) < 1:
            print(f"Warning: Insufficient items for Reorg L3 Handout {h}")
            continue
            
        handout_data = [
            {
                "id": "quick-reorganisation",
                "title": "Part 1: Quick Reorganisation",
                "short_title": "Quick Reorganisation",
                "passages": [x["passage"] for x in p_list],
                "questions": [x["questions"][0] for x in p_list],
                
            },
            {
                "id": s_list[0]["title"].lower().replace(" ", "-"),
                "title": s_list[0]["title"],
                "short_title": s_list[0]["title"],
                "passage": s_list[0]["passage"],
                "questions": s_list[0]["questions"],
                "question_ids": ["q4a", "q4b"][:len(s_list[0]["questions"])]
            },
            {
                "id": s_list[1]["title"].lower().replace(" ", "-"),
                "title": s_list[1]["title"],
                "short_title": s_list[1]["title"],
                "passage": s_list[1]["passage"],
                "questions": s_list[1]["questions"],
                "question_ids": ["q5a", "q5b"][:len(s_list[1]["questions"])]
            },
            {
                "id": t_list[0]["title"].lower().replace(" ", "-"),
                "title": t_list[0]["title"],
                "short_title": t_list[0]["title"],
                "passage": t_list[0]["passage"],
                "questions": t_list[0]["questions"],
                
            }
        ]
        
        compile_handout("reorganization", 3, h, handout_data)
        desc = f"Quick Reorganisation, {s_list[0]['title']}, {s_list[1]['title']}, and {t_list[0]['title']}"
        handouts_info.append({"num": h, "desc": desc})
        
    generate_index_html("reorganization", 3, handouts_info)

    # ----------------------------------------------------
    # 6. Evaluation Level 1 (4 Handouts)
    # ----------------------------------------------------
    print("\n--- Assembling Evaluation Level 1 ---")
    paras_eval1 = [x for x in eval_l1_items if x["type"] == "paragraph"]
    texts_eval1 = [x for x in eval_l1_items if x["type"] == "text"]
    
    # Split texts into short (2-Q) and long (5-Q)
    shorts_eval1 = [x for x in texts_eval1 if len(x["questions"]) <= 2]
    longs_eval1 = [x for x in texts_eval1 if len(x["questions"]) > 2]
    
    # If not enough longs, supplement from shorts
    if len(longs_eval1) < 4:
        longs_eval1 += [x for x in shorts_eval1 if x not in longs_eval1]
        
    handouts_info = []
    for h in range(1, 5):
        p_list = paras_eval1[(h-1)*2 : h*2]
        s_list = shorts_eval1[(h-1)*2 : h*2]
        t_list = longs_eval1[(h-1)*1 : h*1]
        
        if len(p_list) < 2 or len(s_list) < 2 or len(t_list) < 1:
            print(f"Warning: Insufficient items for Eval L1 Handout {h}")
            continue
            
        handout_data = [
            {
                "id": "quick-evaluation",
                "title": "Part 1: Quick Evaluation",
                "short_title": "Quick Evaluation",
                "passages": [x["passage"] for x in p_list],
                "questions": [x["questions"][0] for x in p_list],
                
            },
            {
                "id": s_list[0]["title"].lower().replace(" ", "-"),
                "title": s_list[0]["title"],
                "short_title": s_list[0]["title"],
                "passage": s_list[0]["passage"],
                "questions": s_list[0]["questions"],
                
            },
            {
                "id": s_list[1]["title"].lower().replace(" ", "-"),
                "title": s_list[1]["title"],
                "short_title": s_list[1]["title"],
                "passage": s_list[1]["passage"],
                "questions": s_list[1]["questions"],
                
            },
            {
                "id": t_list[0]["title"].lower().replace(" ", "-"),
                "title": t_list[0]["title"],
                "short_title": t_list[0]["title"],
                "passage": t_list[0]["passage"],
                "questions": t_list[0]["questions"],
                
            }
        ]
        
        compile_handout("evaluation", 1, h, handout_data)
        desc = f"Quick Evaluation, {s_list[0]['title']}, {s_list[1]['title']}, and {t_list[0]['title']}"
        handouts_info.append({"num": h, "desc": desc})
        
    generate_index_html("evaluation", 1, handouts_info)

    # ----------------------------------------------------
    # 7. Evaluation Level 3 (3 Handouts)
    # ----------------------------------------------------
    print("\n--- Assembling Evaluation Level 3 ---")
    paras_eval3 = [x for x in eval_l3_items if x["type"] == "paragraph"]
    texts_eval3 = [x for x in eval_l3_items if x["type"] == "text"]
    
    shorts_eval3 = [x for x in texts_eval3 if len(x["questions"]) <= 2]
    longs_eval3 = [x for x in texts_eval3 if len(x["questions"]) > 2]
    
    if len(longs_eval3) < 3:
        longs_eval3 += [x for x in shorts_eval3 if x not in longs_eval3]
        
    handouts_info = []
    for h in range(1, 4):
        p_list = paras_eval3[(h-1)*2 : h*2]
        s_list = shorts_eval3[(h-1)*2 : h*2]
        t_list = longs_eval3[(h-1)*1 : h*1]
        
        if len(p_list) < 2 or len(s_list) < 2 or len(t_list) < 1:
            print(f"Warning: Insufficient items for Eval L3 Handout {h}")
            continue
            
        handout_data = [
            {
                "id": "quick-evaluation",
                "title": "Part 1: Quick Evaluation",
                "short_title": "Quick Evaluation",
                "passages": [x["passage"] for x in p_list],
                "questions": [x["questions"][0] for x in p_list],
                
            },
            {
                "id": s_list[0]["title"].lower().replace(" ", "-"),
                "title": s_list[0]["title"],
                "short_title": s_list[0]["title"],
                "passage": s_list[0]["passage"],
                "questions": s_list[0]["questions"],
                
            },
            {
                "id": s_list[1]["title"].lower().replace(" ", "-"),
                "title": s_list[1]["title"],
                "short_title": s_list[1]["title"],
                "passage": s_list[1]["passage"],
                "questions": s_list[1]["questions"],
                
            },
            {
                "id": t_list[0]["title"].lower().replace(" ", "-"),
                "title": t_list[0]["title"],
                "short_title": t_list[0]["title"],
                "passage": t_list[0]["passage"],
                "questions": t_list[0]["questions"],
                
            }
        ]
        
        compile_handout("evaluation", 3, h, handout_data)
        desc = f"Quick Evaluation, {s_list[0]['title']}, {s_list[1]['title']}, and {t_list[0]['title']}"
        handouts_info.append({"num": h, "desc": desc})
        
    # Overwrite index for evaluation level 3, making sure Handout 5 is listed!
    # Wait, Handout 5 description:
    handouts_info.append({"num": 5, "desc": "Distress, A Complicated Lesson, Hi Jane, Big Jesse, and Nine Lives"})
    # Sort handouts_info by num
    handouts_info.sort(key=lambda x: x["num"])
    generate_index_html("evaluation", 3, handouts_info)

    print("\nMigration completed successfully!")

if __name__ == "__main__":
    main()
