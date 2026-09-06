"""Build the printable student assessment and reproducible circuit assets."""
from pathlib import Path
import sys, json, copy

HERE = Path(__file__).resolve().parent
ROOT = next(p for p in HERE.parents if (p / '.agents/skills/electrical-diagram').exists())
sys.path.insert(0, str(ROOT / '.agents/skills/electrical-diagram/scripts'))
import render_circuit as rc

def circuit(letter, state='complete'):
    return dict(schema_version=1, title=f'Diagram {letter}', description=f'Circuit sketch {letter}. Trace the connections and inspect the symbols.', expected_state=state, intentional_omissions=[], open_terminals=[], nodes={'a':[0,0],'b':[0,4],'c':[4,4],'d':[8,4],'e':[8,0]}, components=[{'id':'source','type':'cell','from':'a','to':'b'}, {'id':'switch','type':'switch-closed','from':'b','to':'c'}, {'id':'lamp','type':'lamp','from':'d','to':'e'}], wires=[{'from':'c','to':'d'},{'from':'e','to':'a'}])

specs = [circuit('A'), circuit('B','open'), circuit('C','open'), circuit('D','intentionally-incomplete'), circuit('E','open')]
specs[1]['components'][1]['type']='switch-open'
c=specs[2]; c['nodes'].update(f=[5,0],g=[3,0]); c['wires']=[{'from':'c','to':'d'},{'from':'e','to':'f'},{'from':'g','to':'a'}]; c['open_terminals']=['f','g']
c=specs[3]; c['components']=c['components'][1:]; c['intentional_omissions']=['cell']; c['open_terminals']=['a','b']
c=specs[4]; c['components'][1]['type']='switch-open'; c['wires']=[{'from':'c','to':'d'}]; c['components'].append({'id':'lamp2','type':'lamp','from':'e','to':'a'})
f=dict(schema_version=1,title='Diagram F',description='Circuit sketch F. Each branch has a numbered switch and lamp.',expected_state='complete',intentional_omissions=[],open_terminals=[],nodes={'a':[0,0],'b':[0,8]},components=[{'id':'source','type':'cell','from':'a','to':'b'}],wires=[])
for i,x in enumerate([4,9,14],1):
    f['nodes'].update({f't{i}':[x,8],f'm{i}':[x,4],f'z{i}':[x,0]})
    f['components'] += [{'id':f's{i}','type':'switch-closed','from':f't{i}','to':f'm{i}','label':f'S{i}'},{'id':f'l{i}','type':'lamp','from':f'm{i}','to':f'z{i}','label':f'L{i}'}]
    f['wires'] += [{'from':'b' if i==1 else f't{i-1}','to':f't{i}'},{'from':'a' if i==1 else f'z{i-1}','to':f'z{i}'}]
specs.append(f)

def render(spec):
    rc.validate_spec(spec)
    # Add junction dots through the existing renderer's Drawing factory, without
    # changing the shared skill. Junction locations use the same drawing coordinates.
    original=rc.schemdraw.Drawing
    from collections import Counter
    degree=Counter(n for e in spec['wires']+spec['components'] for n in [e['from'],e['to']])
    class JunctionDrawing(original):
        def get_imagedata(self,*args,**kwargs):
            for n,d in degree.items():
                if d>=3: self.add(rc.elm.Dot().at(spec['nodes'][n]))
            return super().get_imagedata(*args,**kwargs)
    rc.schemdraw.Drawing=JunctionDrawing
    try: return rc.render_svg(spec)
    finally: rc.schemdraw.Drawing=original

assets=HERE/'diagrams'; assets.mkdir(exist_ok=True)
svgs={}
for spec in specs:
    letter=spec['title'][-1]; svg=render(spec); svgs[letter]=svg
    (assets/f'{letter}.json').write_text(json.dumps(spec,indent=2)+'\n',encoding='utf-8')
    (assets/f'{letter}.svg').write_text(svg,encoding='utf-8')

# Independent source-to-load reachability checks, not just a generic cycle test.
def powered(spec):
    def reachable(start,end,edges):
        seen={start}; pending=[start]
        while pending:
            n=pending.pop()
            for a,b in edges:
                other=b if a==n else a if b==n else None
                if other is not None and other not in seen: seen.add(other); pending.append(other)
        return end in seen
    sources=[c for c in spec['components'] if c['type']=='cell']
    if not sources:return set()
    source=sources[0]
    edges=[(w['from'],w['to']) for w in spec['wires']]
    edges += [(c['from'],c['to']) for c in spec['components'] if c['type']=='switch-closed']
    assert not reachable(source['from'],source['to'],edges), 'Source shorted by wires/switches'
    loads=[c for c in spec['components'] if c['type']=='lamp']
    result=set()
    for lamp in loads:
        rest=edges+[(c['from'],c['to']) for c in loads if c is not lamp]
        if any(reachable(source['from'],a,rest) and reachable(source['to'],b,rest) for a,b in [(lamp['from'],lamp['to']),(lamp['to'],lamp['from'])]):result.add(lamp['id'])
    return result
