import json
import os
import re
import uuid

# Paths
base_dir = os.path.dirname(os.path.abspath(__file__))
scratch_dir = r"C:\Users\dsuth\.gemini\antigravity-ide\brain\ee62f3da-bd8f-4bd3-9567-7e3d4a77871e\scratch"
content_dir = os.path.join(base_dir, "content")
marking_guides_dir = os.path.join(base_dir, "marking-guides")

OUT_ROOT = None
TARGET_HANDOUT = None

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
                    if (re.match(r'^(?:ITEM|PRACTISE ITEM|PRACTISE\s+ITEM)\s*\d+', next_text, re.IGNORECASE) or 
                        "KEY into" in next_text or 
                        re.search(r'\bLEVEL\s+(?:ONE|TWO|THREE)\b', next_text, re.IGNORECASE) or 
                        re.search(r'\bSET\s+(?:[SPTC5]\d+|TS)\b', next_text, re.IGNORECASE)):
                        break
                    item_lines.append(next_text)
                    j += 1
                
                passage_paragraphs = []
                questions = []
                for line in item_lines:
                    if re.match(r'^[a-z]\s*[\.\)]\s*', line, re.IGNORECASE) or line.startswith("QUESTION:") or line.endswith("?"):
                        q_clean = re.sub(r'^[a-z]\s*[\.\)]\s*', '', line).strip()
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
                if (re.match(r'^(?:ITEM|PRACTISE ITEM|PRACTISE\s+ITEM)\s*\d+', next_text, re.IGNORECASE) or 
                    "KEY into" in next_text or 
                    re.search(r'\bLEVEL\s+(?:ONE|TWO|THREE)\b', next_text, re.IGNORECASE) or 
                    re.search(r'\bSET\s+(?:[SPTC5]\d+|TS)\b', next_text, re.IGNORECASE)):
                    break
                item_lines.append(next_text)
                j += 1
            
            passage_paragraphs = []
            questions = []
            for line in item_lines:
                if re.match(r'^[a-z]\s*[\.\)]\s*', line, re.IGNORECASE) or line.startswith("QUESTION:") or line.endswith("?"):
                    q_clean = re.sub(r'^[a-z]\s*[\.\)]\s*', '', line).strip()
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

LAYOUT_SENTENCE_TASK_LIST = "sentence-task-list"
LAYOUT_PAIRED_PASSAGE_LIST = "paired-passage-list"
LAYOUT_FOCUS_PASSAGE_LIST = "focus-passage-list"
LAYOUT_SHARED_PASSAGE = "shared-passage"

READING_SCOPE_ITEM = "item"
READING_SCOPE_SECTION = "section"

RESPONSE_SHORT = "short"
RESPONSE_STANDARD = "standard"
RESPONSE_EVIDENCE = "evidence"

DEFAULT_RESPONSE_SIZE_BY_LAYOUT = {
    LAYOUT_SENTENCE_TASK_LIST: RESPONSE_SHORT,
    LAYOUT_PAIRED_PASSAGE_LIST: RESPONSE_STANDARD,
    LAYOUT_FOCUS_PASSAGE_LIST: RESPONSE_EVIDENCE,
    LAYOUT_SHARED_PASSAGE: RESPONSE_STANDARD,
}

EYEBROW_BY_LAYOUT = {
    LAYOUT_SENTENCE_TASK_LIST: "Sentence clues",
    LAYOUT_PAIRED_PASSAGE_LIST: "Text mapping",
    LAYOUT_FOCUS_PASSAGE_LIST: "Text evidence",
    LAYOUT_SHARED_PASSAGE: "Comprehension text",
}

ROWS_BY_RESPONSE_SIZE = {
    RESPONSE_SHORT: 2,
    RESPONSE_STANDARD: 4,
    RESPONSE_EVIDENCE: 6,
}

STRATEGY_BLURBS = {
    "inferencing": "Use clues in the text to work out what is not stated directly.",
    "reorganization": "Find and combine information from different parts of the text.",
    "evaluation": "Consider the whole text and explain your judgement with evidence."
}

