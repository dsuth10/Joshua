import sys
from pathlib import Path

vendor_path = Path(__file__).resolve().parent.parent / ".agents" / "skills" / "electrical-diagram" / "vendor"
sys.path.insert(0, str(vendor_path))

import schemdraw
import schemdraw.elements as elm

def generate_schematic():
    schemdraw.use('svg')
    elm.style(elm.STYLE_IEC)
    
    d = schemdraw.Drawing(show=False)
    d.config(fontsize=11, font='Arial', color='#172033', lw=2.2)
    
    # Arduino IC Block
    pins = [
        elm.IcPin(name='5V', pin='5V', side='left', pos=0.90, anchorname='pin5V'),
        elm.IcPin(name='D2', pin='2', side='left', pos=0.70, anchorname='pinD2'),
        elm.IcPin(name='D3', pin='3', side='left', pos=0.45, anchorname='pinD3'),
        elm.IcPin(name='D4', pin='4', side='left', pos=0.20, anchorname='pinD4'),
        elm.IcPin(name='D8', pin='8', side='right', pos=0.70, anchorname='pinD8'),
        elm.IcPin(name='GND', pin='GND', side='right', pos=0.20, anchorname='pinGND'),
    ]
    
    ard = d.add(elm.Ic(size=(4.8, 14.0), pins=pins, label='ARDUINO\nUNO\n(ATmega328P)').at((10.0, 1.0)))
    
    y_5v = ard.absanchors['pin5V'][1]
    y_d2 = ard.absanchors['pinD2'][1]
    y_d3 = ard.absanchors['pinD3'][1]
    y_d4 = ard.absanchors['pinD4'][1]
    y_d8 = ard.absanchors['pinD8'][1]
    y_gnd = ard.absanchors['pinGND'][1]
    
    # --- +5V POWER RAIL ROUTING ---
    d.add(elm.Line().left(2.0).at(ard.absanchors['pin5V']))
    d.add(elm.Line().up(1.5))
    d.add(elm.Line().to((1.0, y_5v + 1.5)))
    d.add(elm.Dot().at((1.0, y_5v + 1.5)))
    d.add(elm.Label().at((1.0, y_5v + 2.1)).label('+5V Breadboard Rail (Power Bus)', color='#c53030', halign='center'))
    
    # +5V bus runs vertically down to y_d4
    d.add(elm.Line().at((1.0, y_5v + 1.5)).to((1.0, y_d4)))
    
    # --- BUTTON 1 (Pin D2) ---
    d.add(elm.Dot().at((1.0, y_d2)))
    d.add(elm.Line().right(1.2).at((1.0, y_d2)))
    sw1 = d.add(elm.Button().right(2.2).label('SW1\n(Btn 1: C4 262Hz)', loc='top'))
    node1 = (5.8, y_d2)
    d.add(elm.Line().at(sw1.end).to(node1))
    d.add(elm.Dot().at(node1))
    # Line to Arduino D2
    d.add(elm.Line().at(node1).to(ard.absanchors['pinD2']))
    # Pull-down Resistor R1
    d.add(elm.Resistor(label='R1: 10kΩ\n(Pull-down)').down(1.8).at(node1))
    d.add(elm.Ground().label('GND', loc='right'))
    
    # --- BUTTON 2 (Pin D3) ---
    d.add(elm.Dot().at((1.0, y_d3)))
    d.add(elm.Line().right(1.2).at((1.0, y_d3)))
    sw2 = d.add(elm.Button().right(2.2).label('SW2\n(Btn 2: E4 330Hz)', loc='top'))
    node2 = (5.8, y_d3)
    d.add(elm.Line().at(sw2.end).to(node2))
    d.add(elm.Dot().at(node2))
    # Line to Arduino D3
    d.add(elm.Line().at(node2).to(ard.absanchors['pinD3']))
    # Pull-down Resistor R2
    d.add(elm.Resistor(label='R2: 10kΩ\n(Pull-down)').down(1.8).at(node2))
    d.add(elm.Ground().label('GND', loc='right'))
    
    # --- BUTTON 3 (Pin D4) ---
    d.add(elm.Dot().at((1.0, y_d4)))
    d.add(elm.Line().right(1.2).at((1.0, y_d4)))
    sw3 = d.add(elm.Button().right(2.2).label('SW3\n(Btn 3: G4 392Hz)', loc='top'))
    node3 = (5.8, y_d4)
    d.add(elm.Line().at(sw3.end).to(node3))
    d.add(elm.Dot().at(node3))
    # Line to Arduino D4
    d.add(elm.Line().at(node3).to(ard.absanchors['pinD4']))
    # Pull-down Resistor R3
    d.add(elm.Resistor(label='R3: 10kΩ\n(Pull-down)').down(1.8).at(node3))
    d.add(elm.Ground().label('GND', loc='right'))
    
    # --- SPEAKER OUTPUT (Pin D8) ---
    d.add(elm.Line().right(1.2).at(ard.absanchors['pinD8']))
    r4 = d.add(elm.Resistor(label='R4: 100Ω\n(Current Limiter)').right(2.2))
    d.add(elm.Line().right(0.6))
    spk = d.add(elm.Speaker().label('8Ω Speaker\n(Audio Output)', loc='right'))
    d.add(elm.Line().down(1.2).at(spk.in2))
    d.add(elm.Ground().label('GND', loc='right'))
    
    # --- ARDUINO GND PIN ---
    d.add(elm.Line().right(2.0).at(ard.absanchors['pinGND']))
    d.add(elm.Ground().label('GND (Common Rail)', loc='right'))
    
    svg = d.get_imagedata('svg').decode('utf-8')
    # Clean invalid stroke-dasharray produced by schemdraw backend for solid lines
    svg = svg.replace('stroke-dasharray:-;', '')
    return svg


if __name__ == '__main__':
    svg_content = generate_schematic()
    out_file = Path(__file__).resolve().parent / "arduino_piano_schematic.svg"
    out_file.write_text(svg_content, encoding='utf-8')
    print("Schematic saved successfully to:", out_file)
