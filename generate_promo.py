#!/usr/bin/env python3
"""Generate promo video data files from a website URL or SVG asset."""

import argparse
import json
import re
import sys
import os
from urllib.parse import urljoin

try:
    import requests
except ImportError:
    print("Error: requests is required. Install with: pip install requests")
    sys.exit(1)

try:
    from bs4 import BeautifulSoup
except ImportError:
    print("Error: beautifulsoup4 is required. Install with: pip install beautifulsoup4")
    sys.exit(1)

try:
    from PIL import ImageColor
except ImportError:
    ImageColor = None

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(SCRIPT_DIR, "src", "data")


def is_url(source):
    return source.startswith("http://") or source.startswith("https://")


def fetch_page(url):
    resp = requests.get(url, timeout=15, headers={
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"
    })
    resp.raise_for_status()
    return resp.text, url


def extract_colors_from_css(css_text):
    colors = set()
    hex_pattern = re.findall(r'#[0-9a-fA-F]{3,8}\b', css_text)
    rgb_pattern = re.findall(r'rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)', css_text)
    rgba_pattern = re.findall(r'rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[\d.]+\s*\)', css_text)
    colors.update(hex_pattern)
    colors.update(rgb_pattern)
    colors.update(rgba_pattern)
    return list(colors)


def hex_to_rgb(hex_str):
    """Convert hex color to (r, g, b) tuple."""
    hex_str = hex_str.lstrip("#")
    if len(hex_str) == 3:
        hex_str = "".join(c * 2 for c in hex_str)
    if len(hex_str) < 6:
        return None
    try:
        return (int(hex_str[0:2], 16), int(hex_str[2:4], 16), int(hex_str[4:6], 16))
    except ValueError:
        return None


def extract_button_colors(soup):
    """Extract brand colors from CTA button / link elements' inline styles."""
    button_colors = []

    for tag in soup.find_all(["button", "a"]):
        style = tag.get("style", "")
        if not style:
            continue

        # Check if element looks like a CTA (has background, is a button/link with text)
        text = tag.get_text(strip=True)
        if not text or len(text) > 40:
            continue

        has_bg = bool(re.search(r"background", style))
        has_gradient = "gradient" in style
        if not (has_bg or has_gradient):
            continue

        # Extract hex colors from background-image (gradients) and background-color
        hex_colors = re.findall(r'#[0-9a-fA-F]{6}\b', style)
        rgb_matches = re.findall(r'rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)', style)

        for hc in hex_colors:
            rgb = hex_to_rgb(hc)
            if rgb:
                brightness = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000
                # Skip near-white/near-black and very transparent-looking colors
                if 20 < brightness < 240:
                    button_colors.append({
                        "hex": f"#{rgb[0]:02x}{rgb[1]:02x}{rgb[2]:02x}",
                        "brightness": brightness,
                        "priority": 0 if has_gradient else 1,
                    })

        for rm in rgb_matches:
            r, g, b = int(rm[0]), int(rm[1]), int(rm[2])
            brightness = (r * 299 + g * 587 + b * 114) / 1000
            if 20 < brightness < 240:
                button_colors.append({
                    "hex": f"#{r:02x}{g:02x}{b:02x}",
                    "brightness": brightness,
                    "priority": 0 if has_gradient else 1,
                })

    # Prefer gradient buttons (priority 0), then sort by brightness
    button_colors.sort(key=lambda x: (x["priority"], x["brightness"]))

    # Deduplicate by hex
    seen = set()
    unique = []
    for c in button_colors:
        if c["hex"] not in seen:
            seen.add(c["hex"])
            unique.append(c)

    return unique


