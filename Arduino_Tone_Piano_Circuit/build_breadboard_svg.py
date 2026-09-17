from pathlib import Path

def generate_breadboard_svg():
    width = 1100
    height = 760
    
    svg = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}" width="100%" height="100%" style="background:#ffffff; font-family:'Segoe UI', Inter, Arial, sans-serif;">
  <defs>
    <!-- Drop shadows -->
    <filter id="shadow" x="-5%" y="-5%" width="115%" height="115%">
      <feDropShadow dx="3" dy="4" stdDeviation="4" flood-color="#000000" flood-opacity="0.18" />
    </filter>
    <filter id="wire-shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="2" dy="3" stdDeviation="2" flood-color="#000000" flood-opacity="0.25" />
    </filter>
    <linearGradient id="arduino-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00878F" />
      <stop offset="100%" stop-color="#005C63" />
    </linearGradient>
    <linearGradient id="metal-silver" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#bcc2c7" />
      <stop offset="50%" stop-color="#ffffff" />
      <stop offset="100%" stop-color="#9aa0a6" />
    </linearGradient>
    <linearGradient id="resistor-body" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#e8cfb0" />
      <stop offset="50%" stop-color="#f5e6d3" />
      <stop offset="100%" stop-color="#d4b48c" />
    </linearGradient>
    <linearGradient id="speaker-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#333a42" />
      <stop offset="100%" stop-color="#1a1e22" />
    </linearGradient>
  </defs>

  <!-- Title & Header Banner -->
  <rect x="0" y="0" width="{width}" height="68" fill="#172033" />
  <text x="30" y="42" fill="#ffffff" font-size="22" font-weight="bold" letter-spacing="0.5">Arduino Tone Piano — Physical Breadboard Wiring Diagram</text>
  <text x="{width - 30}" y="42" fill="#a0aec0" font-size="14" text-anchor="end">3 Buttons (Active-HIGH with 10kΩ Pull-down) + 8Ω Speaker (100Ω Limiter)</text>

  <!-- ==================== ARDUINO UNO BOARD ==================== -->
  <g id="arduino-board" transform="translate(40, 110)" filter="url(#shadow)">
    <!-- Board PCB Outline with notch -->
    <path d="M 0 20 Q 0 0 20 0 L 320 0 Q 340 0 340 20 L 340 460 Q 340 480 320 480 L 20 480 Q 0 480 0 460 Z" fill="url(#arduino-grad)" stroke="#00474c" stroke-width="2" />
    <!-- Mounting holes -->
    <circle cx="20" cy="80" r="7" fill="#f8fafc" stroke="#c4b585" stroke-width="3" />
    <circle cx="20" cy="420" r="7" fill="#f8fafc" stroke="#c4b585" stroke-width="3" />
    <circle cx="320" cy="180" r="7" fill="#f8fafc" stroke="#c4b585" stroke-width="3" />
    <circle cx="320" cy="420" r="7" fill="#f8fafc" stroke="#c4b585" stroke-width="3" />

    <!-- USB Port -->
    <rect x="-16" y="24" width="70" height="52" rx="4" fill="url(#metal-silver)" stroke="#64748b" stroke-width="1.5" />
    <rect x="-10" y="36" width="22" height="28" fill="#1e293b" />

    <!-- DC Barrel Jack -->
    <rect x="-16" y="370" width="80" height="60" rx="3" fill="#1e293b" stroke="#0f172a" stroke-width="1.5" />
    <circle cx="16" cy="400" r="10" fill="#475569" />

    <!-- ATmega328P DIP IC -->
    <rect x="140" y="250" width="50" height="150" rx="4" fill="#1e293b" stroke="#0f172a" stroke-width="1.5" />
    <text x="165" y="325" fill="#94a3b8" font-size="9" font-weight="bold" text-anchor="middle" transform="rotate(-90, 165, 325)">ATmega328P-PU</text>
    <circle cx="165" cy="256" r="3" fill="#475569" />

    <!-- Reset Button -->
    <rect x="270" y="26" width="30" height="30" rx="3" fill="#cbd5e1" stroke="#94a3b8" />
    <circle cx="285" cy="41" r="9" fill="#dc2626" />
    <text x="285" y="68" fill="#ffffff" font-size="8" font-weight="bold" text-anchor="middle">RESET</text>

    <!-- Arduino Logo & Text -->
    <text x="170" y="115" fill="#ffffff" font-size="18" font-weight="800" text-anchor="middle" letter-spacing="1.5">ARDUINO</text>
    <text x="170" y="135" fill="#99f6e4" font-size="14" font-weight="600" text-anchor="middle">UNO R3</text>
    
    <!-- Female Header: POWER (Left side on real board, right edge in diagram for easy wiring) -->
    <!-- We'll put Digital Header on top edge (facing breadboard) or right edge! -->
    <!-- Let's put Right Edge = Digital Pins (D0 to D13, GND, AREF) -->
    <g id="digital-header" transform="translate(290, 70)">
      <rect x="0" y="0" width="28" height="270" rx="3" fill="#0f172a" stroke="#334155" stroke-width="1.5" />
      <!-- 16 pin sockets: SCL, SDA, AREF, GND, D13 down to D0 -->
      <!-- Let's label the key pins: GND (idx 3), D8 (idx 8), D4 (idx 12), D3 (idx 13), D2 (idx 14) -->