DEFAULT_INSTRUCTION_BY_LAYOUT = {
    LAYOUT_SENTENCE_TASK_LIST: "Read each sentence, then answer its question. Use the clues in the sentence.",
    LAYOUT_PAIRED_PASSAGE_LIST: "Read each short text, then combine the relevant details to answer its question.",
    LAYOUT_FOCUS_PASSAGE_LIST: "Read each text carefully. Explain your judgement using evidence from that text.",
    LAYOUT_SHARED_PASSAGE: "Read the passage, then answer all questions using evidence from the text.",
}

def default_layout_for(skill, reading_scope):
    if reading_scope == READING_SCOPE_SECTION:
        return LAYOUT_SHARED_PASSAGE
    if skill == "inferencing":
        return LAYOUT_SENTENCE_TASK_LIST
    if skill == "reorganization":
        return LAYOUT_PAIRED_PASSAGE_LIST
    if skill == "evaluation":
        return LAYOUT_FOCUS_PASSAGE_LIST
    raise ValueError(f"Unknown skill '{skill}' or reading_scope '{reading_scope}'")

def normalize_section(skill, section, section_index):
    # Determine reading scope: if "passages" exists, it's item scope
    if "passages" in section:
        reading_scope = READING_SCOPE_ITEM
    else:
        reading_scope = READING_SCOPE_SECTION
        
    # Determine layout
    layout = section.get("layout")
    if not layout:
        layout = default_layout_for(skill, reading_scope)
        
    # Determine default response size
    default_response_size = section.get("response_size")
    if not default_response_size:
        default_response_size = DEFAULT_RESPONSE_SIZE_BY_LAYOUT.get(layout, RESPONSE_STANDARD)
        
    instruction = section.get("instruction")
    if not instruction:
        instruction = DEFAULT_INSTRUCTION_BY_LAYOUT.get(layout, "")
        
    items = []
    
    if reading_scope == READING_SCOPE_ITEM:
        raw_passages = section.get("passages", [])
        raw_questions = section.get("questions", [])
        raw_sizes = section.get("response_sizes")
        
        for i in range(len(raw_questions)):
            passage_text = raw_passages[i] if i < len(raw_passages) else ""
            prompt_text = raw_questions[i]
            
            if layout == LAYOUT_SENTENCE_TASK_LIST:
                label = f"Sentence {i + 1}"
            else:
                label = f"Text {i + 1}"
                
            response_size = default_response_size
            if raw_sizes and i < len(raw_sizes):
                response_size = raw_sizes[i]
                
            items.append({
                "item_id": f"item-{i + 1}",
                "label": label,
                "passage": passage_text,
                "questions": [
                    {
                        "question_id": None,
                        "prompt": prompt_text,
                        "response_size": response_size,
                        "kind": "standard"
                    }
                ]
            })
    else:
        raw_passage = section.get("passage", "")
        raw_questions = section.get("questions", [])
        raw_sizes = section.get("response_sizes")
        
        questions_list = []
        for i, prompt_text in enumerate(raw_questions):
            response_size = default_response_size
            if raw_sizes and i < len(raw_sizes):
                response_size = raw_sizes[i]
                
            questions_list.append({
                "question_id": None,
                "prompt": prompt_text,
                "response_size": response_size,
                "kind": "standard"
            })
            
        items.append({
            "item_id": "item-1",
            "label": "Reading",
            "passage": raw_passage,
            "questions": questions_list
        })
        
    return {
        "id": section.get("id"),
        "title": section.get("title"),
        "short_title": section.get("short_title"),
        "layout": layout,
        "reading_scope": reading_scope,
        "instruction": instruction,
        "default_response_size": default_response_size,
        "items": items
    }

def assign_question_ids(sections):
    q_num = 1
    for sec in sections:
        if sec["reading_scope"] == READING_SCOPE_ITEM:
            for item in sec["items"]:
                for q in item["questions"]:
                    q["question_id"] = f"q{q_num}"
                    q_num += 1
        else:
            # Shared passage layout
            for item in sec["items"]:
                for q_idx, q in enumerate(item["questions"]):
                    letter = chr(97 + q_idx)
                    q["question_id"] = f"q{q_num}{letter}"
            q_num += 1

