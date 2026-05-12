from playwright.sync_api import sync_playwright
import os

def capture_screenshots():
    output_dir = "c:/Users/dsuth/Documents/Joshua/Units/English/English_Unit_2/Cyclones/Screenshots"
    os.makedirs(output_dir, exist_ok=True)
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={'width': 1920, 'height': 1080})
        page = context.new_page()
        
        file_path = "file:///c:/Users/dsuth/Documents/Joshua/Units/English/English_Unit_2/Cyclones/Cyclone_Yasi/index.html"
        page.goto(file_path, wait_until="networkidle")
        
        # 1. Capture a Heading
        heading = page.locator('h2.text-3xl').first
        heading.screenshot(path=os.path.join(output_dir, "heading.png"), type='png')
        
        # 2. Capture Timeline
        timeline = page.locator('.editorial-sidebar-left > div')
        timeline.screenshot(path=os.path.join(output_dir, "timeline.png"), type='png')
        
        # 3. Capture Fast Facts
        fast_facts = page.locator('.editorial-sidebar-right > div')
        fast_facts.screenshot(path=os.path.join(output_dir, "fast_facts.png"), type='png')
        
        browser.close()

if __name__ == "__main__":
    capture_screenshots()
    print("Screenshots captured successfully.")
