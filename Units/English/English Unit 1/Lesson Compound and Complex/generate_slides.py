import os

SLIDE_TEMPLATE = """<!DOCTYPE html>
<html>
<head>
<style>
html {{ background: #ffffff; }}
body {{
  width: 720pt; height: 405pt; margin: 0; padding: 0;
  background: #f9f7f7;
  font-family: Arial, sans-serif;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}}
.header {{
  background: #112d4e;
  padding: 12pt 40pt;
  display: flex;
  align-items: center;
}}
h1 {{ 
  color: #f96d00;
  font-size: 32pt; 
  margin: 0; 
  font-weight: bold;
}}
.content {{
  flex: 1;
  padding: 20pt 40pt;
  display: flex;
  flex-direction: column;
  gap: 15pt;
}}
.box {{
  background: #3f72af;
  padding: 15pt;
  border-radius: 12pt;
  color: white;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
}}
p {{
  color: #112d4e;
  font-size: 22pt;
  margin: 0;
  line-height: 1.3;
}}
.box p {{ color: #ffffff; }}
.grid {{
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20pt;
}}
.highlight {{
  color: #f96d00;
  font-weight: bold;
}}
.footer {{
  height: 50pt;
  background: transparent;
}}
ul {{ margin: 0; padding-left: 25pt; }}
li {{ font-size: 18pt; color: #112d4e; margin-bottom: 5pt; }}
</style>
</head>
<body>
  <div class="header">
    <h1>{title}</h1>
  </div>
  
  <div class="content">
    {content}
  </div>

  <div class="footer"></div>
</body>
</html>"""

