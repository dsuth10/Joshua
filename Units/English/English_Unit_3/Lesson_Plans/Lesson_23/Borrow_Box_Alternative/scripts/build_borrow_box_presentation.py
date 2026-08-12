"""Compile Lesson 23 Alternative through the lesson-creator classroom wrapper."""

from pathlib import Path
import importlib.util


ROOT = Path(__file__).resolve().parents[1]
WORKSPACE = ROOT.parents[5]
COMPILER = WORKSPACE / ".agents" / "skills" / "lesson-creator" / "scripts" / "compile_presentation.py"


def build_presentation() -> Path:
    spec = importlib.util.spec_from_file_location("lesson_creator_compiler", COMPILER)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    assets = ROOT / "assets"
    return module.compile_presentation(
        assets / "borrow_box_slides.html",
        ROOT / "Lesson_23_Borrow_Box_Counterarguments_Presentation.html",
        css_path=assets / "borrow_box_presentation.css",
        js_path=assets / "borrow_box_presentation.js",
        title="Lesson 23 Alternative | The Borrow Box",
        language="en-AU",
    )


if __name__ == "__main__":
    print(build_presentation())
