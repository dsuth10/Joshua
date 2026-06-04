import os
from playwright.sync_api import sync_playwright

def export_to_pdf():
    html_file = os.path.abspath("Units/English/English_Unit_2/Lesson_Plans/Lesson_25.2/Lesson Plan 25.2 Magazine Reading Year 3/index.html")
    pdf_file = os.path.abspath("Units/English/English_Unit_2/Lesson_Plans/Lesson_25.2/Lesson Plan 25.2 Magazine Reading Year 3/Lesson_Plan_25.2_Magazine_Reading_Y3.pdf")
    
    url = f"file:///{html_file.replace(os.sep, '/')}"
    print(f"Loading URL: {url}")
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        
        # Navigate to the local page
        page.goto(url, wait_until="load", timeout=60000)
        
        # Export as PDF with page size A4, 20mm margins, printing background graphics
        page.pdf(
            path=pdf_file,
            format="A4",
            print_background=True,
            margin={
                "top": "20mm",
                "bottom": "20mm",
                "left": "20mm",
                "right": "20mm"
            }
        )
        
        print(f"Successfully generated PDF: {pdf_file}")
        browser.close()

if __name__ == "__main__":
    export_to_pdf()
