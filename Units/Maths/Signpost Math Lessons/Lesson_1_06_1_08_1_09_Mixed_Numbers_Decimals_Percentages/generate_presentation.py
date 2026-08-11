import os

def build_presentation():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    template_path = os.path.abspath(
        os.path.join(script_dir, "..", "..", "..", ".agent", "skills", "classroom-presentation", "assets", "presentation_template.html")
    )
    
    if not os.path.exists(template_path):
        template_path = r"c:\Users\dsuth\Documents\Joshua\.agent\skills\classroom-presentation\assets\presentation_template.html"

    if not os.path.exists(template_path):
        print(f"Error: Presentation template file not found at {template_path}")
        return

    with open(template_path, "r", encoding="utf-8") as f:
        template_content = f.read()

    def frac(n, d):
        return f'<span class="frac"><span class="num">{n}</span><span class="den">{d}</span></span>'

    def mixed(w, n, d):
        return f'<span class="mixed-num"><span class="whole">{w}</span><span class="frac"><span class="num">{n}</span><span class="den">{d}</span></span></span>'

    slides_html = f"""
    <style>
      .frac {{
        display: inline-flex;
        flex-direction: column;
        vertical-align: middle;
        text-align: center;
        font-size: 0.85em;
        line-height: 1.05;
        margin: 0 4px;
      }}
      .frac .num {{
        border-bottom: 2.5px solid currentColor;
        padding: 0 4px 2px 4px;
        display: block;
        font-weight: 700;
      }}
      .frac .den {{
        padding: 2px 4px 0 4px;
        display: block;
        font-weight: 700;
      }}
      .mixed-num {{
        display: inline-flex;
        align-items: center;
        gap: 4px;
        vertical-align: middle;
      }}
      .mixed-num .whole {{
        font-weight: 800;
        font-size: 1.1em;
      }}
    </style>

    <!-- Slide 1: Title & WALT -->
    <section class="slide theme-dark active" id="slide-1">
      <div class="content flex-center text-center">
        <span class="badge badge-orange fade-in-up">Year 5/6 Mathematics — Number</span>
        <h1 class="slide-title fade-in-up delay-1" style="font-size: 50px; margin-top: 20px; color: var(--pure-white);">
          Mixed Numbers, Percentages &amp; Conversions
        </h1>
        <p class="subtitle fade-in-up delay-2" style="font-size: 26px; color: var(--blue); margin-top: 12px;">
          Signpost Mathematics Lessons 1:06, 1:08 &amp; 1:09
        </p>
        <div class="card fade-in-up delay-3" style="background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.2); max-width: 850px; margin: 25px auto 0; padding: 22px; text-align: left;">
          <h3 style="color: var(--orange); font-size: 22px; margin-bottom: 8px;">WALT (We Are Learning To)</h3>
          <ul style="color: var(--text-light); font-size: 20px; line-height: 1.6; margin-left: 20px;">
            <li>Represent mixed numbers with hundredths as decimals (e.g. {mixed(2, 37, 100)} = 2.37).</li>
            <li>Understand percentage as parts per hundred (100% = 1 whole, 50% = {frac(1, 2)}, 25% = {frac(1, 4)}).</li>
            <li>Convert fluently between fractions over 100, decimals, and percentages.</li>
          </ul>
        </div>
      </div>
      <div class="teacher-notes" style="display: none;">
        <h3>Teacher Logistics &amp; Presenter Notes</h3>
        <p><strong>DO:</strong> Project Title slide and welcome class. Direct students to read the WALT criteria aloud.</p>
        <p><strong>WORK:</strong> Whole class brief orientation to today's core concepts (mixed numbers, percentages, and conversions).</p>
        <p><strong>RECORD:</strong> Ensure mini-whiteboards and markers are on every desk.</p>
        <p><strong>FINISH:</strong> 2 minutes.</p>
        <p><strong>CHECK:</strong> Verify all students have mini-whiteboards ready.</p>
      </div>
    </section>

    <!-- Slide 2: Warm-Up Visualizing 100 Squares -->
    <section class="slide theme-light" id="slide-2">
      <h2 class="slide-title fade-in-up">Warm-up: The 100-Square Grid</h2>
      <div class="content fade-in-up delay-1">
        <div class="standard-only">
          <p style="font-size: 26px; margin-bottom: 20px; color: var(--text-dark);">
            A 10 &times; 10 grid contains <strong>100 equal squares</strong>. 1 whole = 100 hundredths ({frac(100, 100)}).
          </p>
          <div class="grid grid-3" style="gap: 20px; margin-bottom: 25px;">
            <div class="card text-center" style="background: #EBF8FF; border: 2px solid var(--navy);">
              <h3 style="color: var(--navy); font-size: 26px;">1 Whole Grid</h3>
              <p style="font-size: 28px; font-weight: bold; color: var(--orange); margin-top: 10px;">{frac(100, 100)} = 1.00 = 100%</p>
            </div>
            <div class="card text-center" style="background: #EBF8FF; border: 2px solid var(--navy);">
              <h3 style="color: var(--navy); font-size: 26px;">Half Grid (50 squares)</h3>
              <p style="font-size: 28px; font-weight: bold; color: var(--orange); margin-top: 10px;">{frac(50, 100)} = 0.50 = 50%</p>
            </div>
            <div class="card text-center" style="background: #EBF8FF; border: 2px solid var(--navy);">
              <h3 style="color: var(--navy); font-size: 26px;">Quarter Grid (25 squares)</h3>
              <p style="font-size: 28px; font-weight: bold; color: var(--orange); margin-top: 10px;">{frac(25, 100)} = 0.25 = 25%</p>
            </div>
          </div>
          <div class="card" style="background: #fff3e0; border-left: 6px solid var(--orange); padding: 15px 20px;">
            <p style="font-size: 22px; color: var(--navy); font-weight: 600;">
              Mini-Whiteboard Challenge: If 2 whole grids are shaded and 37 squares on a 3rd grid are shaded, how many total hundredths is that?
            </p>
          </div>
        </div>
        <div class="lucas-only">
          <div class="card text-center" style="background: #EBF8FF; padding: 25px;">
            <h3 style="color: var(--navy); font-size: 30px;">1 Grid = 100 Small Squares</h3>
            <p style="font-size: 26px; color: var(--text-dark); margin-top: 15px;">
              Think of 100 cents in $1 dollar! 50 cents = $0.50 (50%). 25 cents = $0.25 (25%).
            </p>
          </div>
        </div>
      </div>
      <div class="teacher-notes" style="display: none;">
        <h3>Warm-up Logistics</h3>
        <p><strong>DO:</strong> Direct students to write total hundredths on mini-whiteboards for 2 wholes + 37 hundredths.</p>
        <p><strong>WORK:</strong> Individual response on mini-whiteboards.</p>
        <p><strong>RECORD:</strong> Prompt students: "2 wholes = 200/100, plus 37/100 = 237/100 = 2.37!"</p>
        <p><strong>FINISH:</strong> 3 minutes.</p>
        <p><strong>CHECK:</strong> Scan room for correct representation of 237/100.</p>
      </div>
    </section>

    <!-- Slide 3: Concept 1 - Mixed Numbers & Decimals (Signpost 1:06) -->
    <section class="slide theme-light" id="slide-3">
      <h2 class="slide-title fade-in-up">Concept 1: Mixed Numbers &amp; Decimals (Signpost 1:06)</h2>
      <div class="content fade-in-up delay-1">
        <div class="grid grid-2" style="gap: 30px;">
          <div class="card" style="background: var(--pure-white); border: 2px solid var(--navy); padding: 22px;">
            <h3 style="color: var(--navy); font-size: 24px; margin-bottom: 12px;">Decomposing 237 Hundredths</h3>
            <p style="font-size: 22px; color: var(--text-dark); line-height: 1.6;">
              <strong>{frac(237, 100)}</strong> is an improper fraction equal to:<br>
              &bull; <strong>2 wholes</strong> and <strong>37 hundredths</strong><br>
              &bull; Mixed number: <strong>{mixed(2, 37, 100)}</strong><br>
              &bull; Decimal: <strong>2.37</strong> (2 ones, 3 tenths, 7 hundredths)
            </p>
          </div>
          <div class="card" style="background: #fff3e0; border: 2px solid var(--orange); padding: 22px;">
            <h3 style="color: var(--red-error); font-size: 24px; margin-bottom: 12px;">CRITICAL RULE: Zero as Place Holder</h3>
            <p style="font-size: 22px; color: var(--text-dark); line-height: 1.6;">
              When adding single-digit hundredths:<br>
              &bull; <strong>{mixed(6, 8, 100)} = 6.08</strong> &nbsp;&nbsp;<span style="color:var(--green-success); font-weight:bold;">&check; CORRECT</span><br>
              &bull; <strong>6.8</strong> is {mixed(6, 8, 10)} (or {mixed(6, 80, 100)}) &nbsp;&nbsp;<span style="color:var(--red-error); font-weight:bold;">&cross; MISCONCEPTION</span>
            </p>
          </div>
        </div>
        <div class="card text-center" style="background: #EBF8FF; margin-top: 25px; padding: 18px;">
          <p style="font-size: 24px; color: var(--navy); font-weight: bold;">
            Mini-Whiteboard Check: Convert {mixed(5, 3, 100)} into a decimal!
          </p>
        </div>
      </div>
      <div class="teacher-notes" style="display: none;">
        <h3>Explicit Teaching 1 Logistics</h3>
        <p><strong>DO:</strong> Emphasize the place value zero in single-digit hundredths (e.g. 6 8/100 = 6.08).</p>
        <p><strong>WORK:</strong> Students write 5 3/100 on mini-whiteboards.</p>
        <p><strong>RECORD:</strong> Call out correct response: 5.03 (not 5.3!).</p>
        <p><strong>FINISH:</strong> 4 minutes.</p>
        <p><strong>CHECK:</strong> Ensure zero placeholder is used by all students.</p>
      </div>
    </section>

    <!-- Slide 4: Concept 2 - Percentages & Grids (Signpost 1:08) -->
    <section class="slide theme-light" id="slide-4">
      <h2 class="slide-title fade-in-up">Concept 2: Percentages (Signpost 1:08)</h2>
      <div class="content fade-in-up delay-1">
        <p style="font-size: 24px; color: var(--text-dark); margin-bottom: 20px;">
          <strong>Per cent</strong> comes from Latin <em>per centum</em> meaning <strong>"out of 100"</strong>.
        </p>
        <div class="grid grid-3" style="gap: 20px; margin-bottom: 25px;">
          <div class="card text-center" style="background: #EBF8FF; border: 2px solid var(--navy);">
            <h3 style="color: var(--navy); font-size: 26px;">50 out of 100</h3>
            <p style="font-size: 24px; color: var(--orange); font-weight: bold; margin-top: 8px;">50 hundredths = 50% = 0.50</p>
          </div>
          <div class="card text-center" style="background: #EBF8FF; border: 2px solid var(--navy);">
            <h3 style="color: var(--navy); font-size: 26px;">Real World: Battery</h3>
            <p style="font-size: 24px; color: var(--orange); font-weight: bold; margin-top: 8px;">64% charged = 0.64 = {frac(64, 100)}</p>
          </div>
          <div class="card text-center" style="background: #EBF8FF; border: 2px solid var(--navy);">
            <h3 style="color: var(--navy); font-size: 26px;">Uncoloured % Rule</h3>
            <p style="font-size: 24px; color: var(--orange); font-weight: bold; margin-top: 8px;">Uncoloured % = 100% - Coloured %</p>
          </div>
        </div>
        <div class="card" style="background: var(--pure-white); border: 2px solid var(--navy); padding: 20px;">
          <h3 style="color: var(--navy); font-size: 22px; margin-bottom: 8px;">Example:</h3>
          <p style="font-size: 22px; color: var(--text-dark);">
            If a square has <strong>45 squares coloured</strong> (45%), then the uncoloured percentage is <strong>100% - 45% = 55%</strong>!
          </p>
        </div>
      </div>
      <div class="teacher-notes" style="display: none;">
        <h3>Explicit Teaching 2 Logistics</h3>
        <p><strong>DO:</strong> Connect percentages to daily life (phone battery indicator, test scores).</p>
        <p><strong>WORK:</strong> Ask students to calculate uncoloured percentage if 72% is shaded.</p>
        <p><strong>RECORD:</strong> Mini-whiteboards: 100 - 72 = 28%.</p>
        <p><strong>FINISH:</strong> 4 minutes.</p>
        <p><strong>CHECK:</strong> Verify mental subtraction from 100.</p>
      </div>
    </section>

    <!-- Slide 5: Concept 3 - 3-Way Equivalence & Division (Signpost 1:09) -->
    <section class="slide theme-light" id="slide-5">
      <h2 class="slide-title fade-in-up">Concept 3: Using Percentages &amp; Converting (Signpost 1:09)</h2>
      <div class="content fade-in-up delay-1">
        <p style="font-size: 24px; color: var(--text-dark); margin-bottom: 18px;">
          Every fraction over 100 translates directly into a <strong>decimal</strong> and a <strong>percentage</strong>:
        </p>
        <div class="card text-center" style="background: #EBF8FF; border: 3px solid var(--navy); padding: 20px; margin-bottom: 25px;">
          <span style="font-size: 36px; font-weight: bold; color: var(--navy);">{frac(43, 100)}</span>
          <span style="font-size: 36px; font-weight: bold; color: var(--orange); margin: 0 20px;">&rarr;</span>
          <span style="font-size: 36px; font-weight: bold; color: var(--navy);">0.43</span>
          <span style="font-size: 36px; font-weight: bold; color: var(--orange); margin: 0 20px;">&rarr;</span>
          <span style="font-size: 36px; font-weight: bold; color: var(--navy);">43%</span>
        </div>
        <div class="card" style="background: var(--pure-white); border: 2px solid var(--navy); padding: 20px;">
          <h3 style="color: var(--navy); font-size: 22px; margin-bottom: 10px;">Calculator / Mental Division Rule:</h3>
          <p style="font-size: 22px; color: var(--text-dark); line-height: 1.5;">
            To find decimal value: <strong>Numerator &divide; Denominator</strong><br>
            e.g. {frac(35, 100)} = <strong>35 &divide; 100 = 0.35</strong> &nbsp;&nbsp;|& &nbsp;&nbsp; {frac(5, 100)} = <strong>5 &divide; 100 = 0.05</strong>
          </p>
        </div>
      </div>
      <div class="teacher-notes" style="display: none;">
        <h3>Explicit Teaching 3 Logistics</h3>
        <p><strong>DO:</strong> Model 3-way equivalence on board.</p>
        <p><strong>WORK:</strong> Students complete 3-way equivalence on mini-whiteboards for 76/100.</p>
        <p><strong>RECORD:</strong> 76/100 -> 0.76 -> 76%.</p>
        <p><strong>FINISH:</strong> 4 minutes.</p>
        <p><strong>CHECK:</strong> Confirm fluency across all three formats.</p>
      </div>
    </section>

    <!-- Slide 6: Interactive 100-Grid Shading Simulation -->
    <section class="slide theme-light" id="slide-6">
      <h2 class="slide-title fade-in-up">Interactive 100-Grid Shader</h2>
      <div class="content fade-in-up delay-1">
        <p style="font-size: 22px; color: var(--text-dark); margin-bottom: 15px; text-align: center;">
          Click preset buttons or enter a value to see live Fraction, Decimal, and Percentage representations!
        </p>
        <div style="display: flex; gap: 30px; align-items: center; justify-content: center;">
          <!-- 10x10 Visual Grid -->
          <div id="interactiveGrid" style="display: grid; grid-template-columns: repeat(10, 26px); gap: 2px; background: var(--navy); padding: 4px; border: 3px solid var(--navy); box-shadow: 4px 4px 0 var(--orange);">
            <!-- 100 cells generated dynamically -->
          </div>
          <!-- Controls & Output Panel -->
          <div style="display: flex; flex-direction: column; gap: 15px; width: 380px;">
            <div class="card" style="background: var(--pure-white); border: 2px solid var(--navy); padding: 18px;">
              <h4 style="color: var(--navy); font-size: 20px; margin-bottom: 10px;">Preset Values:</h4>
              <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                <button onclick="setGridVal(10)" style="padding: 8px 14px; background: #EBF8FF; border: 1px solid var(--navy); cursor: pointer; font-weight: bold;">10%</button>
                <button onclick="setGridVal(25)" style="padding: 8px 14px; background: #EBF8FF; border: 1px solid var(--navy); cursor: pointer; font-weight: bold;">25%</button>
                <button onclick="setGridVal(50)" style="padding: 8px 14px; background: #EBF8FF; border: 1px solid var(--navy); cursor: pointer; font-weight: bold;">50%</button>
                <button onclick="setGridVal(75)" style="padding: 8px 14px; background: #EBF8FF; border: 1px solid var(--navy); cursor: pointer; font-weight: bold;">75%</button>
                <button onclick="setGridVal(64)" style="padding: 8px 14px; background: #EBF8FF; border: 1px solid var(--navy); cursor: pointer; font-weight: bold;">64%</button>
              </div>
            </div>
            <div class="card" style="background: #EBF8FF; border: 2px solid var(--navy); padding: 18px;">
              <p style="font-size: 20px; color: var(--navy);"><strong>Shaded:</strong> <span id="outShaded" style="color:var(--orange); font-weight:bold;">25</span> squares</p>
              <p style="font-size: 20px; color: var(--navy); display: flex; align-items: center; gap: 8px;"><strong>Fraction:</strong> <span id="outFrac" style="font-weight:bold;">{frac(25, 100)}</span></p>
              <p style="font-size: 20px; color: var(--navy);"><strong>Decimal:</strong> <span id="outDec" style="font-weight:bold;">0.25</span></p>
              <p style="font-size: 20px; color: var(--navy);"><strong>Percentage:</strong> <span id="outPct" style="font-weight:bold;">25%</span></p>
              <p style="font-size: 20px; color: var(--navy);"><strong>Uncoloured %:</strong> <span id="outUncol" style="font-weight:bold;">75%</span></p>
            </div>
          </div>
        </div>
      </div>
      <div class="teacher-notes" style="display: none;">
        <h3>Interactive Demonstration Logistics</h3>
        <p><strong>DO:</strong> Click different preset buttons and ask students to predict the decimal and uncoloured % before revealing.</p>
        <p><strong>WORK:</strong> Whole class visual interaction.</p>
        <p><strong>RECORD:</strong> Prompt students to record 64% as decimal (0.64) and uncoloured % (36%).</p>
        <p><strong>FINISH:</strong> 5 minutes.</p>
        <p><strong>CHECK:</strong> Ensure students see the connection between shaded squares, hundredths, decimals, and percentages.</p>
      </div>
    </section>

    <!-- Slide 7: CFU & Misconception Check -->
    <section class="slide theme-light" id="slide-7">
      <h2 class="slide-title fade-in-up">Check For Understanding (CFU)</h2>
      <div class="content fade-in-up delay-1">
        <div class="card" style="background: var(--pure-white); border: 3px solid var(--navy); padding: 25px; margin-bottom: 20px;">
          <h3 style="color: var(--orange); font-size: 24px; margin-bottom: 15px;">Mini-Whiteboard Challenge (3 Questions):</h3>
          <ol style="font-size: 22px; color: var(--text-dark); line-height: 1.8; margin-left: 25px;">
            <li>Write <strong>{mixed(9, 42, 100)}</strong> as a decimal. &nbsp;&nbsp;&rarr; &nbsp;&nbsp;<span style="color: var(--blue);">[ ? ]</span></li>
            <li>If a square has <strong>85%</strong> shaded green, what percentage is <strong>NOT coloured</strong>? &nbsp;&nbsp;&rarr; &nbsp;&nbsp;<span style="color: var(--blue);">[ ? ]</span></li>
            <li>Convert <strong>{frac(5, 100)}</strong> into a decimal and a percentage. &nbsp;&nbsp;&rarr; &nbsp;&nbsp;<span style="color: var(--blue);">[ ? ]</span></li>
          </ol>
        </div>
        <div class="card text-center" style="background: #fff3e0; border: 2px solid var(--orange); padding: 15px;">
          <p style="font-size: 22px; color: var(--navy); font-weight: bold;">
            Hold up your whiteboards when you hear "3, 2, 1... SHOW!"
          </p>
        </div>
      </div>
      <div class="teacher-notes" style="display: none;">
        <h3>CFU Logistics</h3>
        <p><strong>DO:</strong> Count down 3, 2, 1... SHOW for mini-whiteboard check.</p>
        <p><strong>WORK:</strong> Individual student execution on whiteboards.</p>
        <p><strong>RECORD:</strong> Expected answers: 1) 9.42, 2) 15%, 3) 0.05 and 5%.</p>
        <p><strong>FINISH:</strong> 4 minutes.</p>
        <p><strong>CHECK:</strong> Target students who wrote 0.5 instead of 0.05 for Q3 for immediate correction.</p>
      </div>
    </section>

    <!-- Slide 8: Guided & Independent Practice (Worksheet Orientation) -->
    <section class="slide theme-light" id="slide-8">
      <h2 class="slide-title fade-in-up">Classroom Practice: Signpost Worksheet</h2>
      <div class="content fade-in-up delay-1">
        <div class="grid grid-3" style="gap: 20px;">
          <div class="card" style="background: #EBF8FF; border: 2px solid var(--navy); padding: 20px;">
            <h3 style="color: var(--navy); font-size: 22px; margin-bottom: 10px;">Section 1: 1:06</h3>
            <p style="font-size: 20px; color: var(--text-dark); line-height: 1.5;">
              Mixed numbers &amp; decimals.<br>
              &bull; Q1: Grid fractions/decimals<br>
              &bull; Q2: Mixed numbers &gt; 1<br>
              &bull; Q3-4: Conversions<br>
              &bull; Q5-6: Grid shading
            </p>
          </div>
          <div class="card" style="background: #EBF8FF; border: 2px solid var(--navy); padding: 20px;">
            <h3 style="color: var(--navy); font-size: 22px; margin-bottom: 10px;">Section 2: 1:08</h3>
            <p style="font-size: 20px; color: var(--text-dark); line-height: 1.5;">
              Percentages.<br>
              &bull; Q1: Coloured %<br>
              &bull; Q2: Uncoloured %<br>
              &bull; Q3: 3-Way equivalence table
            </p>
          </div>
          <div class="card" style="background: #EBF8FF; border: 2px solid var(--navy); padding: 20px;">
            <h3 style="color: var(--navy); font-size: 22px; margin-bottom: 10px;">Section 3: 1:09</h3>
            <p style="font-size: 20px; color: var(--text-dark); line-height: 1.5;">
              Using &amp; converting.<br>
              &bull; Q1-2: Grid shading &amp; uncoloured %<br>
              &bull; Q3: Conversion table<br>
              &bull; Q4: Calculator/mental division
            </p>
          </div>
        </div>
        <div class="card text-center" style="background: var(--pure-white); border: 2px solid var(--orange); margin-top: 25px; padding: 18px;">
          <p style="font-size: 22px; color: var(--navy); font-weight: bold;">
            Complete your printed student worksheet: Lesson_1_06_1_08_1_09_Worksheet.docx
          </p>
        </div>
      </div>
      <div class="teacher-notes" style="display: none;">
        <h3>Independent Practice Logistics</h3>
        <p><strong>DO:</strong> Hand out student worksheets and monitor progress.</p>
        <p><strong>WORK:</strong> Individual student worksheet completion.</p>
        <p><strong>RECORD:</strong> Assist Tier 2 students with place value zero placeholders.</p>
        <p><strong>FINISH:</strong> 25 minutes.</p>
        <p><strong>CHECK:</strong> Circulate and check accuracy on Q3 and Q4 conversions.</p>
      </div>
    </section>

    <!-- Slide 9: Reflection & Lesson Wrap-Up -->
    <section class="slide theme-dark" id="slide-9">
      <div class="content flex-center text-center">
        <h2 class="slide-title fade-in-up" style="color: var(--pure-white); font-size: 44px;">
          Lesson Reflection &amp; Exit Ticket
        </h2>
        <div class="card fade-in-up delay-1" style="background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.2); max-width: 800px; margin: 25px auto 0; padding: 25px; text-align: left;">
          <h3 style="color: var(--orange); font-size: 24px; margin-bottom: 12px;">Exit Ticket Prompt (Mini-Whiteboard):</h3>
          <p style="font-size: 22px; color: var(--text-light); line-height: 1.6;">
            A student says that <strong>{mixed(3, 4, 100)}</strong> is equal to <strong>3.4</strong>.<br>
            Are they correct or incorrect? Explain why on your whiteboard!
          </p>
        </div>
      </div>
      <div class="teacher-notes" style="display: none;">
        <h3>Lesson Wrap-Up Logistics</h3>
        <p><strong>DO:</strong> Collect exit ticket responses before dismissing class.</p>
        <p><strong>WORK:</strong> Individual exit ticket reflection.</p>
        <p><strong>RECORD:</strong> Correct answer: Incorrect! 3 4/100 is 3.04. 3.4 is equal to 3 40/100 or 3 4/10.</p>
        <p><strong>FINISH:</strong> 3 minutes.</p>
        <p><strong>CHECK:</strong> Record student mastery of place value zero placeholder rule.</p>
      </div>
    </section>
    """

    grid_script = """
    <script>
      function initInteractiveGrid() {
        const grid = document.getElementById('interactiveGrid');
        if (!grid) return;
        grid.innerHTML = '';
        for (let i = 0; i < 100; i++) {
          const cell = document.createElement('div');
          cell.style.width = '26px';
          cell.style.height = '26px';
          cell.style.background = 'white';
          cell.style.borderRadius = '2px';
          cell.style.transition = 'background 0.2s ease';
          cell.id = 'cell-' + i;
          grid.appendChild(cell);
        }
        setGridVal(25);
      }

      function setGridVal(val) {
        val = Math.min(100, Math.max(0, val));
        for (let i = 0; i < 100; i++) {
          const cell = document.getElementById('cell-' + i);
          if (cell) {
            cell.style.background = i < val ? 'var(--orange)' : 'white';
          }
        }
        const outShaded = document.getElementById('outShaded');
        const outFrac = document.getElementById('outFrac');
        const outDec = document.getElementById('outDec');
        const outPct = document.getElementById('outPct');
        const outUncol = document.getElementById('outUncol');

        if (outShaded) outShaded.innerText = val;
        if (outFrac) outFrac.innerHTML = '<span class="frac"><span class="num">' + val + '</span><span class="den">100</span></span>';
        if (outDec) outDec.innerText = (val / 100).toFixed(2);
        if (outPct) outPct.innerText = val + '%';
        if (outUncol) outUncol.innerText = (100 - val) + '%';
      }

      document.addEventListener('DOMContentLoaded', () => {
        setTimeout(initInteractiveGrid, 300);
      });
    </script>
    """

    final_html = template_content.replace(
        "<!-- SLIDES GO HERE DURING DYNAMIC COMPILATION -->",
        slides_html + grid_script
    )

    output_path = os.path.join(script_dir, "Lesson_1.06_1.08_1.09_Presentation.html")
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(final_html)

    print(f"Presentation successfully compiled with vertical stacked fractions at: {output_path}")

if __name__ == "__main__":
    build_presentation()
