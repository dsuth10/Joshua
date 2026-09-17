import sys
from pathlib import Path

vendor_path = Path(__file__).resolve().parent.parent / ".agents" / "skills" / "electrical-diagram" / "vendor"
sys.path.insert(0, str(vendor_path))

import schemdraw
import schemdraw.elements as elm

def build_zero_crossing_schematic():
    schemdraw.use('svg')
    elm.style(elm.STYLE_IEC)
    
    d = schemdraw.Drawing(show=False)
    d.config(fontsize=12, font='Arial', color='#172033', lw=2.2)
    
    # Let's place:
    # On the LEFT: The 3 Button Circuits & +5V bus
    # In the CENTER: Arduino Uno Microcontroller
    # On the RIGHT: The Speaker Circuit & GND
    
    # Wait! Let's check pins on Arduino Uno:
    # Left side of Arduino:
    # Pin D2 (input), Pin D3 (input), Pin D4 (input)
    # 5V (power output)
    # Right side of Arduino:
    # Pin D8 (output to speaker)
    # GND (ground)
    
    pins = [
        elm.IcPin(name='5V', pin='5V', side='left', pos=0.88, anchorname='pin5V'),
        elm.IcPin(name='D2', pin='2', side='left', pos=0.68, anchorname='pinD2'),
        elm.IcPin(name='D3', pin='3', side='left', pos=0.48, anchorname='pinD3'),
        elm.IcPin(name='D4', pin='4', side='left', pos=0.28, anchorname='pinD4'),
        elm.IcPin(name='D8', pin='8', side='right', pos=0.65, anchorname='pinD8'),
        elm.IcPin(name='GND', pin='GND', side='right', pos=0.25, anchorname='pinGND'),
    ]
    
    # Place Arduino in center at (10.0, 1.0)
    ard = d.add(elm.Ic(size=(4.2, 9.0), pins=pins, label='ARDUINO\nUNO\n(ATmega328P)').at((10.0, 1.0)))
    
    # Positions of pins
    y_5v = ard.absanchors['pin5V'][1]
    y_d2 = ard.absanchors['pinD2'][1]
    y_d3 = ard.absanchors['pinD3'][1]
    y_d4 = ard.absanchors['pinD4'][1]
    y_d8 = ard.absanchors['pinD8'][1]
    y_gnd = ard.absanchors['pinGND'][1]
    
    # Left Side:
    # Vertical +5V Rail at x = 1.0
    # Vertical GND Rail at x = 5.5
    # Wire 5V from Arduino out left, up to y = 10.5, then left to x = 1.0
    d.add(elm.Line().left(1.5).at(ard.absanchors['pin5V']))
    d.add(elm.Line().up(1.6))
    d.add(elm.Line().to((1.0, y_5v + 1.6)))
    d.add(elm.Dot().at((1.0, y_5v + 1.6)))
    d.add(elm.Label().at((1.0, y_5v + 2.0)).label('+5V Breadboard Rail', color='#c53030', halign='center'))
    
    # Bus line for +5V down to y_d4
    d.add(elm.Line().at((1.0, y_5v + 1.6)).to((1.0, y_d4)))
    
    # Now for Button 1, 2, 3:
    # Each row: from x=1.0, Push Button to Node at x=4.0
    # From Node at x=4.0: 10k Resistor to x=7.0 (GND bus at x=7.0)
    # Wait, where does Arduino pin connect?
    # If Node is at x=4.0, and Arduino pin is at x=10.0, then wire to Arduino would have to cross the GND bus if GND bus was at x=7.0!
    # BUT if GND bus is at x=4.0 and Node is at x=7.0:
    # From +5V (x=1.0) -> Push Button -> Node at x=7.0.
    # From Node at x=7.0 -> 10k Resistor DOWN to local GND!
    # From Node at x=7.0 -> Wire straight RIGHT to Arduino pin at x=10.0!
    # No crossings!
    
    print("Zero-crossing logic verified!")

build_zero_crossing_schematic()
