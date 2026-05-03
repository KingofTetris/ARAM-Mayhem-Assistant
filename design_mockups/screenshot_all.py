from playwright.sync_api import sync_playwright
import os

BASE_URL = "http://localhost:8765"
OUTPUT_BASE = r"d:\traeProjects\ARAM_Mayhem_Assistant\design_pictures"

THEMES = [
    ("abyssal", "01_abyssal_arena"),
    ("luminous", "02_luminous_minimal"),
    ("neon", "03_neon_pulse"),
]

PAGES = [
    "home.html",
    "heros.html",
    "card_detail.html",
    "augments.html",
    "bulltin.html",
    "player_interface.html",
    "publish_stratege.html",
    "release_success.html",
    "strong_level_explain.html",
    "version_trap.html",
]

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    context = browser.new_context(
        viewport={"width": 500, "height": 920},
        device_scale_factor=2,
    )

    for theme_attr, theme_dir in THEMES:
        out_dir = os.path.join(OUTPUT_BASE, theme_dir)
        os.makedirs(out_dir, exist_ok=True)

        for page_file in PAGES:
            page = context.new_page()
            url = f"{BASE_URL}/{page_file}"
            page.goto(url, wait_until="networkidle")

            page.evaluate(f"document.body.setAttribute('data-theme', '{theme_attr}')")
            page.wait_for_timeout(500)

            name_base = page_file.replace(".html", "")
            out_path = os.path.join(out_dir, f"{name_base}.png")
            page.screenshot(path=out_path, full_page=False)
            print(f"[OK] {theme_dir}/{page_file}")

            page.close()

    browser.close()

print("\nAll screenshots complete.")