def validate_normalized_handout(skill, level, handout_num, sections):
    activity_ref = f"{skill}-level-{level}-handout-{handout_num}"
    
    section_ids = set()
    question_ids = set()
    
    for sec_idx, sec in enumerate(sections):
        sec_id = sec.get("id")
        if not sec_id:
            raise ValueError(f"[{activity_ref}] Empty section ID at index {sec_idx}")
            
        if sec_id in section_ids:
            raise ValueError(f"[{activity_ref}] Duplicate section ID '{sec_id}'")
        section_ids.add(sec_id)
        
        layout = sec.get("layout")
        if layout not in [LAYOUT_SENTENCE_TASK_LIST, LAYOUT_PAIRED_PASSAGE_LIST, LAYOUT_FOCUS_PASSAGE_LIST, LAYOUT_SHARED_PASSAGE]:
            raise ValueError(f"[{activity_ref}] Unsupported layout '{layout}' in section '{sec_id}'")
            
        reading_scope = sec.get("reading_scope")
        
        if layout in [LAYOUT_SENTENCE_TASK_LIST, LAYOUT_PAIRED_PASSAGE_LIST, LAYOUT_FOCUS_PASSAGE_LIST]:
            if reading_scope != READING_SCOPE_ITEM:
                raise ValueError(f"[{activity_ref}] Layout '{layout}' in section '{sec_id}' must use item scope")
        if layout == LAYOUT_SHARED_PASSAGE:
            if reading_scope != READING_SCOPE_SECTION:
                raise ValueError(f"[{activity_ref}] Layout '{layout}' in section '{sec_id}' must use section scope")
                
        items = sec.get("items", [])
        if not items:
            raise ValueError(f"[{activity_ref}] No items in section '{sec_id}'")
            
        for item_idx, item in enumerate(items):
            passage = item.get("passage", "")
            # Only validate non-empty passage for item-scoped layouts
            if layout in [LAYOUT_SENTENCE_TASK_LIST, LAYOUT_PAIRED_PASSAGE_LIST, LAYOUT_FOCUS_PASSAGE_LIST]:
                if not passage or not passage.strip():
                    raise ValueError(f"[{activity_ref}] Empty passage in item '{item.get('item_id')}' in section '{sec_id}'")
            
            questions = item.get("questions", [])
            if not questions:
                raise ValueError(f"[{activity_ref}] No questions in item '{item.get('item_id')}' in section '{sec_id}'")
                
            if layout in [LAYOUT_SENTENCE_TASK_LIST, LAYOUT_PAIRED_PASSAGE_LIST, LAYOUT_FOCUS_PASSAGE_LIST]:
                if len(questions) != 1:
                    raise ValueError(f"[{activity_ref}] Layout '{layout}' must contain exactly one question per item")
                    
            for q_idx, q in enumerate(questions):
                prompt = q.get("prompt", "")
                if not prompt or not prompt.strip():
                    raise ValueError(f"[{activity_ref}] Empty prompt for question in item '{item.get('item_id')}' in section '{sec_id}'")
                
                q_id = q.get("question_id")
                if q_id:
                    if q_id in question_ids:
                        raise ValueError(f"[{activity_ref}] Duplicate question ID '{q_id}'")
                    question_ids.add(q_id)
                    
                r_size = q.get("response_size")
                if r_size not in [RESPONSE_SHORT, RESPONSE_STANDARD, RESPONSE_EVIDENCE]:
                    raise ValueError(f"[{activity_ref}] Unsupported response size '{r_size}' for question '{q_id}'")