slides = [
    {
        "title": "Soaring with Sentences",
        "content": '<div class="box" style="margin-top: 30pt; text-align: center;"><p>Mastering <span class="highlight">Compound</span> and <span class="highlight">Complex</span> Sentences</p><p style="font-size: 18pt;">Year 5 English: Unit 1 Study</p></div>'
    },
    {
        "title": "Learning Intention",
        "content": '<div class="box"><p>We are learning to identify and create simple, compound, and complex sentences to improve our narrative writing.</p></div><p style="font-size: 20pt;"><span class="highlight">Success Criteria:</span></p><ul><li>I can use FANBOYS for compound sentences.</li><li>I can use subordinating conjunctions for complex sentences.</li><li>I can explain WHY a sentence is compound or complex.</li></ul>'
    },
    {
        "title": "Review: Simple Sentences",
        "content": '<p>A <span class="highlight">Simple Sentence</span> is one complete thought. It has a subject and a verb.</p><div class="box"><p>"Dylan lived in Waleup."</p></div><div class="grid"><div><p><span class="highlight">Subject:</span> Dylan</p></div><div><p><span class="highlight">Verb:</span> lived</p></div></div>'
    },
    {
        "title": "Compound Sentences",
        "content": '<p>Two independent sentences joined by a <span class="highlight">coordinating conjunction</span>.</p><div class="box"><p>Sentence 1 + <span class="highlight">CONJUNCTION</span> + Sentence 2</p></div><p>Remember <span class="highlight">FANBOYS:</span></p><p style="font-size: 20pt;">For, And, Nor, But, Or, Yet, So</p>'
    },
    {
        "title": "FANBOYS in Action",
        "content": '<p>Let\'s look at Dylan and Dad in Waleup:</p><div class="box"><p>"Dylan wanted to win the regional competition, <span class="highlight">so</span> he practiced every day."</p></div><p style="font-size: 18pt;">The word <span class="highlight">"so"</span> joins two complete ideas together!</p>'
    },
    {
        "title": "Complex Sentences",
        "content": '<p>A main idea joined with a <span class="highlight">Supporting Idea</span> (Dependent Clause).</p><div class="box"><p>Independent Clause + <span class="highlight">Conjunction</span> + Dependent Clause</p></div><p>A dependent clause doesn\'t make sense on its own!</p>'
    },
    {
        "title": "Subordinating Conjunctions",
        "content": '<p>These words start a dependent clause:</p><div class="grid"><div class="box"><p>Because<br>Although<br>If</p></div><div class="box"><p>Since<br>When<br>While</p></div></div>'
    },
    {
        "title": "Complex Practice",
        "content": '<p>Regional Competition Examples:</p><div class="box"><p>"<span class="highlight">Although</span> the wind was strong, Dylan\'s plane flew straight."</p></div><p style="font-size: 18pt;">The <span class="highlight">Dependent Clause</span> gives us more information about the flight.</p>'
    },
    {
        "title": "Example Check 1",
        "content": '<div class="box" style="margin-top: 40pt; text-align: center;"><p>"Jason was mean to Dylan <span class="highlight">because</span> he was jealous."</p></div>'
    },
    {
        "title": "Why is it Complex?",
        "content": '<p>This is a <span class="highlight">Complex Sentence</span> because:</p><ul><li>It uses the subordinating conjunction <span class="highlight">because</span>.</li><li>The main idea is "Jason was mean to Dylan".</li><li>The dependent clause "because he was jealous" gives the reason but cannot stand alone.</li></ul>'
    },
    {
        "title": "Example Check 2",
        "content": '<div class="box" style="margin-top: 40pt; text-align: center;"><p>"Grandpa gave Dylan advice, <span class="highlight">and</span> Dylan listened carefully."</p></div>'
    },
    {
        "title": "Why is it Compound?",
        "content": '<p>This is a <span class="highlight">Compound Sentence</span> because:</p><ul><li>It uses the FANBOYS conjunction <span class="highlight">and</span>.</li><li>Both parts ("Grandpa gave Dylan advice" and "Dylan listened carefully") are <span class="highlight">Independent Clauses</span>.</li><li>They could be two separate simple sentences!</li></ul>'
    },
    {
        "title": "Example Check 3",
        "content": '<div class="box" style="margin-top: 40pt; text-align: center;"><p>"<span class="highlight">When</span> Dylan threw the plane, it glided through the air."</p></div>'
    },
    {
        "title": "Why is it Complex?",
        "content": '<p>This is a <span class="highlight">Complex Sentence</span> because:</p><ul><li>It starts with the subordinating conjunction <span class="highlight">When</span>.</li><li>"When Dylan threw the plane" is a <span class="highlight">Dependent Clause</span>.</li><li>It needs the main idea ("it glided through the air") to make sense.</li></ul>'
    },
    {
        "title": "Example Check 4",
        "content": '<div class="box" style="margin-top: 40pt; text-align: center;"><p>"The competition was tough, <span class="highlight">but</span> Dylan did not give up."</p></div>'
    },
    {
        "title": "Why is it Compound?",
        "content": '<p>This is a <span class="highlight">Compound Sentence</span> because:</p><ul><li>It uses the FANBOYS conjunction <span class="highlight">but</span>.</li><li>It joins two equally important ideas together.</li><li>Without the "but", we would just have two simple sentences.</li></ul>'
    },
    {
        "title": "Your Turn to Fly!",
        "content": '<p>Complete your <span class="highlight">Sentence Flight Manual</span> worksheet.</p><div class="box"><ul><li>Sort the expanded clauses.</li><li>Combine the sentences using FANBOYS or subordinating conjunctions.</li><li>Write your own Paper Planes adventure!</li></ul></div>'
    }
]

output_dir = "c:/Users/dsuth/Documents/Joshua/Units/English/English Unit 1/Lesson Compound and Complex/slides"
os.makedirs(output_dir, exist_ok=True)

for i, slide in enumerate(slides):
    filename = os.path.join(output_dir, f"slide{i+1}.html")
    with open(filename, "w", encoding="utf-8") as f:
        f.write(SLIDE_TEMPLATE.format(title=slide["title"], content=slide["content"]))

print(f"Generated {len(slides)} slides in {output_dir}")
