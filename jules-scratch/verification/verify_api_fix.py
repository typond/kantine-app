from playwright.sync_api import sync_playwright, expect
import os

def run_verification():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Listen for all console events and print them
        page.on("console", lambda msg: print(f"Browser console: {msg.text}"))

        # Navigate to the local server
        page.goto('http://localhost:8000')

        # Click the "Get menu & recommendations" button
        process_btn = page.locator("#process-btn")
        expect(process_btn).to_be_enabled()
        process_btn.click()

        # Wait for the loading spinner to disappear, which indicates the API call is complete
        loading_spinner = page.locator("#loading-spinner")
        expect(loading_spinner).to_be_hidden(timeout=60000)

        # Check if the menu container is visible
        menu_container = page.locator("#menu-container")

        # Take a screenshot
        page.screenshot(path="jules-scratch/verification/verification.png")

        browser.close()

if __name__ == "__main__":
    run_verification()