def pick_brand_colors(colors):
    """Fallback: pick brand colors from a pool of CSS colors by brightness."""
    candidates = []
    for c in colors:
        c = c.strip()
        if not c:
            continue
        try:
            if ImageColor:
                r, g, b = ImageColor.getrgb(c)
            else:
                if c.startswith("#") and len(c) == 7:
                    r, g, b = int(c[1:3], 16), int(c[3:5], 16), int(c[5:7], 16)
                else:
                    continue
            brightness = (r * 299 + g * 587 + b * 114) / 1000
            if 30 < brightness < 220:
                candidates.append({"hex": f"#{r:02x}{g:02x}{b:02x}", "brightness": brightness})
        except Exception:
            continue

    candidates.sort(key=lambda x: x["brightness"])

    if len(candidates) >= 2:
        primary = candidates[len(candidates) // 3]["hex"]
        secondary = candidates[2 * len(candidates) // 3]["hex"]
    elif len(candidates) == 1:
        primary = candidates[0]["hex"]
        secondary = candidates[0]["hex"]
    else:
        primary = "#4F46E5"
        secondary = "#7C3AED"

    return primary, secondary


def detect_background_theme(soup):
    """Detect if the website is light or dark themed by checking body/html background."""
    bg_colors = []

    for tag_name in ["body", "html"]:
        tag = soup.find(tag_name)
        if not tag:
            continue
        # Check inline style
        style = tag.get("style", "")
        bg_match = re.findall(r'background(?:-color)?\s*:\s*(#[0-9a-fA-F]{3,8}|rgb\([^)]+\))', style)
        bg_colors.extend(bg_match)

    # Check CSS variables for --bg, --background, --bg-color
    for style_tag in soup.find_all("style"):
        css = style_tag.get_text()
        for var in ["--bg", "--background", "--bg-color", "--bgColor", "--surface"]:
            match = re.search(rf'{var}\s*:\s*(#[0-9a-fA-F]{{3,8}})', css)
            if match:
                bg_colors.append(match.group(1))

    if bg_colors:
        c = bg_colors[0]
        try:
            if ImageColor:
                r, g, b = ImageColor.getrgb(c)
            elif c.startswith("#") and len(c) == 7:
                r, g, b = int(c[1:3], 16), int(c[3:5], 16), int(c[5:7], 16)
            else:
                return "dark"
            brightness = (r * 299 + g * 587 + b * 114) / 1000
            return "light" if brightness > 128 else "dark"
        except Exception:
            pass

    return "light"


def build_theme_colors(primary, secondary, theme):
    """Build full color palette based on detected theme."""
    if theme == "light":
        return {
            "primary": primary,
            "secondary": secondary,
            "background": "#FFFFFF",
            "surface": "#F8FAFC",
            "text": "#0F172A",
            "textSecondary": "#64748B",
            "accent": primary,
        }
    else:
        return {
            "primary": primary,
            "secondary": secondary,
            "background": "#0F172A",
            "surface": "#1E293B",
            "text": "#F8FAFC",
            "textSecondary": "#94A3B8",
            "accent": "#38BDF8",
        }


def scrape_website(url):
    html, base_url = fetch_page(url)
    soup = BeautifulSoup(html, "html.parser")

    name = ""
    # Prefer og:site_name for clean brand name
    og_site = soup.find("meta", attrs={"property": "og:site_name"})
    if og_site and og_site.get("content"):
        name = og_site["content"].strip()
    if not name:
        title_tag = soup.find("title")
        if title_tag:
            name = title_tag.get_text(strip=True).split(" - ")[0].split(" | ")[0].strip()

    tagline = ""
    og_desc = soup.find("meta", attrs={"property": "og:description"})
    if og_desc and og_desc.get("content"):
        tagline = og_desc["content"].strip()
    if not tagline:
        meta_desc = soup.find("meta", attrs={"name": "description"})
        if meta_desc and meta_desc.get("content"):
            tagline = meta_desc["content"].strip()
    if not tagline:
        h1 = soup.find("h1")
        if h1:
            tagline = h1.get_text(strip=True)
    # Truncate tagline to reasonable length for video
    if len(tagline) > 80:
        tagline = tagline[:77] + "..."

    # Priority 1: extract colors from CTA buttons
    button_colors = extract_button_colors(soup)
    if len(button_colors) >= 2:
        primary = button_colors[0]["hex"]
        secondary = button_colors[1]["hex"]
    elif len(button_colors) == 1:
        primary = button_colors[0]["hex"]
        secondary = button_colors[0]["hex"]
    else:
        # Fallback: scan all CSS colors
        all_css = ""
        for style in soup.find_all("style"):
            all_css += style.get_text() + "\n"
        css_colors = extract_colors_from_css(all_css)
        primary, secondary = pick_brand_colors(css_colors)

    theme = detect_background_theme(soup)
    colors = build_theme_colors(primary, secondary, theme)

    logo_url = ""
    icon_link = soup.find("link", rel=re.compile(r"icon", re.I))
    if icon_link and icon_link.get("href"):
        logo_url = urljoin(base_url, icon_link["href"])
    if not logo_url:
        img = soup.find("img", class_=re.compile(r"logo", re.I))
        if not img:
            img = soup.find("img", alt=re.compile(r"logo", re.I))
        if img and img.get("src"):
            logo_url = urljoin(base_url, img["src"])

    features = []
    for heading in soup.find_all(["h2", "h3"]):
        text = heading.get_text(strip=True)
        # Skip overly long titles (likely not clean feature names)
        if 3 < len(text) < 45 and text not in [f["title"] for f in features]:
            desc_tag = heading.find_next(["p"])
            desc = desc_tag.get_text(strip=True)[:100] if desc_tag else ""
            features.append({"title": text, "description": desc})
        if len(features) >= 4:
            break

    if not features:
        features = [
            {"title": "Fast", "description": "Optimized performance"},
            {"title": "Secure", "description": "Enterprise-grade security"},
            {"title": "Scalable", "description": "Grows with you"},
        ]

    brand = {
        "name": name or "Brand",
        "tagline": tagline or "Build something amazing",
        "colors": colors,
        "font": "Inter, SF Pro Text, Helvetica, Arial, sans-serif",
        "logoUrl": logo_url,
        "features": features[:3],
        "cta": {
            "headline": f"Ready to try {name or 'it'}?",
            "buttonText": "Get Started",
            "url": base_url,
        },
    }

    return brand


def parse_svg(path):
    with open(path, "r") as f:
        content = f.read()

    soup = BeautifulSoup(content, "html.parser")

    texts = [t.get_text(strip=True) for t in soup.find_all(["text", "tspan"]) if t.get_text(strip=True)]
    name = texts[0] if texts else "Brand"
    tagline = texts[1] if len(texts) > 1 else ""

    colors = set()
    for attr in ["fill", "stroke", "color"]:
        for el in soup.find_all(attrs={attr: True}):
            val = el[attr]
            if val and val != "none" and not val.startswith("url"):
                colors.add(val)
    css_colors = extract_colors_from_css(str(soup.find_all("style")))
    colors.update(css_colors)

    primary, secondary = pick_brand_colors(list(colors))
    svg_colors = build_theme_colors(primary, secondary, "light")

    brand = {
        "name": name,
        "tagline": tagline or "",
        "colors": svg_colors,
        "font": "Inter, SF Pro Text, Helvetica, Arial, sans-serif",
        "logoUrl": os.path.abspath(path),
        "features": [],
        "cta": {"headline": "", "buttonText": "", "url": ""},
    }

    # Single-scene script for SVG — just animate the image
    script = {
        "fps": 30,
        "width": 1920,
        "height": 1080,
        "scenes": [
            {
                "id": "svg",
                "duration": 150,
                "svgUrl": os.path.abspath(path),
            },
        ],
    }

    return brand, script


def build_script(brand):
    features = brand.get("features", [
        {"title": "AI Website Builder", "description": ""},
        {"title": "AI Dashboard Generator", "description": ""},
        {"title": "One-Click Deploy", "description": ""},
    ])
    # Ensure exactly 3 feature items for the card layout
    features = (features + [
        {"title": "AI Website Builder", "description": ""},
        {"title": "AI Dashboard Generator", "description": ""},
        {"title": "One-Click Deploy", "description": ""},
    ])[:3]

    name = brand.get("name", "Brand")
    tagline = brand.get("tagline", "")

    return {
        "fps": 30,
        "width": 1920,
        "height": 1080,
        "scenes": [
            {
                "id": "intro",
                "duration": 90,
                "headline": name,
                "subtext": tagline,
                "subtitle": tagline[:50] if tagline else "",
            },
            {
                "id": "feature",
                "duration": 150,
                "headline": "",
                "subtitle": "From idea to live product in minutes",
                "items": features,
            },
            {
                "id": "dashboard",
                "duration": 120,
                "headline": "",
                "subtitle": "Real-time analytics at your fingertips",
            },
            {
                "id": "cta",
                "duration": 90,
                "headline": "Ready to vibe code?",
                "buttonText": "Get Started Free",
                "subtitle": f"Start building with {name} today",
            },
        ],
    }


def main():
    parser = argparse.ArgumentParser(description="Generate promo video data from a URL or SVG")
    parser.add_argument("--source", required=True, help="Website URL or path to SVG file")
    args = parser.parse_args()

    if is_url(args.source):
        print(f"Fetching {args.source}...")
        brand = scrape_website(args.source)
        script = build_script(brand)
    elif os.path.isfile(args.source):
        print(f"Parsing {args.source}...")
        brand, script = parse_svg(args.source)
    else:
        print(f"Error: {args.source} is not a valid URL or file path")
        sys.exit(1)

    os.makedirs(DATA_DIR, exist_ok=True)
    brand_path = os.path.join(DATA_DIR, "brand.json")
    script_path = os.path.join(DATA_DIR, "script.json")

    with open(brand_path, "w") as f:
        json.dump(brand, f, indent=2, ensure_ascii=False)
    print(f"Wrote {brand_path}")

    with open(script_path, "w") as f:
        json.dump(script, f, indent=2, ensure_ascii=False)
    print(f"Wrote {script_path}")

    print(f"\nBrand: {brand['name']}")
    print(f"Colors: primary={brand['colors']['primary']}, secondary={brand['colors']['secondary']}")
    if len(script["scenes"]) == 1:
        print(f"Mode: Single SVG animation ({script['scenes'][0]['duration'] / script['fps']:.0f}s)")
    else:
        print(f"Scenes: {len(script['scenes'])}")
    print("\nNext: run `npm run dev` to preview the video")


if __name__ == "__main__":
    main()