def compile_handout(skill, level, handout_num, handout_data, out_root=None):
    global TARGET_HANDOUT, OUT_ROOT
    if TARGET_HANDOUT:
        target_str = f"{skill}-{level}-{handout_num}"
        if target_str != TARGET_HANDOUT and TARGET_HANDOUT not in target_str:
            return
    if OUT_ROOT and out_root is None:
        out_root = OUT_ROOT

    seen_ids = {}
    normalized_sections = []
    for idx, sec in enumerate(handout_data):
        sec_copy = dict(sec)
        sec_id = sec_copy.get("id")
        if sec_id:
            if sec_id in seen_ids:
                seen_ids[sec_id] += 1
                sec_copy["id"] = f"{sec_id}-{seen_ids[sec_id]}"
            else:
                seen_ids[sec_id] = 1
        normalized_sections.append(normalize_section(skill, sec_copy, idx))

    assign_question_ids(normalized_sections)
    validate_normalized_handout(skill, level, handout_num, normalized_sections)

    if isinstance(handout_num, str) and handout_num.endswith("-bridge"):
        h_slug = f"handout-{handout_num}"
        print_label = f"Level {level} Handout {handout_num.split('-')[0]} (Level {level}–{level+1} bridge)"
    else:
        try:
            h_num = int(handout_num)
            h_slug = f"handout-{h_num:02d}"
            print_label = f"Level {level} Handout {h_num}"
        except ValueError:
            h_slug = f"handout-{handout_num}"
            print_label = f"Level {level} Handout {handout_num}"

    activity_id = f"{skill}-level-{level}-{h_slug}"
    state_key = f"{skill}-l{level}-h{handout_num}-state"
    tab_key = f"{skill}-l{level}-h{handout_num}-tab"

    # Accent colors
    tokens = COLOR_TOKENS[skill][level]
    skill_label = SKILL_LABELS[skill]

    # Load template
    template_path = os.path.join(base_dir, "templates", "handout-template.html")
    with open(template_path, "r", encoding="utf-8") as f:
        html_template = f.read()

    # Renders
    sidebar_html = render_sidebar(normalized_sections)
    panels_html = ""
    for idx, sec in enumerate(normalized_sections):
        panels_html += render_section_panel(skill, sec, idx)

    # Config JSON
    config_data = build_activity_config(skill, level, handout_num, normalized_sections, activity_id, state_key, tab_key)
    config_json = json.dumps(config_data, ensure_ascii=False).replace("<", "\\u003c").replace(">", "\\u003e")

    # Replace placeholders
    modified_html = html_template
    modified_html = modified_html.replace("<!-- BUILD:TITLE -->", f"{skill_label} - Level {level} Handout {handout_num}")
    meta_desc = f"Interactive and printable worksheet for Literacy Rotations - {skill_label} Level {level} Handout {handout_num}."
    modified_html = modified_html.replace("<!-- BUILD:DESCRIPTION -->", meta_desc)
    modified_html = modified_html.replace("<!-- BUILD:HEADER_TITLE -->", f"{skill_label} · Level {level}")
    modified_html = modified_html.replace("<!-- BUILD:HEADER_LEDE -->", STRATEGY_BLURBS.get(skill, ""))
    modified_html = modified_html.replace("<!-- BUILD:PRINT_LABEL -->", print_label)
    
    modified_html = modified_html.replace("<!-- BUILD:ACCENT -->", tokens["accent"])
    modified_html = modified_html.replace("<!-- BUILD:ACCENT_LIGHT -->", tokens["light"])
    modified_html = modified_html.replace("<!-- BUILD:ACCENT_HOVER -->", tokens["hover"])
    modified_html = modified_html.replace("<!-- BUILD:DARK_ACCENT -->", tokens["dark_accent"])
    modified_html = modified_html.replace("<!-- BUILD:DARK_ACCENT_LIGHT -->", tokens["dark_light"])
    modified_html = modified_html.replace("<!-- BUILD:DARK_ACCENT_HOVER -->", tokens["dark_hover"])

    modified_html = modified_html.replace("<!-- BUILD:BREADCRUMB -->", f"""<nav class="breadcrumb print-hide" aria-label="Breadcrumb">
            <a href="../../index.html">Home</a>
            <span class="sep">/</span>
            <a href="../index.html">{skill_label}</a>
            <span class="sep">/</span>
            <a href="index.html">Level {level}</a>
            <span class="sep">/</span>
            <span>Handout {handout_num}</span>
        </nav>""")

    modified_html = modified_html.replace("<!-- BUILD:SIDEBAR -->", sidebar_html)
    modified_html = modified_html.replace("<!-- BUILD:PANELS -->", panels_html)
    modified_html = modified_html.replace("<!-- BUILD:CONFIG -->", config_json)

    # ACCENT HTML ATTRIBUTE
    modified_html = modified_html.replace('<html lang="en">', f'<html lang="en" data-skill="{skill}" data-level="{level}">')

    if out_root:
        out_dir = os.path.join(out_root, skill, f"level-{level}")
    else:
        out_dir = os.path.join(base_dir, skill, f"level-{level}")
    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, f"handout-{handout_num:02d}.html")

    with open(out_path, "w", encoding="utf-8") as f:
        f.write(modified_html)
    print(f"Generated worksheet: {out_path}")

    # Generate marking guide
    guide_path = os.path.join(marking_guides_dir, f"{skill}-level-{level}-handout-{handout_num}.json")
    write_marking_guide(skill, level, handout_num, normalized_sections, activity_id, guide_path)

    # Generate markdown source copy
    md_path = os.path.join(content_dir, skill, f"level-{level}", f"handout-{handout_num:02d}.md")
    write_markdown_copy(skill, level, handout_num, normalized_sections, md_path)


