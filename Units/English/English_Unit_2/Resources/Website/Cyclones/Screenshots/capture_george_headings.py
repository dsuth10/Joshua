from playwright.sync_api import sync_playwright
import os

def capture_screenshots():
    output_dir = "c:/Users/dsuth/Documents/Joshua/Units/English/English_Unit_2/Cyclones/Screenshots/George_Headings"
    os.makedirs(output_dir, exist_ok=True)
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={'width': 1920, 'height': 1080})
        page = context.new_page()
        
        file_path = "file:///c:/Users/dsuth/Documents/Joshua/Units/English/English_Unit_2/Cyclones/Cyclone_George/index.html"
        page.goto(file_path, wait_until="networkidle")
        
        headings = page.locator('h2').all()
        for i, heading in enumerate(headings):
            # scroll into view to make sure it's rendered properly
            heading.scroll_into_view_if_needed()
            heading.screenshot(path=os.path.join(output_dir, f"heading_{i+1}.png"), type='png')
            print(f"Captured heading {i+1}: {heading.text_content()}")
            
        browser.close()

if __name__ == "__main__":
    capture_screenshots()
    print("Screenshots captured successfully.")
