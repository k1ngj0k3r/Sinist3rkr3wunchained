import json
import urllib.request
import xml.etree.ElementTree as ET
from pathlib import Path
from datetime import datetime, timezone, timedelta
from email.utils import parsedate_to_datetime

OUTPUT = Path("data/headlines.json")
FEEDS = [
    {
        "category": "US",
        "url": "https://feeds.bbci.co.uk/news/world/us_and_canada/rss.xml",
        "source": "BBC News"
    },
    {
        "category": "OHIO",
        "url": "https://news.google.com/rss/search?q=Ohio+Columbus+news&hl=en-US&gl=US&ceid=US:en",
        "source": "Google News"
    },
    {
        "category": "OHIO",
        "url": "https://news.google.com/rss/search?q=Ohio+breaking+news&hl=en-US&gl=US&ceid=US:en",
        "source": "Google News"
    },
    {
        "category": "WORLD",
        "url": "https://feeds.bbci.co.uk/news/world/rss.xml",
        "source": "BBC News"
    }
]

try:
    headlines = []
    seen = set()
    successful_feeds = 0

    limits = {
        "US": 10,
        "OHIO": 10,
        "WORLD": 5
    }

    for feed in FEEDS:
        try:
            request = urllib.request.Request(
                feed["url"],
                headers={
                    "User-Agent": "Sinist3rKr3w-News/1.0"
                }
            )

            with urllib.request.urlopen(
                request, timeout=20
            ) as response:
                root = ET.fromstring(response.read())

            count = 0

            for item in root.findall("./channel/item"):
                title = (
                    item.findtext("title") or ""
                ).strip()

                link = (
                    item.findtext("link") or ""
                ).strip()

                if not title or not link:
                    continue

                published_text = item.findtext("pubDate")

                if not published_text:
                    continue

                try:
                    published = parsedate_to_datetime(
                        published_text
                    ).astimezone(timezone.utc)
                except (TypeError, ValueError, IndexError):
                    continue

                now = datetime.now(timezone.utc)

                if not (
                    now - timedelta(hours=48)
                    <= published
                    <= now + timedelta(minutes=10)
                ):
                    continue

                key = title.casefold()

                blocked_titles = {
                    "10tv news at four",
                    "10tv news at five",
                    "10tv news at six",
                    "10tv news at eleven"
                }

                clean_title = key.split(" - ")[0].strip()

                if clean_title in blocked_titles:
                    continue

                if key in seen:
                    continue

                seen.add(key)

                breaking_terms = (
                    "breaking", "evacuation",
                    "active shooter", "tornado warning",
                    "earthquake", "explosion",
                    "state of emergency"
                )

                developing_terms = (
                    "investigation", "shooting",
                    "crash", "outage",
                    "missing", "arrested",
                    "charged", "wildfire",
                    "flooding"
                )

                if any(
                    term in key
                    for term in breaking_terms + developing_terms
                ):
                    priority = "DEVELOPING"
                else:
                    priority = "GENERAL"

                headlines.append({
                    "category": feed["category"],
                    "priority": priority,
                    "title": title,
                    "url": link,
                    "source": feed["source"]
                })

                count += 1

                if count >= limits.get(
                    feed["category"], 5
                ):
                    break

            successful_feeds += 1

            print(
                f'{feed["category"]}: '
                f'{count} headlines collected.'
            )

        except Exception as feed_error:
            print(
                f'WARNING: {feed["category"]} '
                f'feed failed: {feed_error}'
            )

    if not headlines:
        raise ValueError("No headlines collected")

    OUTPUT.parent.mkdir(
        parents=True, exist_ok=True
    )

    payload = {
        "updated": datetime.now(
            timezone.utc
        ).isoformat(),
        "headlines": headlines
    }

    OUTPUT.write_text(
        json.dumps(payload, indent=2),
        encoding="utf-8"
    )

    print(
        f"SUCCESS: Saved {len(headlines)} "
        f"headlines from {successful_feeds} feeds."
    )

except Exception as error:
    print(f"ERROR: {error}")
    print("Existing headline data was preserved.")
    raise SystemExit(1)
