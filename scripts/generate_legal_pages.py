import json
import os

# ------------------------------
# Configuration
# ------------------------------
CONFIG_PATH = '../config/secret_config.json'
IMPRESSUM_TEMPLATE_PATH = '../templates/impressum_template.html'
DATENSCHUTZ_TEMPLATE_PATH = '../templates/datenschutz_template.html'
IMPRESSUM_OUTPUT_PATH = '../impressum.html'
DATENSCHUTZ_OUTPUT_PATH = '../datenschutz.html'

def generate_html(template_path, output_path, config):
    with open(template_path, 'r', encoding='utf-8') as f:
        template = f.read()

    # Replace placeholders like {{key}} with values from config
    for key, value in config.items():
        template = template.replace(f'{{{{{key}}}}}', value)

    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(template)

    print(f"Generated: {output_path}")

if __name__ == '__main__':
    with open(CONFIG_PATH, 'r', encoding='utf-8') as f:
        config = json.load(f)

    generate_html(IMPRESSUM_TEMPLATE_PATH, IMPRESSUM_OUTPUT_PATH, config)
    generate_html(DATENSCHUTZ_TEMPLATE_PATH, DATENSCHUTZ_OUTPUT_PATH, config)