"""

    # Add digital pins sockets
    digital_pins = [
        ("SCL", 14), ("SDA", 30), ("AREF", 46), ("GND", 62),
        ("D13", 78), ("D12", 94), ("D11", 110), ("D10", 126),
        ("D9", 142), ("D8", 158), ("D7", 174), ("D6", 190),
        ("D5", 206), ("D4", 222), ("D3", 238), ("D2", 254)
    ]
    for name, y in digital_pins:
        svg += f"""
      <rect x="8" y="{y - 5}" width="12" height="10" fill="#1e293b" rx="1" />
      <circle cx="14" cy="{y}" r="3" fill="#fbbf24" stroke="#78350f" stroke-width="0.8" id="pin-{name}" />
      <text x="4" y="{y + 3}" fill="#e2e8f0" font-size="8" font-weight="bold" text-anchor="end">{name}</text>"""

    # Add Power Header (Bottom right)
    svg += """
    </g>
    <g id="power-header" transform="translate(80, 440)">
      <rect x="0" y="0" width="160" height="28" rx="3" fill="#0f172a" stroke="#334155" stroke-width="1.5" />
      <!-- Power pins: IOREF, RESET, 3.3V, 5V, GND, GND, VIN -->
      <circle cx="64" cy="14" r="3" fill="#fbbf24" stroke="#78350f" stroke-width="0.8" id="pin-5V" />
      <text x="64" y="-4" fill="#ef4444" font-size="9" font-weight="bold" text-anchor="middle">5V</text>
      
      <circle cx="86" cy="14" r="3" fill="#fbbf24" stroke="#78350f" stroke-width="0.8" id="pin-GND1" />
      <text x="86" y="-4" fill="#3b82f6" font-size="9" font-weight="bold" text-anchor="middle">GND</text>

      <circle cx="108" cy="14" r="3" fill="#fbbf24" stroke="#78350f" stroke-width="0.8" id="pin-GND2" />
      <text x="108" y="-4" fill="#3b82f6" font-size="9" font-weight="bold" text-anchor="middle">GND</text>
      
      <circle cx="20" cy="14" r="2.5" fill="#64748b" />
      <circle cx="42" cy="14" r="2.5" fill="#64748b" />
      <circle cx="130" cy="14" r="2.5" fill="#64748b" />
      <text x="20" y="-4" fill="#94a3b8" font-size="7" text-anchor="middle">RESET</text>
      <text x="42" y="-4" fill="#94a3b8" font-size="7" text-anchor="middle">3.3V</text>
      <text x="130" y="-4" fill="#94a3b8" font-size="7" text-anchor="middle">VIN</text>
      <text x="80" y="38" fill="#e2e8f0" font-size="9" font-weight="bold" text-anchor="middle">POWER HEADER</text>
    </g>
  </g>
