from pathlib import Path
import importlib.util
ROOT=Path(__file__).resolve().parents[1]; WORKSPACE=ROOT.parents[5]
spec=importlib.util.spec_from_file_location('compiler',WORKSPACE/'.agents'/'skills'/'lesson-creator'/'scripts'/'compile_presentation.py');m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
if __name__=='__main__': print(m.compile_presentation(ROOT/'assets'/'harbour_garden_slides.html',ROOT/'Lesson_29_Harbour_Garden_Hopeful_Conclusion_Presentation.html',css_path=ROOT/'assets'/'harbour_garden_presentation.css',js_path=ROOT/'assets'/'harbour_garden_presentation.js',title='Lesson 29 Alternative | The Harbour Garden',language='en-AU'))
