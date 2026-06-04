import pdfplumber
import os

def extract_pdf_text():
    pdf_path = r"c:\Users\dsuth\Documents\Joshua\Scrap\2a. Daily Article - Australian Floods - UKS2 (9-11) (1).pdf"
    txt_path = r"c:\Users\dsuth\Documents\Joshua\scratch\floods_text.txt"
    
    try:
        with pdfplumber.open(pdf_path) as pdf:
            text = ""
            for i, page in enumerate(pdf.pages):
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
            
            with open(txt_path, "w", encoding="utf-8") as f:
                f.write(text)
            print(f"Successfully extracted text to {txt_path} ({len(text)} characters)")
    except Exception as e:
        print(f"Error extracting PDF: {str(e)}")

if __name__ == "__main__":
    extract_pdf_text()