"""

    # ==================== BREADBOARD ====================
    # Position breadboard at x = 450, y = 110
    bb_x = 450
    bb_y = 110
    bb_w = 610
    bb_h = 480

    svg += f"""
  <!-- ==================== BREADBOARD ==================== -->
  <g id="breadboard" transform="translate({bb_x}, {bb_y})" filter="url(#shadow)">
    <!-- Breadboard Body -->
    <rect x="0" y="0" width="{bb_w}" height="{bb_h}" rx="14" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2" />
    
    <!-- Top Power Rail (+) Red and (-) Blue -->
    <rect x="25" y="20" width="{bb_w - 50}" height="42" rx="4" fill="#f1f5f9" stroke="#e2e8f0" />
    <line x1="45" y1="30" x2="{bb_w - 45}" y2="30" stroke="#ef4444" stroke-width="2.5" />
    <text x="35" y="34" fill="#ef4444" font-size="14" font-weight="bold">+</text>
    <line x1="45" y1="52" x2="{bb_w - 45}" y2="52" stroke="#3b82f6" stroke-width="2.5" />
    <text x="36" y="55" fill="#3b82f6" font-size="16" font-weight="bold">-</text>

    <!-- Bottom Power Rail (+) Red and (-) Blue -->
    <rect x="25" y="{bb_h - 62}" width="{bb_w - 50}" height="42" rx="4" fill="#f1f5f9" stroke="#e2e8f0" />
    <line x1="45" y1="{bb_h - 52}" x2="{bb_w - 45}" y2="{bb_h - 52}" stroke="#ef4444" stroke-width="2.5" />
    <text x="35" y="{bb_h - 48}" fill="#ef4444" font-size="14" font-weight="bold">+</text>
    <line x1="45" y1="{bb_h - 30}" x2="{bb_w - 45}" y2="{bb_h - 30}" stroke="#3b82f6" stroke-width="2.5" />
    <text x="36" y="{bb_h - 26}" fill="#3b82f6" font-size="16" font-weight="bold">-</text>

    <!-- Central Center Valley / Divider -->
    <rect x="25" y="232" width="{bb_w - 50}" height="16" fill="#e2e8f0" />

    <!-- Terminal Strip Column Indicators -->
    <text x="35" y="90" fill="#94a3b8" font-size="9" font-family="monospace">a b c d e</text>
    <text x="35" y="390" fill="#94a3b8" font-size="9" font-family="monospace">f g h i j</text>
"""

    # Generate tie point holes on breadboard (simplified visual grid)
    # 25 columns of holes
    col_start_x = 65
    col_spacing = 20
    for col in range(26):
        cx = col_start_x + col * col_spacing
        # Top power rail tie points
        svg += f'<circle cx="{cx}" cy="30" r="2.8" fill="#334155" />'
        svg += f'<circle cx="{cx}" cy="52" r="2.8" fill="#334155" />'
        # Bottom power rail tie points
        svg += f'<circle cx="{cx}" cy="{bb_h - 52}" r="2.8" fill="#334155" />'
        svg += f'<circle cx="{cx}" cy="{bb_h - 30}" r="2.8" fill="#334155" />'

        # Rows a-e (above valley: y from 105 to 215)
        for row_idx, ry in enumerate([105, 130, 155, 180, 205]):
            svg += f'<circle cx="{cx}" cy="{ry}" r="2.5" fill="#475569" opacity="0.8" />'

        # Rows f-j (below valley: y from 275 to 375)
        for row_idx, ry in enumerate([275, 300, 325, 350, 375]):
            svg += f'<circle cx="{cx}" cy="{ry}" r="2.5" fill="#475569" opacity="0.8" />'

    # --- PUSH BUTTONS PLACED ACROSS THE VALLEY (Cols 4, 10, 16) ---
    # Button 1 at col 4 (cx = 65 + 4*20 = 145)
    # Button 2 at col 10 (cx = 65 + 10*20 = 265)
    # Button 3 at col 16 (cx = 65 + 16*20 = 385)
    button_cols = [
        ("SW1", 145, "Btn 1 (C4 262Hz)", "#10b981"),
        ("SW2", 265, "Btn 2 (E4 330Hz)", "#f59e0b"),
        ("SW3", 385, "Btn 3 (G4 392Hz)", "#ef4444")
    ]
    for b_id, bx, b_label, b_color in button_cols:
        # Button square body across valley (y=210 to 270)
        svg += f"""
    <!-- Push Button {b_id} -->
    <g id="{b_id}" filter="url(#shadow)">
      <rect x="{bx - 24}" y="210" width="48" height="60" rx="6" fill="#1e293b" stroke="#0f172a" stroke-width="1.5" />
      <circle cx="{bx}" cy="240" r="16" fill="{b_color}" stroke="#ffffff" stroke-width="1.5" />
      <!-- Metallic legs into breadboard rows e (y=205) and f (y=275) -->
      <rect x="{bx - 18}" y="198" width="6" height="14" fill="#94a3b8" rx="1" />
      <rect x="{bx + 12}" y="198" width="6" height="14" fill="#94a3b8" rx="1" />
      <rect x="{bx - 18}" y="268" width="6" height="14" fill="#94a3b8" rx="1" />
      <rect x="{bx + 12}" y="268" width="6" height="14" fill="#94a3b8" rx="1" />
      <text x="{bx}" y="295" fill="#0f172a" font-size="10" font-weight="bold" text-anchor="middle">{b_label}</text>
    </g>
