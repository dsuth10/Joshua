"""Compile Lesson 26 Alternative through the lesson-creator wrapper."""
from pathlib import Path
import importlib.util

ROOT=Path(__file__).resolve().parents[1]
WORKSPACE=ROOT.parents[5]
COMPILER=WORKSPACE/'.agents'/'skills'/'lesson-creator'/'scripts'/'compile_presentation.py'

def build():
    spec=importlib.util.spec_from_file_location('lesson_creator_compiler',COMPILER)
    module=importlib.util.module_from_spec(spec);spec.loader.exec_module(module)
    assets=ROOT/'assets'
    return module.compile_presentation(assets/'shade_shed_slides.html',ROOT/'Lesson_26_Shade_Shed_Assessment_Launch_Presentation.html',css_path=assets/'shade_shed_presentation.css',js_path=assets/'shade_shed_presentation.js',title='Lesson 26 Alternative | The Shade Shed',language='en-AU')
if __name__=='__main__': print(build())
