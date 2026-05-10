import zipfile
import xml.etree.ElementTree as ET
import sys

def extract_text(p):
    try:
        z = zipfile.ZipFile(p)
        root = ET.fromstring(z.read('word/document.xml'))
        return '\n'.join(p.text for p in root.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}t') if p.text)
    except Exception as e:
        return f"Error reading {p}: {e}"

files = [
    r"c:\Users\dsuth\Documents\Joshua\Units\Science\Unit 2 Natural disasters\Lessons_06_08\Lesson_06\Lesson_06_Handout.docx",
    r"c:\Users\dsuth\Documents\Joshua\Units\Science\Unit 2 Natural disasters\Lessons_06_08\Lesson_06\Lesson_06_Handout_Support.docx",
    r"c:\Users\dsuth\Documents\Joshua\Units\Science\Unit 2 Natural disasters\Lessons_06_08\Lesson_06\Lesson_06_Assessment.docx",
    r"c:\Users\dsuth\Documents\Joshua\Units\Science\Unit 2 Natural disasters\Lessons_06_08\Lesson_06\Lesson_06_Reading_Larry.docx",
    r"c:\Users\dsuth\Documents\Joshua\Units\Science\Unit 2 Natural disasters\Lessons_06_08\Lesson_06\Lesson_06_Reading_Yasi.docx",
    r"c:\Users\dsuth\Documents\Joshua\Units\Science\Unit 2 Natural disasters\Resources\Documents\Sci_Y06_U3_SH_STCMarcia.docx",
    r"c:\Users\dsuth\Documents\Joshua\Units\Science\Unit 2 Natural disasters\Resources\Documents\Sci_Y06_U3_SH_TCSampleWarning.docx",
    r"c:\Users\dsuth\Documents\Joshua\Units\Science\Unit 2 Natural disasters\Resources\Documents\Sci_Y06_U3_SH_TCAdviceQuest.docx"
]

for f in files:
    print(f"\n--- {f.split('\\')[-1]} ---")
    print(extract_text(f))
