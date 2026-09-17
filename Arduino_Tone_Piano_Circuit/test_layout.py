import sys
from pathlib import Path

vendor_path = Path(__file__).resolve().parent.parent / ".agents" / "skills" / "electrical-diagram" / "vendor"
sys.path.insert(0, str(vendor_path))

import schemdraw
import schemdraw.elements as elm

def test_row_layout():
    schemdraw.use('svg')
    elm.style(elm.STYLE_IEC)
    
    d = schemdraw.Drawing(show=False)
    d.config(fontsize=12, font='Arial', color='#172033', lw=2.2)
    
    # Arduino IC Block
    # Height = 10 units, Width = 4 units
    # Left: 5V (top), GND (bottom)
    # Right: D2 (y=8.5), D3 (y=6.5), D4 (y=4.5), D8 (y=2.5)
    pins = [
        elm.IcPin(name='5V', pin='5V', side='left', pos=0.85, anchorname='pin5V'),
        elm.IcPin(name='GND', pin='GND', side='left', pos=0.15, anchorname='pinGND'),
        elm.IcPin(name='D2', pin='2', side='right', pos=0.85, anchorname='pinD2'),
        elm.IcPin(name='D3', pin='3', side='right', pos=0.65, anchorname='pinD3'),
        elm.IcPin(name='D4', pin='4', side='right', pos=0.45, anchorname='pinD4'),
        elm.IcPin(name='D8', pin='8', side='right', pos=0.25, anchorname='pinD8'),
    ]
    
    ard = d.add(elm.Ic(size=(4.0, 9.0), pins=pins, label='ARDUINO\nUNO\n(Board)').at((1.0, 1.5)))
    
    # Power rails
    # +5V Bus: Vertical rail at x = 9.5
    # GND Bus: Vertical rail at x = 16.5
    
    # Connect 5V from Arduino up and over to x = 9.5
    y_5v = ard.absanchors['pin5V'][1]
    d.add(elm.Line().left(0.8).at(ard.absanchors['pin5V']))
    d.add(elm.Line().up(2.5))
    d.add(elm.Line().to((9.5, y_5v + 2.5)))
    d.add(elm.Line().to((9.5, 12.0)))
    d.add(elm.Dot().at((9.5, 12.0)))
    d.add(elm.Label().at((9.5, 12.4)).label('+5V (Power Rail)', color='#c53030', halign='center'))
    # Bus line down from 12.0 to 4.5
    d.add(elm.Line().at((9.5, 12.0)).to((9.5, 4.5)))
    
    # Connect GND from Arduino down and over to x = 16.5
    y_gnd = ard.absanchors['pinGND'][1]
    d.add(elm.Line().left(0.8).at(ard.absanchors['pinGND']))
    d.add(elm.Line().down(2.0))
    d.add(elm.Line().to((16.5, y_gnd - 2.0)))
    d.add(elm.Line().to((16.5, 0.5)))
    d.add(elm.Ground().at((16.5, 0.5)).label('GND (Common Rail)', loc='right'))
    # Bus line up from 0.5 to 10.0
    d.add(elm.Line().at((16.5, 0.5)).to((16.5, 10.0)))
    
    # Now the 3 Buttons on rows D2, D3, D4!
    # Row D2 (y = 9.15 approx)
    y2 = ard.absanchors['pinD2'][1]
    # Button 1 between +5V (x=9.5) and Node 1 (x=12.5)
    # Wait: if Button is between +5V and Node 1, Button is horizontal!
    # SW1: from x=9.5 to x=12.5 at y=y2
    d.add(elm.Dot().at((9.5, y2)))
    sw1 = d.add(elm.Button().right().at((9.5, y2)).to((12.5, y2)).label('SW1 (C4: 262Hz)', loc='top'))
    d.add(elm.Dot().at((12.5, y2)))
    # From Node 1: line left to Arduino D2? But wait! If SW1 is from 9.5 to 12.5, where is Arduino? Arduino is at x=1.0 to 5.0!
    # Ah! If Arduino D2 is on the left (x=5.0), then Node 1 should be between Arduino and +5V, or...
    pass

test_row_layout()
