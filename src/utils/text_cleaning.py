import re

def clean_text(text):
    if not text:
        return ""

    # Normalize whitespace
    text = re.sub(r'\n{3,}', '\n\n', text)
    text = re.sub(r'[ \t]+', ' ', text)

    # Remove common boilerplate phrases
    BOILERPLATE = [
        "cookie policy",
        "privacy policy",
        "terms of service",
        "subscribe",
        "sign up",
        "advertisement"
    ]

    lines = text.splitlines()
    cleaned_lines = [
        line for line in lines
        if not any(bp in line.lower() for bp in BOILERPLATE)
        and len(line.strip()) > 30
    ]

    text = "\n".join(cleaned_lines).strip()

    # Length guards
    if len(text.split()) < 300:
        return ""

    if len(text.split()) > 9000:
        text = " ".join(text.split()[:9000])

    return text
