"""Compile Lesson 22 letters deck through the lesson-creator wrapper."""
from pathlib import Path
import importlib.util

ROOT = Path(__file__).resolve().parents[1]
WORKSPACE = ROOT.parents[5]
COMPILER = WORKSPACE / ".agents" / "skills" / "lesson-creator" / "scripts" / "compile_presentation.py"

def build():
    spec = importlib.util.spec_from_file_location("lesson_creator_compiler", COMPILER)
    module = importlib.util.module_from_spec(spec); spec.loader.exec_module(module)
    assets = ROOT / "assets"
    return module.compile_presentation(
        assets / "letters_slides.html",
        ROOT / "Lesson_22_Letters_to_Editor_Bias_Presentation.html",
        css_path=assets / "letters_presentation.css",
        js_path=assets / "letters_presentation.js",
        title="Lesson 22 Alternative | Letters from Seabreeze Square",
        language="en-AU",
    )

if __name__ == "__main__": print(build())

