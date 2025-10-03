from playwright.sync_api import sync_playwright, expect
import os

def run_verification():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Go to the local index.html file served by the python server
        page.goto('http://localhost:8000/index.html')

        # Click the "Get Menu & Recommendations" button
        process_btn = page.locator("#process-btn")
        expect(process_btn).to_be_enabled()
        process_btn.click()

        # Wait for the menu container to be visible, which indicates the API call is complete
        # and the menu has been rendered. Increase timeout as the API call can be slow.
        menu_container = page.locator("#menu-container")
        expect(menu_container).to_be_visible(timeout=60000) # 60 second timeout

        # Specifically wait for a highlighted dish to appear to confirm the new prompt works
        highlighted_dish = page.locator(".highlight-dish").first
        expect(highlighted_dish).to_be_visible(timeout=10000) # 10 second timeout after menu is visible

        # Take a screenshot
        page.screenshot(path="jules-scratch/verification/verification.png")

        browser.close()

if __name__ == "__main__":
    run_verification()