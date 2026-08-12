"""Compile the Lesson 28 alternative through the standard lesson wrapper."""
from pathlib import Path
import importlib.util
ROOT=Path(__file__).resolve().parents[1]
WORKSPACE=ROOT.parents[5]
COMPILER=WORKSPACE/'.agents'/'skills'/'lesson-creator'/'scripts'/'compile_presentation.py'
def build():
    spec=importlib.util.spec_from_file_location('compiler',COMPILER); module=importlib.util.module_from_spec(spec); spec.loader.exec_module(module)
    assets=ROOT/'assets'
    return module.compile_presentation(assets/'crossing_cabinet_slides.html',ROOT/'Lesson_28_Crossing_Cabinet_Persuasive_Planning_Presentation.html',css_path=assets/'crossing_cabinet_presentation.css',js_path=assets/'crossing_cabinet_presentation.js',title='Lesson 28 Alternative | The Crossing Cabinet',language='en-AU')
if __name__=='__main__': print(build())
