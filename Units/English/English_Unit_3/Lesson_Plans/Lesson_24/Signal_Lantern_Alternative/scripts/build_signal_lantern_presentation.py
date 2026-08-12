from pathlib import Path
import importlib.util

ROOT=Path(__file__).resolve().parents[1]
WORKSPACE=ROOT.parents[5]
SKILL=WORKSPACE/'.agents'/'skills'/'lesson-creator'
spec=importlib.util.spec_from_file_location('compiler',SKILL/'scripts'/'compile_presentation.py')
compiler=importlib.util.module_from_spec(spec);spec.loader.exec_module(compiler)
compiler.compile_presentation(ROOT/'assets'/'signal_lantern_slides.html',ROOT/'Lesson_24_Signal_Lantern_Synthesis_Presentation.html',css_path=ROOT/'assets'/'signal_lantern_presentation.css',js_path=ROOT/'assets'/'signal_lantern_presentation.js',title='Lesson 24 Alternative - The Signal Lantern',language='en-AU',template_path=SKILL/'assets'/'presentation_template.html')
print('Built presentation')
