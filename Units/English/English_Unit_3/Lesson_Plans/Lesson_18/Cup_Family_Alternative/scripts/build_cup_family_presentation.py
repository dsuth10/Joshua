from pathlib import Path


def build_presentation(root: Path) -> Path:
    """Compile the Lesson 18 deck through the lesson-creator standard wrapper."""
    root = Path(root)
    workspace = root.parents[5]
    template_path = workspace / ".agent" / "skills" / "lesson-creator" / "assets" / "presentation_template.html"
    assets = root / "assets"

    template = template_path.read_text(encoding="utf-8")
    slides = (assets / "cup_family_slides.html").read_text(encoding="utf-8")
    lesson_css = (assets / "cup_family_presentation.css").read_text(encoding="utf-8")
    lesson_js = (assets / "cup_family_presentation.js").read_text(encoding="utf-8")

    placeholder = "<!-- SLIDES GO HERE DURING DYNAMIC COMPILATION -->"
    if placeholder not in template:
        raise RuntimeError("The lesson-creator presentation template is missing its slide placeholder.")

    html = template.replace('<html lang="en">', '<html lang="en-AU">')
    html = html.replace(
        "<title>Classroom Presentation Template</title>",
        "<title>Lesson 18 Alternative | One Cup, Two Loyalties</title>",
    )
    html = html.replace(placeholder, slides)
    html = html.replace("</head>", f"<style>\n{lesson_css}\n</style>\n</head>")
    html = html.replace("</body>", f"<script>\n{lesson_js}\n</script>\n</body>")

    out = root / "Lesson_18_Cup_Family_Persuasive_Presentation.html"
    out.write_text(html, encoding="utf-8")
    return out


if __name__ == "__main__":
    lesson_root = Path(__file__).resolve().parents[1]
    print(build_presentation(lesson_root))
