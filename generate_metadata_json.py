import os
import json
import xml.etree.ElementTree as ET

# Konfiguration anpassen
CATEGORIES_DIR = './resources/chat-icons'  # Übergeordneter Ordner mit Kategorie-Unterordnern
XML_PATH = './GraphicChar.xml'             # XML-Datei mit allen <char>-Einträgen
OUTPUT_PATH = './resources/chat-icons/metadata.json'

# 1. XML einlesen: Liste aller Icon-Namen in Unicode-Reihenfolge
tree = ET.parse(XML_PATH)
root = tree.getroot()
xml_names = [elem.text.strip() for elem in root.findall('char')]

# 2. Mapping: name -> unicode (hex)
unicode_map = {}
for idx, name in enumerate(xml_names):
    unicode_map[name] = f"{0xE000 + idx:04X}"

# 3. Icons nach Kategorien einsortieren
categories = []
for category in sorted(os.listdir(CATEGORIES_DIR)):
    category_path = os.path.join(CATEGORIES_DIR, category)
    if not os.path.isdir(category_path):
        continue
    icons = []
    for filename in sorted(os.listdir(category_path)):
        if not filename.lower().endswith('.png'):
            continue
        name = os.path.splitext(filename)[0]
        src = f"{CATEGORIES_DIR}/{category}/{filename}".replace('./', '').replace('\\', '/')
        unicode_hex = unicode_map.get(name)
        if unicode_hex is None:
            print(f"WARNUNG: {name} in {category} hat keinen Unicode-Eintrag in der XML!")
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

# 4. JSON schreiben
with open(OUTPUT_PATH, 'w', encoding='utf-8') as f:
    json.dump(categories, f, ensure_ascii=False, indent=2)

print(f"metadata.json mit {sum(len(cat['icons']) for cat in categories)} Icons geschrieben.")
