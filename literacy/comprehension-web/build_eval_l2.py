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
    5: None,
    6: "handout-06-bridge.md",
    7: "handout-07-bridge.md"
}


def handout_5_data():
    """Original Level 2 evaluation material authored to the Questioning Guide."""
    return [
        {
            "id": "quick-evaluation",
            "title": "Part 1: Quick Evaluation",
            "short_title": "Quick Evaluation",
            "passages": [
                (
                    "The council's new bus route stops at both the library and the sports centre, "
                    "which the old route missed. However, passengers travelling to the railway "
                    "station now spend twelve extra minutes on the bus. The council newsletter "
                    "described the change as an improvement for the whole community."
                ),
                (
                    "After the class began using reusable containers, the rubbish collected at "
                    "lunchtime fell from five bags a week to one. The class captain announced, "
                    "\"We have solved our food-waste problem.\" The caretaker pointed out that "
                    "unfinished food taken home in lunchboxes was not included in the rubbish count."
                ),
                (
                    "A new shade sail covered one table in the school courtyard. On sunny days, "
                    "students filled the shaded table before using any of the tables in full sun. "
                    "The principal called the shade sail a successful first step, but said one busy "
                    "table did not yet show how much shade the whole courtyard needed."
                )
            ],
            "questions": [
                "Why might the council newsletter's claim that the bus route is an improvement for the whole community be too broad?",
                "Is the class captain's claim fully supported by the evidence? Why do you say that?",
                "Does the evidence justify covering every courtyard table with a shade sail? Why or why not?"
            ],
            "marking_guides": [
                (
                    "The student must identify the trade-off: the new stops help library or sports-centre "
                    "passengers, but station passengers have a twelve-minute longer trip. Accept any clear "
                    "explanation that the route does not improve travel for everyone. Reject a response that "
                    "mentions only the new stops or says merely that some people will not like it."
                ),
                (
                    "The student must judge that the claim is not fully supported because the count shows less "
                    "rubbish collected at school, not necessarily less food wasted; unfinished food taken home "
                    "was not measured. Accept equivalent wording that distinguishes container/rubbish reduction "
                    "from food-waste reduction. Reject 'no' without evidence or 'yes, because there was one bag'."
                ),
                (
                    "The student must combine the strong demand for the shaded table with the limitation of the "
                    "trial: only one table was covered, so the result does not establish how much shade the whole "
                    "courtyard needs. Accept 'it worked, but more evidence or more shade is needed'. Reject answers "
                    "that mention only popularity or only that the sail was new."
                )
            ]
        },
        {
            "id": "the-borrowing-bench",
            "title": "The Borrowing Bench",
            "short_title": "Borrowing Bench",
            "passage": (
                "The student council placed a borrowing bench beside the oval. At the start of each lunch break, "
                "the bench held footballs, skipping ropes and soft flying discs. Any student could borrow something "
                "without paying or bringing equipment from home. During the first week, the oval was busier and "
                "fewer students sat watching because they had nothing to use.\n\n"
                "By Friday, however, two footballs were missing and a skipping rope had been left in a puddle. Some "
                "students wanted the bench removed. Others suggested a sign-out sheet so borrowers would return "
                "equipment before the bell. The sports captain warned that a long sign-out line could use up much "
                "of the short lunch break."
            ),
            "questions": [
                "Why could the first week be described as encouraging even though some equipment was lost or damaged?",
                "Would a sign-out sheet be a completely effective solution? Explain one likely benefit and one limitation using the passage."
            ],
            "marking_guides": [
                (
                    "The student must weigh the positive participation outcome against the later problem: the bench "
                    "helped more students join in and reduced the number sitting out, despite missing or damaged "
                    "equipment. Accept equivalent answers that identify this as promising rather than perfect. "
                    "Reject an answer that discusses only the losses or only says the week was fun."
                ),
                (
                    "The response must give both sides. Benefit: a sign-out sheet could identify borrowers, encourage "
                    "returns or create responsibility. Limitation: the line or recording process could take up the "
                    "short lunch break and reduce playing time; it also cannot guarantee careful returns. Accept any "
                    "text-supported pairing. Reject a one-sided answer or an unsupported personal preference."
                )
            ]
        },
        {
            "id": "a-calmer-school-gate",
            "title": "A Calmer School Gate",
            "short_title": "Calmer School Gate",
            "passage": (
                "Every morning, cars crowded both sides of Banksia Primary School's narrow street. Drivers sometimes "
                "stopped across driveways, and students on bikes had to weave between opening car doors. Families "
                "complained about the traffic, but many still drove to the gate because it was quick and convenient.\n\n"
                "The school and local council tested a two-week Walking and Wheels Zone. From 8:15 until 9:00 am, "
                "only residents, school buses and vehicles with an access permit could enter the final 400 metres of "
                "the street. Other families could park at the community hall and walk, ride or use a scooter from "
                "there. Volunteers waited along the route and at two crossings.\n\n"
                "On most mornings, the entrance was noticeably quieter. Teachers counted about sixty per cent of "
                "students arriving through the zone, and no cars blocked the school crossing during the trial. Some "
                "students said the short walk gave them time to talk with friends before class. Nearby residents also "
                "reported that they could leave their driveways more easily.\n\n"
                "The trial did not suit everyone. Families coming from farms outside town said they could not walk or "
                "ride the whole way to school, although they could still use the community-hall drop-off point. A "
                "parent travelling with a toddler said the extra 400 metres made the morning harder. Access permits "
                "were available for people who could not safely travel that distance. On the only morning of heavy "
                "rain, participation dropped sharply and traffic built up around the hall instead of the school gate.\n\n"
                "After the trial, the student council recommended keeping the zone. It proposed covered bicycle racks, "
                "a clearly marked drop-off lane at the hall and a wet-weather exception when heavy rain was forecast. "
                "The council's road-safety officer called the trial promising, but said two weeks was too short to prove "
                "that the plan would work in every season. The school board will consider the proposal next month."
            ),
            "questions": [
                "Why did the road-safety officer describe the trial as promising rather than proven?",
                "How did the community-hall drop-off point help the plan meet two different needs?",
                "Was moving most cars away from the school gate enough to solve every traffic problem? Why do you say that?",
                "Why is the student council's final proposal more balanced than simply keeping the original trial unchanged?",
                "Reaction question: Should the school board support the student council's proposal? Explain your judgement using at least one benefit and one limitation from the text."
            ],
            "marking_guides": [
                (
                    "The student must identify both the positive evidence and the uncertainty: the entrance was quieter "
                    "and the crossing stayed clear, but the trial lasted only two weeks, included just one heavy-rain "
                    "morning and did not test every season. Accept equivalent answers that distinguish encouraging "
                    "results from sufficient long-term proof. Reject a response containing only a benefit or only 'it was short'."
                ),
                (
                    "The student must explain that the hall allowed families who lived too far away to drive most of "
                    "the journey while still keeping their cars out of the final 400 metres near the crowded school "
                    "gate. Accept equivalent wording joining convenience/access with gate safety or reduced congestion. "
                    "Reject answers that state only that families could park there."
                ),
                (
                    "The expected judgement is no. Although the gate and crossing became quieter, heavy rain shifted "
                    "traffic congestion to the community hall, and some families found the extra distance difficult. "
                    "Accept either relevant limitation with the successful gate result. Reject 'no' without evidence "
                    "or an answer claiming the plan made no improvement."
                ),
                (
                    "The student must explain that the revised proposal keeps the safety/congestion benefits while "
                    "addressing trial limitations through covered bicycle racks, a marked hall drop-off lane and/or a "
                    "wet-weather exception. One relevant improvement linked to a problem in the trial is sufficient. "
                    "Reject a list of additions that does not explain how they make the proposal more balanced."
                ),
                (
                    "Award the mark for a coherent position supported by at least one benefit and one limitation from "
                    "the passage. A yes response may weigh the quieter gate, clear crossing or resident access against "
                    "rain, distance or the short trial. A no/not-yet response may prioritise those limitations while "
                    "acknowledging the safety benefits. Reject unsupported preference, a response using only one side, "
                    "or a reason unrelated to this proposal."
                )
            ]
        }
    ]

def main():
    import argparse
    import build_all
    parser = argparse.ArgumentParser()
    parser.add_argument("--preview", action="store_true", help="Generate output in .build-preview folder")
    args = parser.parse_args()

    if args.preview:
        build_all.OUT_ROOT = os.path.join(build_all.base_dir, ".build-preview")
        os.makedirs(build_all.OUT_ROOT, exist_ok=True)

    handouts_info = []

    for num, fname in handouts_mapping.items():
        filepath = os.path.join(content_l2_dir, fname) if fname else None
        
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

        elif num == 5:
            handout_data = handout_5_data()
            desc = "Quick Evaluation, The Borrowing Bench, and A Calmer School Gate"
            
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


if __name__ == "__main__":
    main()