def render_sidebar(sections):
    sidebar_html = '<!-- Sidebar with tab links -->\n            <nav class="sidebar print-hide" id="activity-sidebar">\n'
    for idx, sec in enumerate(sections):
        active_class = ' active' if idx == 0 else ''
        q_count = sum(len(item["questions"]) for item in sec["items"])
        sidebar_html += f"""                <button class="tab-btn{active_class}" data-action="switch-section" data-section-index="{idx}">
                    <span>{idx + 1}. {escape_html(sec['short_title'])}</span>
                    <span class="badge" id="badge-{idx}">0/{q_count}</span>
                </button>\n"""
    sidebar_html += '            </nav>'
    return sidebar_html


def render_section_panel(skill, sec, sec_idx):
    layout = sec["layout"]
    hidden_attr = ' hidden' if sec_idx > 0 else ''
    eyebrow = EYEBROW_BY_LAYOUT.get(layout, "Reading task")
    
    html = f'                <section class="section-panel" id="panel-{sec_idx}" data-section-index="{sec_idx}" data-section-id="{sec["id"]}" data-layout="{layout}" aria-labelledby="section-title-{sec_idx}"{hidden_attr}>\n'
    html += '                    <header class="section-heading">\n'
    html += f'                        <p class="section-eyebrow">{eyebrow}</p>\n'
    html += '                        <div class="section-title-row">\n'
    html += f'                            <h2 id="section-title-{sec_idx}">{sec_idx + 1}. {escape_html(sec["title"])}</h2>\n'
    if layout == LAYOUT_SHARED_PASSAGE:
        html += '                            <button class="btn btn-sm btn-outline print-hide" type="button" data-action="toggle-reading-focus" title="Expand reading area">Reading focus</button>\n'
    html += '                        </div>\n'
    html += f'                        <p class="section-instruction">{escape_html(sec["instruction"])}</p>\n'
    html += '                    </header>\n'
    
    if layout == LAYOUT_SENTENCE_TASK_LIST:
        html += f'                    <div class="task-list sentence-task-list">\n'
        for i, item in enumerate(sec["items"]):
            html += f'                        <article class="task-card" data-task-index="{i}">\n'
            html += render_reading_region(item, item["questions"][0]["question_id"])
            html += render_question_region(item["questions"][0], sec_idx)
            html += f'                        </article>\n'
        html += f'                    </div>\n'
        
    elif layout == LAYOUT_PAIRED_PASSAGE_LIST:
        html += f'                    <div class="task-list paired-passage-list">\n'
        for i, item in enumerate(sec["items"]):
            html += f'                        <article class="task-card paired-task" data-task-index="{i}">\n'
            html += render_reading_region(item, item["questions"][0]["question_id"])
            html += render_question_region(item["questions"][0], sec_idx)
            html += f'                        </article>\n'
        html += f'                    </div>\n'
        
    elif layout == LAYOUT_FOCUS_PASSAGE_LIST:
        len_items = len(sec["items"])
        html += f'                    <div class="focus-task-list" data-active-task="0">\n'
        for i, item in enumerate(sec["items"]):
            item_hidden = ' hidden' if i > 0 else ''
            html += f'                        <article class="task-card focus-task" data-task-index="{i}"{item_hidden}>\n'
            html += render_reading_region(item, item["questions"][0]["question_id"])
            html += render_question_region(item["questions"][0], sec_idx)
            html += f'                        </article>\n'
        if len_items > 1:
            html += '                        <nav class="focus-task-nav print-hide" aria-label="Evaluation tasks">\n'
            html += '                            <button type="button" class="btn" data-action="previous-task">Previous task</button>\n'
            html += f'                            <span class="focus-task-position" aria-live="polite">Task 1 of {len_items}</span>\n'
            html += '                            <button type="button" class="btn" data-action="next-task">Next task</button>\n'
            html += '                        </nav>\n'
        html += f'                    </div>\n'
        
    elif layout == LAYOUT_SHARED_PASSAGE:
        item = sec["items"][0]
        html += f'                    <div class="shared-passage-workspace" data-reading-mode="split">\n'
        html += f'                        <article class="shared-reading" aria-labelledby="reading-label-section-{sec_idx}">\n'
        html += f'                            <h3 class="reading-label" id="reading-label-section-{sec_idx}">Reading</h3>\n'
        html += f'                            <div class="reading-text">\n'
        for para in item["passage"].split("\n\n"):
            if para.strip():
                html += f'                                <p>{escape_html(para.strip())}</p>\n'
        html += f'                            </div>\n'
        html += f'                        </article>\n'
        html += f'                        <aside class="shared-questions" aria-label="Questions about this reading">\n'
        for q in item["questions"]:
            html += render_question_region(q, sec_idx)
        html += f'                        </aside>\n'
        html += f'                    </div>\n'
        
    html += '                </section>\n'
    return html


