import os
import json
import xml.etree.ElementTree as ET
import re

# ------------------------------
# Configuration
# ------------------------------
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.normpath(os.path.join(SCRIPT_DIR, '..'))
CATEGORIES_DIR = os.path.normpath(os.path.join(SCRIPT_DIR, '..', 'resources', 'chat-icons'))
XML_PATH = os.path.join(CATEGORIES_DIR, 'GraphicChar.xml')
OUTPUT_FILENAME = 'metadata.json'
OUTPUT_PATH = os.path.join(CATEGORIES_DIR, OUTPUT_FILENAME)

# ------------------------------
# 1. Read in XML: List of all icon names in Unicode order
# ------------------------------
print(XML_PATH)
tree = ET.parse(XML_PATH)
root = tree.getroot()
xml_names = [elem.text.strip() for elem in root.findall('char')]

# ------------------------------
# 2. Mapping: name -> unicode (hex)
# ------------------------------
unicode_map = {}
for idx, name in enumerate(xml_names):
    unicode_map[name] = f"\\u{0xE000 + idx:04X}"

# ------------------------------
# 3. Sort icons by category
# ------------------------------
categories = []
skipped_icons = 0
for category in sorted(os.listdir(CATEGORIES_DIR)):
    category_path = os.path.join(CATEGORIES_DIR, category)
    if not os.path.isdir(category_path):
        continue
    icons = []
    for filename in sorted(os.listdir(category_path)):
        if not filename.lower().endswith('.png'):
            continue
        name = os.path.splitext(filename)[0]
        src = os.path.relpath(os.path.join(category_path, filename), start=PROJECT_ROOT).replace('\\', '/')
        unicode_hex = unicode_map.get(name)
        if unicode_hex is None:
            print(f"WARNING: {name} in {category} has no Unicode entry in the XML!")
            skipped_icons += 1
            continue
        icons.append({
            "name": name,
            "src": src,
            "unicode": unicode_hex,
            "keywords": []
        })
    categories.append({
        "category": category,
        "icons": icons
    })

# ------------------------------
# 4 Write JSON
# ------------------------------
with open(OUTPUT_PATH, 'w', encoding='utf-8') as f:
    json_text = json.dumps(categories, ensure_ascii=True, indent=2)
    # Fix: convert double-escaped unicode to single-escaped
    json_text = re.sub(r'\\\\u([0-9A-Fa-f]{4})', r'\\u\1', json_text)
    f.write(json_text)

# ------------------------------
# Summary output
# ------------------------------
total_icons = sum(len(cat['icons']) for cat in categories)
print(f"{OUTPUT_FILENAME} written with {total_icons} icons in total.")

print("Icons per category:")
for cat in categories:
    count = len(cat['icons'])
    print(f"  - {cat['category']}: {count} icon{'s' if count != 1 else ''}")

if skipped_icons > 0:
    print(f"\nSkipped {skipped_icons} icons due to missing Unicode entries.")