assert [powered(s) for s in specs]==[{'lamp'},set(),set(),set(),set(),{'l1','l2','l3'}]
for i in range(1,4):
    changed=copy.deepcopy(f)
    next(c for c in changed['components'] if c['id']==f's{i}')['type']='switch-open'
    assert powered(changed)=={f'l{j}' for j in range(1,4) if j!=i}

def lines(n=3):return '<div class="lines">'+'<div></div>'*n+'</div>'
def page(title,body):return f'<section class="page"><header>YEAR 6 SCIENCE · UNIT 3 ELECTRICITY</header><h1>{title}</h1>{body}</section>'
def figure(letter):return f'<figure><figcaption>Diagram {letter}</figcaption>{svgs[letter]}</figure>'
pages=[]
pages.append(page('Electricity: explain, test, repair', '''<p class="lead">Student assessment · Tinkercad edition</p><p>Name: __________________________ Class: __________ Date: __________</p><h2>Your challenge</h2><p>Show how a circuit works, use an Arduino to control an LED, and investigate a circuit that does not work as intended. Then explain how electricity is generated and why different places might choose different energy sources.</p><h2>What you will submit</h2><ol><li>Your reasoning about six circuit sketches.</li><li>Your labelled Arduino circuit, predictions and test results.</li><li>A fault investigation with before-and-after evidence.</li><li>Three energy-source explanations and a justified recommendation.</li></ol><h2>Working expectations</h2><p>Work individually. Your teacher supplies the starter code and explains the software controls. You are assessed on Science understanding, not typing speed or writing code from memory. Record what actually happens—even when it differs from your prediction.</p><p>Use Tinkercad Circuits only. Stop the simulation before changing a connection. Do not connect real hardware or mains electricity for this task.</p><h2>Useful evidence</h2><p>Use labelled sketches, screenshots, observations and explanations. Label terminals, pins and components, not just wire colours. A screenshot alone does not explain why a circuit works.</p><h2>Before starting</h2><p>Check that you can open a circuit, identify component terminals, edit a wire, use the supplied code and start/stop a simulation. Ask your teacher if access or these controls are unfamiliar.</p>'''))
pages.append(page('1 · Trace the path',figure('A')+figure('B')+'<p>Assume the cell and lamps work. For <strong>each</strong> diagram: predict whether the lamp lights; describe the path or break that supports your prediction; explain the role of the switch.</p><h3>A</h3>'+lines(3)+'<h3>B</h3>'+lines(3)))
pages.append(page('2 · Diagnose the problem',figure('C')+figure('D')+'<p>For each diagram: predict what happens; circle the fault or missing part; sketch one correction; explain why your change would allow the lamp to light. Assume the components shown work.</p><h3>C</h3>'+lines(3)+'<h3>D</h3>'+lines(3)))
pages.append(page('3 · Compare the branches',figure('E')+'<p><strong>E:</strong> Will either lamp light? Explain. What changes if you close the switch?</p>'+lines(2)+figure('F')+'<p><strong>F:</strong> All switches are shown closed. Predict which lamps light. Now imagine opening only S2: which lamps would light, and why? Trace a complete path for a lamp that remains on.</p>'+lines(3)))
pages.append(page('4 · Build and explain an Arduino output','''<p>Use the familiar external-LED build. Your teacher gives you <code>01_blink.ino</code> and a connection card: D8 → 330 Ω resistor → LED anode (+); LED cathode (−) → GND. The Arduino receives power through the simulated USB supply.</p><ol><li>Before simulating, predict what the LED will do.</li><li>Build the circuit and apply the supplied code. Run the simulation.</li><li>Record at least two complete on/off cycles. Compare with your prediction.</li><li>Attach a screenshot and label D8, GND, resistor, LED terminals and the power source. Trace the LED’s conducting path when D8 is HIGH.</li></ol><h3>Prediction and observations</h3>'''+lines(5)+'''<h3>Explain your evidence</h3><p>Why does the LED need a return connection to GND? What does the resistor do? How is the programmed off period different from removing a wire? Identify an energy transformation at the LED.</p>'''+lines(6)+'<p>Screenshot/file reference: ________________________________________</p>'))
pages.append(page('5 · Use an input to control an output','''<p>Add a push-button connected between D2 and GND using contacts that connect only when pressed. Keep the LED output circuit. Use <code>02_button_led.ino</code>. The code uses INPUT_PULLUP: released = HIGH; pressed = LOW. It turns the LED on while the button is pressed.</p><p>Before simulating, predict the result for each row. Then test and record what happens. Hold the button long enough to observe the output.</p><table><tr><th>Button state</th><th>My prediction</th><th>Actual observation</th></tr><tr><td>Released</td><td></td><td></td></tr><tr><td>Pressed</td><td></td><td></td></tr><tr><td>Released again</td><td></td><td></td></tr></table><h3>Explain how the input controls the output</h3><p>What changes electrically when the button is pressed? What does the program do in response? Does the button supply the energy that lights the LED? Explain.</p>'''+lines(6)+'''<p>Mark the input path and LED output path on your screenshot. Explain why the button is not simply a series switch in the LED wire.</p>'''+lines(3)+'<p>Screenshot/file reference: ________________________________________</p>'))
pages.append(page('6 · Investigate an unfamiliar fault','''<p>Your teacher supplies a copy of a familiar build with one wiring fault and unchanged, working code. Do not repair it immediately. Record a test plan first.</p><h3>Before changing anything</h3><p>Expected behaviour, actual symptom, and screenshot reference:</p>'''+lines(2)+'''<p>Suspected cause and a test that could distinguish it from another possible cause:</p>'''+lines(3)+'''<h3>Test one change at a time</h3><table><tr><th>Check/change and prediction</th><th>Observed result</th><th>What this tells me</th></tr><tr><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td></tr></table><h3>Use evidence to explain the repair</h3><p>Identify the fault, explain why it caused the symptom, and explain how your repair restores the required path or connection. Show the repaired circuit and repeat all relevant operating states.</p>'''+lines(4)+'<p>Before/after evidence references: __________________________________</p>'))
for location,context in [('Island','An island community needs electricity. Sea conditions, wildlife, transport and reliability matter.'),('Desert','A desert community needs electricity during the day and at night. Sunlight, water use, storage and reliability matter.'),('Coal-mining area','A town near a coal mine needs electricity. Local resources, jobs, health, emissions and reliability matter.')]:
    pages.append(page('7 · Choose an energy source: '+location,f'<p>{context}</p><p>Choose a different source for each of the three locations. You are not required to choose coal for the mining town. Use teacher-approved information; distinguish facts from assumptions.</p><p>Chosen source: __________________________________________________</p><h3>Show how electricity is generated</h3><p>Draw a labelled energy-transformation flow diagram. Then explain the process in words. Include the original energy source and how electrical energy is produced.</p><div class="sketch"></div>'+lines(3)+'<h3>Weigh up the choice</h3><p>Explain one advantage, one disadvantage and how this source could meet the location’s needs. Consider a limitation such as night-time supply, fuel availability or environmental effects.</p>'+lines(5)+'<p>Information source(s): ____________________________________________</p>'))
