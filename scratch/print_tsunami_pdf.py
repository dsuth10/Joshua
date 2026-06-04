import os
from playwright.sync_api import sync_playwright

def export_to_pdf():
    html_file = os.path.abspath("Units/English/English_Unit_2/Lesson_Plans/Lesson_25.2/Tsunami_Reading/index.html")
    pdf_file = os.path.abspath("Units/English/English_Unit_2/Lesson_Plans/Lesson_25.2/Tsunami_Reading/Tsunamis_Y5_Print.pdf")
    
    url = f"file:///{html_file.replace(os.sep, '/')}"
    print(f"Loading URL: {url}")
    
    with sync_playwright() as p:
        # Launch headless browser
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        
        # Set viewport width to 1200px so desktop layout is rendered for print evaluation
        page.set_viewport_size({"width": 1200, "height": 1600})
        
        # Navigate to the local page
        page.goto(url, wait_until="networkidle", timeout=60000)
        
        # Wait a small moment for rendering and fonts
        page.wait_for_timeout(1000)
        
        # Print to standard A4 PDF with 15mm margins and background colors enabled
        page.pdf(
            path=pdf_file,
            format="A4",
            print_background=True,
            margin={
                "top": "15mm",
                "bottom": "15mm",
                "left": "15mm",
                "right": "15mm"
            }
        )
        
        print(f"Successfully generated two-page PDF: {pdf_file}")
        browser.close()

if __name__ == "__main__":
    export_to_pdf()
