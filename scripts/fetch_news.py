import json
import urllib.request
import xml.etree.ElementTree as ET
from pathlib import Path
from datetime import datetime, timezone

OUTPUT = Path("data/headlines.json")
FEED = "https://feeds.bbci.co.uk/news/world/rss.xml"

try:
    request = urllib.request.Request(
        FEED,
        headers={"User-Agent": "Sinist3rKr3w-News/1.0"}
    )

    with urllib.request.urlopen(request, timeout=20) as response:
        root = ET.fromstring(response.read())

    headlines = []
    seen = set()

    for item in root.findall("./channel/item"):
        title = (item.findtext("title") or "").strip()
        link = (item.findtext("link") or "").strip()

        if not title or not link or title in seen:
            continue

        seen.add(title)
        headlines.append({
            "category": "WORLD",
            "title": title,
            "url": link,
            "source": "BBC News"
        })

        if len(headlines) >= 10:
            break

    if not headlines:
        raise ValueError("No headlines found")

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)

    payload = {
        "updated": datetime.now(timezone.utc).isoformat(),
        "headlines": headlines
    }

    OUTPUT.write_text(
        json.dumps(payload, indent=2),
        encoding="utf-8"
    )

    print(f"SUCCESS: Saved {len(headlines)} headlines.")

except Exception as error:
    print(f"ERROR: {error}")
    print("Existing headline data was preserved.")
    raise SystemExit(1)