def render_reading_region(item, q_id):
    html = f'                            <article class="reading-block" aria-labelledby="reading-label-{q_id}">\n'
    html += f'                                <h3 class="reading-label" id="reading-label-{q_id}">{escape_html(item["label"])}</h3>\n'
    html += f'                                <div class="reading-text">\n'
    for para in item["passage"].split("\n\n"):
        if para.strip():
            html += f'                                    <p>{escape_html(para.strip())}</p>\n'
    html += f'                                </div>\n'
    html += f'                            </article>\n'
    return html


def render_question_region(q, section_idx):
    q_id = q["question_id"]
    r_size = q["response_size"]
    rows = ROWS_BY_RESPONSE_SIZE.get(r_size, 4)
    
    html = f'                            <section class="response-block" aria-labelledby="prompt-{q_id}">\n'
    html += '                                <div class="question-heading-row">\n'
    html += f'                                    <h3 class="question-prompt" id="prompt-{q_id}">{escape_html(q["prompt"])}</h3>\n'
    html += f'                                    <div class="save-indicator" id="save-{q_id}" aria-live="polite">Saved</div>\n'
    html += '                                </div>\n'
    html += f'                                <label class="visually-hidden" for="{q_id}">Answer to question {q_id}</label>\n'
    html += f'                                <textarea id="{q_id}" class="answer-textarea response-{r_size}" data-question-id="{q_id}" data-section-index="{section_idx}" rows="{rows}" placeholder="Type your answer here..."></textarea>\n'
    html += '                                <div class="response-footer">\n'
    html += f'                                    <span class="word-counter" id="words-{q_id}">0 words</span>\n'
    html += '                                </div>\n'
    html += f'                                <div class="print-answer-box" id="print-{q_id}"></div>\n'
    html += '                            </section>\n'
    return html


