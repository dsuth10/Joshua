import pdfplumber
import sys

def extract_pdf_text(pdf_path):
    try:
        with pdfplumber.open(pdf_path) as pdf:
            text = ""
            for i, page in enumerate(pdf.pages):
                page_text = page.extract_text()
                if page_text:
                    text += f"--- Page {i+1} ---\n{page_text}\n\n"
            return text
    except Exception as e:
        return f"Error: {str(e)}"

if __name__ == "__main__":
    pdf_file = r'c:\Users\dsuth\Documents\Joshua\Units\Maths\Maths Unit 1\grid-coordinates-1\Grid coordinates lesson 1.pdf'
    print(extract_pdf_text(pdf_file))