pages.append(page('8 · Make and defend a recommendation','''<p>Choose one of the three locations. Compare your preferred source with a plausible alternative. Explain why your choice is stronger for this location, using evidence and acknowledging a trade-off.</p>'''+lines(7)+'''<h3>How does science help people decide?</h3><p>Explain how knowledge of electricity generation, energy transformations and environmental effects can inform a community’s decision. Identify one further piece of information you would want before deciding.</p>'''+lines(6)+'''<h3>Submission check</h3><p>□ Circuit explanations &nbsp; □ Labelled Arduino evidence<br>□ Predictions and observations &nbsp; □ Fault test and repair<br>□ Three generation explanations &nbsp; □ Justified recommendation<br>□ Sources acknowledged</p>'''))
css='''*{box-sizing:border-box}body{margin:0;background:#e9eef2;color:#172033;font:15px/1.45 Arial,sans-serif}.page{width:210mm;min-height:277mm;margin:18px auto;background:white;padding:15mm 17mm;break-after:page}header{font-size:10px;letter-spacing:1.5px;color:#536273;border-bottom:2px solid #172033;padding-bottom:9px}h1{font-size:26px;line-height:1.2;margin:17px 0}h2{font-size:19px;margin-top:25px}h3{font-size:15px;margin:16px 0 5px}p{margin:10px 0}.lead{font-size:20px}li{margin:9px 0}figure{margin:10px 0;text-align:center;display:inline-block;width:49%;vertical-align:top}figure svg{width:100%;height:170px}figcaption{font-weight:bold;text-align:left}.lines div{height:27px;border-bottom:1px solid #bdc6ce}.sketch{height:155px;border:1px solid #bdc6ce;margin:12px 0}table{border-collapse:collapse;width:100%;margin:16px 0}th,td{border:1px solid #aab6c1;padding:9px;text-align:left;width:33%}td{height:65px}th{background:#eff3f6}.page:nth-child(4) figure{display:block;width:100%}.page:nth-child(4) figure svg{height:155px}nav{text-align:center;padding:15px}button{padding:10px 20px;font:inherit}@page{size:A4;margin:10mm 0}@media print{body{background:white}.page{margin:0;min-height:0;height:277mm;overflow:visible}nav{display:none}}'''
css += '.page:nth-child(4) figure:nth-of-type(2) svg{height:240px}'
(HERE/'Student_Assessment.html').write_text('<!doctype html><html lang="en-AU"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="icon" href="data:,"><title>Electricity assessment — Tinkercad</title><style>'+css+'</style><nav><button onclick="window.print()">Print assessment / save as PDF</button> · Answer on paper or in an accompanying document</nav><main>'+''.join(pages)+'</main></html>',encoding='utf-8')
print(f'PASS: six SVGs; source/load checks; three independent-switch checks; {len(pages)} student pages built.')