def build_activity_config(skill, level, handout_num, normalized_sections, activity_id, state_key, tab_key):
    sections_config = []
    for sec in normalized_sections:
        sec_cfg = {
            "sectionId": sec["id"],
            "title": sec["title"],
            "layout": sec["layout"]
        }
        if sec["reading_scope"] == READING_SCOPE_ITEM:
            sec_cfg["passages"] = [item["passage"] for item in sec["items"]]
            sec_cfg["questions"] = [
                {
                    "questionId": q["question_id"],
                    "prompt": q["prompt"],
                    "responseSize": q["response_size"]
                }
                for item in sec["items"] for q in item["questions"]
            ]
        else:
            sec_cfg["passage"] = sec["items"][0]["passage"]
            sec_cfg["questions"] = [
                {
                    "questionId": q["question_id"],
                    "prompt": q["prompt"],
                    "responseSize": q["response_size"]
                }
                for q in sec["items"][0]["questions"]
            ]
        sections_config.append(sec_cfg)
        
    return {
        "appVersion": "2.1.0",
        "schemaVersion": "1.0",
        "activityId": activity_id,
        "skill": skill,
        "skillLabel": SKILL_LABELS.get(skill, skill.capitalize()),
        "level": level,
        "handout": handout_num,
        "storage": {
            "draftKey": state_key,
            "tabKey": tab_key
        },
        "sections": sections_config
    }


def write_marking_guide(skill, level, handout_num, normalized_sections, activity_id, guide_path):
    questions_marking_json = []
    order_num = 1
    for sec in normalized_sections:
        for item in sec["items"]:
            for q in item["questions"]:
                q_id = q["question_id"]
                passage_text = item["passage"]
                questions_marking_json.append({
                    "questionId": q_id,
                    "sectionId": sec["id"],
                    "order": order_num,
                    "prompt": q["prompt"],
                    "passage": passage_text,
                    "maxMarks": 1,
                    "markingGuide": f"Accept student answers that show clear comprehension of the passage. Look for logical inference or details supporting the question: '{q['prompt']}' based on context."
                })
                order_num += 1
                
    marking_guide_data = {
        "activityId": activity_id,
        "title": f"{SKILL_LABELS.get(skill, skill.capitalize())} – Level {level} – Handout {handout_num}",
        "skill": skill,
        "level": level,
        "handout": handout_num,
        "totalMarks": len(questions_marking_json),
        "questions": questions_marking_json
    }
    
    os.makedirs(os.path.dirname(guide_path), exist_ok=True)
    with open(guide_path, "w", encoding="utf-8") as f:
        json.dump(marking_guide_data, f, indent=2, ensure_ascii=False)
    print(f"Generated marking guide: {guide_path}")


def write_markdown_copy(skill, level, handout_num, normalized_sections, md_path):
    skill_label = SKILL_LABELS.get(skill, skill.capitalize())
    md_content = f"# {skill_label} Level {level} - Handout {handout_num}\n\n"
    part_titles = {
        "inferencing": ["Part 1: Quick Inferences (Sentences)", "Part 2: Short Passage Inferences", "Part 3: Text Comprehension & Inference"],
        "evaluation": ["Part 1: Quick Evaluation (Paragraphs)", "Part 2: Short Passage Evaluation", "Part 3: Text Comprehension & Evaluation"],
        "reorganization": ["Part 1: Quick Reorganisation (Paragraphs)", "Part 2: Short Passage Reorganisation", "Part 3: Text Comprehension & Reorganisation"]
    }
    
    part_num = 1
    for sec_idx, sec in enumerate(normalized_sections):
        layout = sec["layout"]
        if layout in [LAYOUT_SENTENCE_TASK_LIST, LAYOUT_PAIRED_PASSAGE_LIST, LAYOUT_FOCUS_PASSAGE_LIST]:
            title = part_titles.get(skill, ["Part 1: Quick Items", "Part 2", "Part 3"])[0]
            md_content += f"## {title}\n\n"
            md_content += "Read each passage and answer the question.\n\n"
            for item_idx, item in enumerate(sec["items"]):
                q = item["questions"][0]
                md_content += f"### Question {item_idx + 1}\n"
                md_content += f"> {item['passage']}\n\n"
                md_content += f"* **Question:** {q['prompt']}\n"
                md_content += "* **Answer:** \n\n"
                if item_idx < len(sec["items"]) - 1:
                    md_content += "---\n\n"
            md_content += "\n"
            part_num = 2
        else:
            if part_num == 2:
                title = part_titles.get(skill, ["Part 1", "Part 2: Short Passage", "Part 3"])[1]
                md_content += f"## {title}\n\n"
                md_content += "Read the passage and answer the questions.\n\n"
                part_num = 3
            elif part_num == 3 and sec_idx == len(normalized_sections) - 1:
                title = part_titles.get(skill, ["Part 1", "Part 2", "Part 3: Text Comprehension"])[2]
                md_content += f"## {title}\n\n"
                md_content += "Read the text and answer the questions.\n\n"
                
            md_content += f"### Question {sec_idx + 3}: {sec['title'].upper()}\n"
            item = sec["items"][0]
            md_content += f"> {item['passage']}\n\n" if len(item['questions']) <= 2 else f"{item['passage']}\n\n"
            md_content += "* **Questions:**\n"
            for q_idx, q in enumerate(item["questions"]):
                letter = chr(97 + q_idx)
                md_content += f"  * **{letter}.** {q['prompt']}\n"
                md_content += "    * **Answer:** \n"
            md_content += "\n\n"
            
    os.makedirs(os.path.dirname(md_path), exist_ok=True)
    with open(md_path, "w", encoding="utf-8") as f:
        f.write(md_content)
    print(f"Generated Markdown source: {md_path}")


