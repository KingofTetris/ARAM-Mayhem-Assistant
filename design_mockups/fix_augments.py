from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 500, "height": 920}, device_scale_factor=2)
    page.goto("http://localhost:8765/augments.html", wait_until="networkidle")
    page.evaluate("document.body.setAttribute('data-theme', 'abyssal')")
    page.wait_for_timeout(800)
    page.screenshot(path=r"d:\traeProjects\ARAM_Mayhem_Assistant\design_pictures\01_abyssal_arena\augments.png")
    print("[OK] augments.png saved")
    browser.close()