"""

    # --- PULL-DOWN RESISTORS (10kΩ) connected between leg (row f/g) and GND rail ---
    # 10k Resistor 1 at bx=145, Resistor 2 at bx=265, Resistor 3 at bx=385
    # From y=275 down to GND rail (y=bb_h - 30 = 450)
    for b_id, bx, _, _ in button_cols:
        rx = bx + 15
        svg += f"""
    <!-- 10kΩ Pull-down Resistor for {b_id} -->
    <g id="resistor-10k-{b_id}">
      <!-- Wire leads -->
      <line x1="{rx}" y1="275" x2="{rx}" y2="320" stroke="#94a3b8" stroke-width="2.5" />
      <line x1="{rx}" y1="370" x2="{rx}" y2="{bb_h - 30}" stroke="#94a3b8" stroke-width="2.5" />
      <!-- Resistor body -->
      <rect x="{rx - 7}" y="320" width="14" height="50" rx="5" fill="url(#resistor-body)" stroke="#b89770" stroke-width="1" />
      <!-- Color bands for 10k: Brown (1), Black (0), Orange (x1k), Gold (5%) -->
      <rect x="{rx - 7}" y="326" width="14" height="4" fill="#854d0e" /> <!-- Brown -->
      <rect x="{rx - 7}" y="335" width="14" height="4" fill="#171717" /> <!-- Black -->
      <rect x="{rx - 7}" y="344" width="14" height="4" fill="#ea580c" /> <!-- Orange -->
      <rect x="{rx - 7}" y="358" width="14" height="4" fill="#d97706" /> <!-- Gold -->
      <text x="{rx + 12}" y="348" fill="#475569" font-size="8" font-weight="bold">10kΩ</text>
    </g>
"""

    # --- SPEAKER AND 100Ω RESISTOR (Col 22, bx = 65 + 22*20 = 505) ---
    spk_col = 505
    svg += f"""
    <!-- 100Ω Current Limiting Resistor for Speaker -->
    <g id="resistor-100ohm">
      <line x1="{spk_col}" y1="105" x2="{spk_col}" y2="135" stroke="#94a3b8" stroke-width="2.5" />
      <line x1="{spk_col}" y1="185" x2="{spk_col}" y2="205" stroke="#94a3b8" stroke-width="2.5" />
      <rect x="{spk_col - 7}" y="135" width="14" height="50" rx="5" fill="url(#resistor-body)" stroke="#b89770" stroke-width="1" />
      <!-- Color bands for 100Ω: Brown (1), Black (0), Brown (x10), Gold (5%) -->
      <rect x="{spk_col - 7}" y="141" width="14" height="4" fill="#854d0e" /> <!-- Brown -->
      <rect x="{spk_col - 7}" y="150" width="14" height="4" fill="#171717" /> <!-- Black -->
      <rect x="{spk_col - 7}" y="159" width="14" height="4" fill="#854d0e" /> <!-- Brown -->
      <rect x="{spk_col - 7}" y="173" width="14" height="4" fill="#d97706" /> <!-- Gold -->
      <text x="{spk_col + 12}" y="163" fill="#475569" font-size="8" font-weight="bold">100Ω</text>
    </g>

    <!-- 8Ω Speaker / Piezo Buzzer -->
    <g id="speaker-component" transform="translate({spk_col + 20}, 270)" filter="url(#shadow)">
      <circle cx="40" cy="40" r="42" fill="url(#speaker-grad)" stroke="#0f172a" stroke-width="2" />
      <circle cx="40" cy="40" r="32" fill="#0f172a" />
      <circle cx="40" cy="40" r="16" fill="#475569" stroke="#64748b" stroke-width="1.5" />
      <circle cx="40" cy="40" r="4" fill="#94a3b8" />
      <!-- Lead wires -->
      <!-- Positive lead to col 505 row f (y=275 -> local y=5, x=-20) -->
      <path d="M 25 15 C 10 5, -10 5, -20 5" fill="none" stroke="#ef4444" stroke-width="2.5" />
      <text x="25" y="10" fill="#ef4444" font-size="9" font-weight="bold">+</text>
      <!-- Negative lead to GND rail (y=450 -> local y=180, x=-20) -->
      <path d="M 55 70 C 55 120, -10 160, -20 180" fill="none" stroke="#1e293b" stroke-width="2.5" />
      <text x="60" y="70" fill="#3b82f6" font-size="9" font-weight="bold">-</text>
      <text x="40" y="96" fill="#1e293b" font-size="11" font-weight="bold" text-anchor="middle">8Ω Speaker</text>
    </g>
