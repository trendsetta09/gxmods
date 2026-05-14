from playwright.async_api import async_playwright


async def run_task(task: str) -> str:
    """
    Execute a natural-language browser task.
    Currently supports: 'screenshot <url>', 'get_text <url>', 'click <url> <selector>'
    Extend with an LLM-driven planner as needed.
    """
    parts = task.strip().split(" ", 2)
    command = parts[0].lower()

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()

        try:
            if command == "screenshot" and len(parts) >= 2:
                await page.goto(parts[1], wait_until="networkidle")
                path = f"static/screenshots/{parts[1].split('//')[-1][:40]}.png"
                await page.screenshot(path=path, full_page=True)
                return f"Screenshot saved: /{path}"

            elif command == "get_text" and len(parts) >= 2:
                await page.goto(parts[1], wait_until="networkidle")
                text = await page.inner_text("body")
                return text[:2000]

            elif command == "click" and len(parts) >= 3:
                url, selector = parts[1], parts[2]
                await page.goto(url, wait_until="networkidle")
                await page.click(selector)
                return f"Clicked '{selector}' on {url}"

            else:
                return f"Unknown command: {command}. Supported: screenshot, get_text, click"

        finally:
            await browser.close()
