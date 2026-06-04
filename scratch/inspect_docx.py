from docx import Document

doc = Document("Units/English/English_Unit_2/Lesson_Plans/Lesson_25.2/Lesson_25.2_Worksheet.docx")
table2_text = doc.tables[2].rows[0].cells[0].text
print("RAW TEXT IN TABLE 2 CELL:")
print(repr(table2_text))