"""

    # --- INTERNAL BREADBOARD JUMPER WIRES ---
    # 1. 5V rail to Button 1, 2, 3 top leg (row e, y=105)
    for _, bx, _, _ in button_cols:
        svg += f"""
    <!-- 5V to Button top leg -->
    <path d="M {bx - 18} 30 L {bx - 18} 105" fill="none" stroke="#ef4444" stroke-width="3" stroke-linecap="round" filter="url(#wire-shadow)" />
    <circle cx="{bx - 18}" cy="30" r="3.5" fill="#b91c1c" />
    <circle cx="{bx - 18}" cy="105" r="3.5" fill="#b91c1c" />
"""

    # 2. Speaker 100Ω resistor connection to speaker positive lead
    # Resistor at y=205 (row e) connects across valley to row f (y=275) where speaker + connects
    svg += f"""
    <path d="M {spk_col} 205 L {spk_col} 275" fill="none" stroke="#a855f7" stroke-width="3" stroke-linecap="round" filter="url(#wire-shadow)" />
    <circle cx="{spk_col}" cy="205" r="3.5" fill="#7e22ce" />
    <circle cx="{spk_col}" cy="275" r="3.5" fill="#7e22ce" />
  </g>
"""

    # ==================== MAIN JUMPER WIRES BETWEEN ARDUINO & BREADBOARD ====================
    # Arduino Board is at translate(40, 110)
    # Absolute positions:
    # pin-5V: 40 + 80 + 64 = 184, 110 + 440 + 14 = 564
    # pin-GND1: 40 + 80 + 86 = 206, 564
    # pin-D8: 40 + 290 + 14 = 344, 110 + 70 + 158 = 338
    # pin-D4: 344, 110 + 70 + 222 = 402
    # pin-D3: 344, 110 + 70 + 238 = 418
    # pin-D2: 344, 110 + 70 + 254 = 434
    
    # Breadboard absolute targets:
    # 5V rail: bb_x + 65 = 515, bb_y + 30 = 140
    # GND rail: bb_x + 65 = 515, bb_y + 450 = 560
    # Button 1 (D2): bb_x + 145 = 595, bb_y + 275 = 385
    # Button 2 (D3): bb_x + 265 = 715, bb_y + 275 = 385
    # Button 3 (D4): bb_x + 385 = 835, bb_y + 275 = 385
    # Speaker Resistor in (D8): bb_x + spk_col = 450 + 505 = 955, bb_y + 105 = 215

    svg += """
  <!-- ==================== JUMPER WIRES ==================== -->
  <g id="jumper-wires">
    <!-- 1. POWER WIRE: Arduino 5V -> Breadboard Top +5V Rail (Red) -->
    <path d="M 184 564 C 184 660, 470 660, 470 300 C 470 140, 490 140, 515 140" 
          fill="none" stroke="#dc2626" stroke-width="4.5" stroke-linecap="round" filter="url(#wire-shadow)" />
    <circle cx="184" cy="564" r="5" fill="#991b1b" />
    <circle cx="515" cy="140" r="5" fill="#991b1b" />
    <text x="310" y="650" fill="#dc2626" font-size="11" font-weight="bold" text-anchor="middle">5V Power Wire (Red)</text>

    <!-- 2. GROUND WIRE: Arduino GND -> Breadboard Bottom GND Rail (Black) -->
    <path d="M 206 564 C 206 630, 380 630, 440 600 C 480 580, 490 560, 515 560" 
          fill="none" stroke="#1e293b" stroke-width="4.5" stroke-linecap="round" filter="url(#wire-shadow)" />
    <circle cx="206" cy="564" r="5" fill="#0f172a" />
    <circle cx="515" cy="560" r="5" fill="#0f172a" />
    <text x="340" y="615" fill="#1e293b" font-size="11" font-weight="bold" text-anchor="middle">GND Wire (Black)</text>

    <!-- 3. BUTTON 1 WIRE: Arduino D2 -> Button 1 Pin (Row f, Green) -->
    <path d="M 344 434 C 400 434, 480 470, 530 470 C 565 470, 580 410, 595 385" 
          fill="none" stroke="#10b981" stroke-width="3.8" stroke-linecap="round" filter="url(#wire-shadow)" />
    <circle cx="344" cy="434" r="4.5" fill="#047857" />
    <circle cx="595" cy="385" r="4.5" fill="#047857" />
    <text x="465" y="482" fill="#047857" font-size="10" font-weight="bold" text-anchor="middle">Pin D2 -> Btn 1 (Green)</text>

    <!-- 4. BUTTON 2 WIRE: Arduino D3 -> Button 2 Pin (Row f, Yellow) -->
    <path d="M 344 418 C 410 418, 520 510, 620 510 C 670 510, 700 420, 715 385" 
          fill="none" stroke="#eab308" stroke-width="3.8" stroke-linecap="round" filter="url(#wire-shadow)" />
    <circle cx="344" cy="418" r="4.5" fill="#a16207" />
    <circle cx="715" cy="385" r="4.5" fill="#a16207" />
    <text x="540" y="522" fill="#a16207" font-size="10" font-weight="bold" text-anchor="middle">Pin D3 -> Btn 2 (Yellow)</text>

    <!-- 5. BUTTON 3 WIRE: Arduino D4 -> Button 3 Pin (Row f, Orange) -->
    <path d="M 344 402 C 420 402, 540 540, 700 540 C 780 540, 820 430, 835 385" 
          fill="none" stroke="#f97316" stroke-width="3.8" stroke-linecap="round" filter="url(#wire-shadow)" />
    <circle cx="344" cy="402" r="4.5" fill="#c2410c" />
    <circle cx="835" cy="385" r="4.5" fill="#c2410c" />
    <text x="630" y="552" fill="#c2410c" font-size="10" font-weight="bold" text-anchor="middle">Pin D4 -> Btn 3 (Orange)</text>

    <!-- 6. SPEAKER WIRE: Arduino D8 -> 100Ω Resistor Top (Blue / Purple) -->
    <path d="M 344 338 C 420 338, 520 200, 700 190 C 800 185, 910 200, 955 215" 
          fill="none" stroke="#8b5cf6" stroke-width="4" stroke-linecap="round" filter="url(#wire-shadow)" />
    <circle cx="344" cy="338" r="4.5" fill="#6d28d9" />
    <circle cx="955" cy="215" r="4.5" fill="#6d28d9" />
    <text x="650" y="180" fill="#6d28d9" font-size="11" font-weight="bold" text-anchor="middle">Pin D8 -> 100Ω Resistor -> Speaker (Purple)</text>
  </g>

  <!-- Legend & Callout Card at Bottom -->
  <g id="diagram-legend" transform="translate(40, 680)">
    <rect x="0" y="0" width="1020" height="60" rx="8" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5" />
    <text x="20" y="24" fill="#0f172a" font-size="12" font-weight="bold">Wiring Summary:</text>
    <text x="20" y="44" fill="#475569" font-size="11">• 5V (Red) &amp; GND (Black) power breadboard rails.</text>
    <text x="320" y="44" fill="#475569" font-size="11">• Pushbuttons connect 5V to D2, D3, D4 with 10kΩ pull-downs to GND.</text>
    <text x="730" y="44" fill="#475569" font-size="11">• D8 drives 8Ω speaker via 100Ω current limiter to GND.</text>
  </g>
</svg>
"""
    return svg

if __name__ == "__main__":
    svg_data = generate_breadboard_svg()
    out_path = Path(__file__).resolve().parent / "arduino_piano_breadboard.svg"
    out_path.write_text(svg_data, encoding="utf-8")
    print("Breadboard SVG generated:", out_path)
