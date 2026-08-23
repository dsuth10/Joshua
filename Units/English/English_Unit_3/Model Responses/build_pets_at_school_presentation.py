#!/usr/bin/env python3
from pathlib import Path
import importlib.util

ROOT = Path(__file__).resolve().parent
WORKSPACE_ROOT = ROOT.parents[3]
SKILL_ROOT = WORKSPACE_ROOT / ".agents" / "skills" / "lesson-creator"
COMPILER = SKILL_ROOT / "scripts" / "compile_presentation.py"

spec = importlib.util.spec_from_file_location("lesson_presentation_compiler", COMPILER)
module = importlib.util.module_from_spec(spec)
assert spec.loader is not None
spec.loader.exec_module(module)

output = module.compile_presentation(
    ROOT / "pets_at_school_exemplar_slides.html",
    ROOT / "Exemplar_Presentation_Pets_At_School.html",
    css_path=ROOT / "pets_at_school_exemplar.css",
    js_path=ROOT / "pets_at_school_exemplar.js",
    title="Paws at School — Assessment Exemplar Lesson",
    language="en-AU",
)
print(output)