def generate_index_html(skill, level, handouts_info, out_root=None):
    global OUT_ROOT
    if OUT_ROOT and out_root is None:
        out_root = OUT_ROOT
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

    if out_root:
        out_path = os.path.join(out_root, skill, f"level-{level}", "index.html")
    else:
        out_path = os.path.join(base_dir, skill, f"level-{level}", "index.html")
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(index_html)
    print(f"Generated level index: {out_path}")


def main():
    import argparse
    global OUT_ROOT, TARGET_HANDOUT
    parser = argparse.ArgumentParser()
    parser.add_argument("--preview", action="store_true", help="Generate output in .build-preview folder")
    parser.add_argument("--handout", type=str, help="Only build a specific handout (e.g. 'inferencing-1-1')")
    args = parser.parse_args()

    if args.preview:
        OUT_ROOT = os.path.join(base_dir, ".build-preview")
        os.makedirs(OUT_ROOT, exist_ok=True)
    if args.handout:
        TARGET_HANDOUT = args.handout

    print("Loading raw files...")
    inf_items = parse_inference()
    reorg_items = parse_reorganisation()
    eval_l1_items = parse_evaluation("eval_level_1.json", "LEVEL_1")
    eval_l3_items = parse_evaluation("eval_level_3.json", "LEVEL_3")
    
    print(f"Loaded {len(inf_items)} Inferencing, {len(reorg_items)} Reorganisation, {len(eval_l1_items)} Eval L1, {len(eval_l3_items)} Eval L3 items.")
    
    # ----------------------------------------------------
    # 0. Inferencing Level 1 (8 Handouts)
    # ----------------------------------------------------
    print("\n--- Assembling Inferencing Level 1 ---")
    inf_l1 = [x for x in inf_items if x["level"] == "LEVEL_1"]
    sents_l1 = [x for x in inf_l1 if x["type"] == "sentence"]
    paras_l1 = [x for x in inf_l1 if x["type"] == "paragraph"]
    texts_l1 = [x for x in inf_l1 if x["type"] == "text"]
    
    handouts_info = []
    for h in range(1, 9):
        s_list = sents_l1[(h-1)*3 : h*3]
        p_list = paras_l1[(h-1)*2 : h*2]
        t_list = texts_l1[(h-1)*1 : h*1]
        
        if len(s_list) < 3 or len(p_list) < 2 or len(t_list) < 1:
            print(f"Warning: Insufficient items for Inf L1 Handout {h}")
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
        
        compile_handout("inferencing", 1, h, handout_data)
        desc = f"Quick Inferences, {p_list[0]['title']}, {p_list[1]['title']}, and {t_list[0]['title']}"
        handouts_info.append({"num": h, "desc": desc})
        
    generate_index_html("inferencing", 1, handouts_info)

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
