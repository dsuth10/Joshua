import os

def build_presentation():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    template_path = os.path.abspath(
        os.path.join(script_dir, "..", "..", "..", ".agent", "skills", "classroom-presentation", "assets", "presentation_template.html")
    )
    
    # Direct absolute fallback if relative resolution varies
    if not os.path.exists(template_path):
        template_path = r"c:\Users\dsuth\Documents\Joshua\.agent\skills\classroom-presentation\assets\presentation_template.html"

    if not os.path.exists(template_path):
        print(f"Error: Template not found at {template_path}")
        return

    with open(template_path, "r", encoding="utf-8") as f:
        template_content = f.read()

    # Define Slide Deck HTML Content
    slides_html = """
    <!-- Slide 1: Title -->
    <section class="slide theme-dark active" id="slide-1">
      <div class="content flex-center text-center">
        <span class="badge badge-orange fade-in-up">Year 5 Mathematics — Number</span>
        <h1 class="slide-title fade-in-up delay-1" style="font-size: 52px; margin-top: 20px; color: var(--pure-white);">
          Subtraction from Whole Numbers &amp; Using Fractions
        </h1>
        <p class="subtitle fade-in-up delay-2" style="font-size: 28px; color: var(--blue); margin-top: 15px;">
          Signpost Mathematics Lessons 1:22 &amp; 1:23
        </p>
        <div class="card fade-in-up delay-3" style="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); max-width: 800px; margin: 30px auto 0; padding: 20px; text-align: left;">
          <h3 style="color: var(--orange); font-size: 22px; margin-bottom: 8px;">WALT (We Are Learning To)</h3>
          <ul style="color: var(--text-light); font-size: 20px; line-height: 1.6; margin-left: 20px;">
            <li>Subtract fractions from 1 whole and whole numbers greater than 1.</li>
            <li>Order fractions with related denominators by finding common denominators.</li>
            <li>Add and subtract fractions with related denominators.</li>
          </ul>
        </div>
      </div>
      <div class="teacher-notes" style="display: none;">
        <h3>Teacher Logistics &amp; Presenter Notes</h3>
        <p><strong>DO:</strong> Welcome class and project WALT criteria.</p>
        <p><strong>WORK:</strong> Whole class discussion on fraction decomposition.</p>
        <p><strong>RECORD:</strong> Ensure mini-whiteboards are ready.</p>
        <p><strong>FINISH:</strong> 2 minutes.</p>
        <p><strong>CHECK:</strong> Assess student readiness for fraction operations.</p>
      </div>
    </section>

    <!-- Slide 2: Warm-up Decomposing Wholes -->
    <section class="slide theme-light" id="slide-2">
      <h2 class="slide-title fade-in-up">Warm-up: Decomposing Whole Numbers</h2>
      <div class="content fade-in-up delay-1">
        <div class="standard-only">
          <p style="font-size: 26px; margin-bottom: 20px; color: var(--text-dark);">
            Any whole number can be renamed into equal fractional parts:
          </p>
          <div class="grid grid-3" style="gap: 20px; margin-bottom: 30px;">
            <div class="card text-center" style="background: #EBF8FF; border: 2px solid var(--navy);">
              <h3 style="color: var(--navy); font-size: 32px;">1 Whole</h3>
              <p style="font-size: 26px; font-weight: bold; color: var(--orange); margin-top: 10px;">= 3/3 = 4/4 = 8/8 = 10/10</p>
            </div>
            <div class="card text-center" style="background: #EBF8FF; border: 2px solid var(--navy);">
              <h3 style="color: var(--navy); font-size: 32px;">3 Wholes</h3>
              <p style="font-size: 26px; font-weight: bold; color: var(--orange); margin-top: 10px;">= 2 + 1 = 2 4/4</p>
            </div>
            <div class="card text-center" style="background: #EBF8FF; border: 2px solid var(--navy);">
              <h3 style="color: var(--navy); font-size: 32px;">4 Wholes</h3>
              <p style="font-size: 26px; font-weight: bold; color: var(--orange); margin-top: 10px;">= 3 + 1 = 3 10/10</p>
            </div>
          </div>
        </div>
        <div class="lucas-only">
          <p style="font-size: 24px; margin-bottom: 20px; color: var(--text-dark);">
            Think of 1 whole pizza divided into equal slices:
          </p>
          <div class="card text-center" style="background: #EBF8FF; padding: 20px;">
            <p style="font-size: 28px; font-weight: bold; color: var(--navy);">1 Pizza = 4 quarters (4/4)</p>
            <p style="font-size: 24px; color: var(--text-dark); margin-top: 10px;">If you eat 1 quarter, 3 quarters (3/4) remain!</p>
          </div>
        </div>
      </div>
      <div class="teacher-notes" style="display: none;">
        <h3>Warm-up Logistics</h3>
        <p><strong>DO:</strong> Direct students to write fraction equivalences on mini-whiteboards.</p>
        <p><strong>WORK:</strong> Individual mini-whiteboard response.</p>
        <p><strong>RECORD:</strong> Prompt students to complete: 1 = ?/6, 2 = 1 ?/8.</p>
        <p><strong>FINISH:</strong> 3 minutes.</p>
        <p><strong>CHECK:</strong> Scan room for understanding that 1 whole = n/n.</p>
      </div>
    </section>

    <!-- Slide 3: Concept 1 - Subtraction from 1 Whole -->
    <section class="slide theme-light" id="slide-3">
      <h2 class="slide-title fade-in-up">Concept 1: Subtraction from 1 Whole</h2>
      <div class="content fade-in-up delay-1">
        <p style="font-size: 26px; margin-bottom: 20px; color: var(--text-dark);">
          To subtract a fraction from 1, change 1 into a fraction with the <strong>same denominator</strong>:
        </p>
        <div class="grid grid-2" style="gap: 30px; align-items: center;">
          <div class="card" style="border-left: 6px solid var(--orange); background: var(--pure-white);">
            <h3 style="color: var(--navy); font-size: 28px; margin-bottom: 12px;">Example A: 1 - 1/3</h3>
            <p style="font-size: 24px; color: var(--text-dark); line-height: 1.8;">
              1. Rename 1 as <strong>3/3</strong>.<br>
              2. Subtract numerators: <strong>3/3 - 1/3 = 2/3</strong>.
            </p>
          </div>
          <div class="card" style="border-left: 6px solid var(--blue); background: var(--pure-white);">
            <h3 style="color: var(--navy); font-size: 28px; margin-bottom: 12px;">Example B: 1 - 1/8</h3>
            <p style="font-size: 24px; color: var(--text-dark); line-height: 1.8;">
              1. Rename 1 as <strong>8/8</strong>.<br>
              2. Subtract numerators: <strong>8/8 - 1/8 = 7/8</strong>.
            </p>
          </div>
        </div>
      </div>
      <div class="teacher-notes" style="display: none;">
        <h3>Concept 1 Logistics</h3>
        <p><strong>DO:</strong> Model 1 - 1/3 using visual bar drawings on the interactive whiteboard overlay.</p>
        <p><strong>WORK:</strong> Guided instruction.</p>
        <p><strong>RECORD:</strong> Write 1 - 3/4 on board.</p>
        <p><strong>FINISH:</strong> 4 minutes.</p>
        <p><strong>CHECK:</strong> Confirm students subtract only top numbers (numerators).</p>
      </div>
    </section>

    <!-- Slide 4: Concept 1 - Subtraction from Whole Numbers > 1 -->
    <section class="slide theme-light" id="slide-4">
      <h2 class="slide-title fade-in-up">Concept 1: Subtraction from Whole Numbers &gt; 1</h2>
      <div class="content fade-in-up delay-1">
        <p style="font-size: 26px; margin-bottom: 20px; color: var(--text-dark);">
          When subtracting from a number greater than 1, break off <strong>1 whole</strong> and turn it into a fraction:
        </p>
        <div class="card" style="background: #FFF9F2; border: 2px dashed var(--orange); padding: 25px; margin-bottom: 25px;">
          <h3 style="color: var(--orange); font-size: 30px; margin-bottom: 10px;">Calculation: 3 - 1/4</h3>
          <ol style="font-size: 24px; color: var(--text-dark); line-height: 1.8; margin-left: 30px;">
            <li>Decompose <strong>3</strong> into <strong>2 + 1</strong> = <strong>2 4/4</strong>.</li>
            <li>Subtract 1/4 from the fraction part: <strong>4/4 - 1/4 = 3/4</strong>.</li>
            <li>Combine whole and fraction: <strong>2 3/4</strong>.</li>
          </ol>
        </div>
        <p style="font-size: 24px; color: var(--navy); font-weight: bold;">
          Two wholes and three quarters left!  --  3 - 1/4 = 2 3/4
        </p>
      </div>
      <div class="teacher-notes" style="display: none;">
        <h3>Whole Numbers > 1 Logistics</h3>
        <p><strong>DO:</strong> Emphasise borrowing 1 whole while keeping remaining whole number intact.</p>
        <p><strong>WORK:</strong> Pair talk &amp; whiteboard practice.</p>
        <p><strong>RECORD:</strong> 4 - 1/10 = 3 9/10.</p>
        <p><strong>FINISH:</strong> 4 minutes.</p>
        <p><strong>CHECK:</strong> Ensure whole number decreases by exactly 1.</p>
      </div>
    </section>

    <!-- Slide 5: Interactive Practice Subtraction -->
    <section class="slide theme-light" id="slide-5">
      <h2 class="slide-title fade-in-up">Interactive Practice: Subtraction Challenges</h2>
      <div class="content fade-in-up delay-1">
        <p style="font-size: 24px; margin-bottom: 20px;">Solve each subtraction problem by selecting the correct mixed numeral or fraction:</p>
        <div class="grid grid-2" style="gap: 20px;" id="subtraction-interactive-grid">
          <div class="card" style="background: var(--pure-white); border: 1px solid var(--soft-grey);">
            <p style="font-size: 26px; font-weight: bold; color: var(--navy);">1.  1 - 5/6 = ?</p>
            <div style="display: flex; gap: 10px; margin-top: 15px;">
              <button class="opt-btn" onclick="checkSub(this, false)">4/6</button>
              <button class="opt-btn" onclick="checkSub(this, true)">1/6</button>
              <button class="opt-btn" onclick="checkSub(this, false)">5/6</button>
            </div>
          </div>
          <div class="card" style="background: var(--pure-white); border: 1px solid var(--soft-grey);">
            <p style="font-size: 26px; font-weight: bold; color: var(--navy);">2.  2 - 1/3 = ?</p>
            <div style="display: flex; gap: 10px; margin-top: 15px;">
              <button class="opt-btn" onclick="checkSub(this, true)">1 2/3</button>
              <button class="opt-btn" onclick="checkSub(this, false)">1 1/3</button>
              <button class="opt-btn" onclick="checkSub(this, false)">2 2/3</button>
            </div>
          </div>
          <div class="card" style="background: var(--pure-white); border: 1px solid var(--soft-grey);">
            <p style="font-size: 26px; font-weight: bold; color: var(--navy);">3.  4 - 1/10 = ?</p>
            <div style="display: flex; gap: 10px; margin-top: 15px;">
              <button class="opt-btn" onclick="checkSub(this, false)">3 1/10</button>
              <button class="opt-btn" onclick="checkSub(this, true)">3 9/10</button>
              <button class="opt-btn" onclick="checkSub(this, false)">4 9/10</button>
            </div>
          </div>
          <div class="card" style="background: var(--pure-white); border: 1px solid var(--soft-grey);">
            <p style="font-size: 26px; font-weight: bold; color: var(--navy);">4.  3 - 1/8 = ?</p>
            <div style="display: flex; gap: 10px; margin-top: 15px;">
              <button class="opt-btn" onclick="checkSub(this, true)">2 7/8</button>
              <button class="opt-btn" onclick="checkSub(this, false)">2 1/8</button>
              <button class="opt-btn" onclick="checkSub(this, false)">3 7/8</button>
            </div>
          </div>
        </div>
      </div>
      <div class="teacher-notes" style="display: none;">
        <h3>Interactive Practice Logistics</h3>
        <p><strong>DO:</strong> Call students up to smartboard or take class vote.</p>
        <p><strong>WORK:</strong> Class participation.</p>
        <p><strong>RECORD:</strong> Track correct selections.</p>
        <p><strong>FINISH:</strong> 5 minutes.</p>
        <p><strong>CHECK:</strong> Reinforce instant feedback green/red states.</p>
      </div>
    </section>

    <!-- Slide 6: CFU Mini-Whiteboard Check 1 -->
    <section class="slide theme-light" id="slide-6">
      <div class="cfu-badge" style="position: absolute; top: 30px; right: 40px; background: var(--orange); color: white; padding: 10px 20px; border-radius: 20px; font-weight: bold; font-size: 20px;">
        CFU: Mini-Whiteboard Check
      </div>
      <h2 class="slide-title fade-in-up">Check for Understanding #1</h2>
      <div class="content fade-in-up delay-1">
        <div class="card" style="background: #F4F7F9; border: 3px solid var(--navy); padding: 30px; margin-top: 20px;">
          <h3 style="font-size: 32px; color: var(--navy); margin-bottom: 20px;">Solve on your mini-whiteboards:</h3>
          <p style="font-size: 36px; font-weight: bold; color: var(--orange); margin-bottom: 20px;">
            A)  1 - 3/8 = ?<br>
            B)  4 - 1/4 = ?
          </p>
          <p style="font-size: 24px; color: var(--text-dark);">
            Write your final answer clearly and hold up your whiteboard when the bell rings!
          </p>
        </div>
      </div>
      <div class="teacher-notes" style="display: none;">
        <h3>CFU #1 Logistics</h3>
        <p><strong>DO:</strong> Count down 3, 2, 1 - Show Boards!</p>
        <p><strong>WORK:</strong> 100% individual student participation on physical whiteboards.</p>
        <p><strong>RECORD:</strong> Correct answers: A) 5/8, B) 3 3/4.</p>
        <p><strong>FINISH:</strong> 3 minutes.</p>
        <p><strong>CHECK:</strong> Confirm no student wrote 4 3/4 for B.</p>
      </div>
    </section>

    <!-- Slide 7: Concept 2 - Fraction Wall & Equivalent Fractions -->
    <section class="slide theme-light" id="slide-7">
      <h2 class="slide-title fade-in-up">Concept 2: Visualizing Equivalent Fractions</h2>
      <div class="content fade-in-up delay-1">
        <p style="font-size: 26px; margin-bottom: 15px; color: var(--text-dark);">
          Signpost Page 1:22 Q4 — Fraction Bar Relationships:
        </p>
        <!-- Fraction Wall Visual Representation -->
        <div style="background: white; border: 2px solid var(--navy); border-radius: 8px; padding: 15px; margin-bottom: 25px;">
          <div style="display: flex; background: #0B4F6C; color: white; text-align: center; line-height: 40px; font-weight: bold; font-size: 20px; border-radius: 4px; margin-bottom: 5px;">
            <div style="flex: 1;">1 Whole</div>
          </div>
          <div style="display: flex; gap: 4px; margin-bottom: 5px;">
            <div style="flex: 1; background: #1B9AAA; color: white; text-align: center; line-height: 35px; font-weight: bold;">1/3</div>
            <div style="flex: 1; background: #1B9AAA; color: white; text-align: center; line-height: 35px; font-weight: bold;">1/3</div>
            <div style="flex: 1; background: #1B9AAA; color: white; text-align: center; line-height: 35px; font-weight: bold;">1/3</div>
          </div>
          <div style="display: flex; gap: 4px; margin-bottom: 5px;">
            <div style="flex: 1; background: #F07167; color: white; text-align: center; line-height: 30px; font-size: 16px; font-weight: bold;">1/6</div>
            <div style="flex: 1; background: #F07167; color: white; text-align: center; line-height: 30px; font-size: 16px; font-weight: bold;">1/6</div>
            <div style="flex: 1; background: #F07167; color: white; text-align: center; line-height: 30px; font-size: 16px; font-weight: bold;">1/6</div>
            <div style="flex: 1; background: #F07167; color: white; text-align: center; line-height: 30px; font-size: 16px; font-weight: bold;">1/6</div>
            <div style="flex: 1; background: #F07167; color: white; text-align: center; line-height: 30px; font-size: 16px; font-weight: bold;">1/6</div>
            <div style="flex: 1; background: #F07167; color: white; text-align: center; line-height: 30px; font-size: 16px; font-weight: bold;">1/6</div>
          </div>
          <div style="display: flex; gap: 2px;">
            <div style="flex: 1; background: #2A9D8F; color: white; text-align: center; line-height: 25px; font-size: 12px; font-weight: bold;">1/12</div>
            <div style="flex: 1; background: #2A9D8F; color: white; text-align: center; line-height: 25px; font-size: 12px; font-weight: bold;">1/12</div>
            <div style="flex: 1; background: #2A9D8F; color: white; text-align: center; line-height: 25px; font-size: 12px; font-weight: bold;">1/12</div>
            <div style="flex: 1; background: #2A9D8F; color: white; text-align: center; line-height: 25px; font-size: 12px; font-weight: bold;">1/12</div>
            <div style="flex: 1; background: #2A9D8F; color: white; text-align: center; line-height: 25px; font-size: 12px; font-weight: bold;">1/12</div>
            <div style="flex: 1; background: #2A9D8F; color: white; text-align: center; line-height: 25px; font-size: 12px; font-weight: bold;">1/12</div>
            <div style="flex: 1; background: #2A9D8F; color: white; text-align: center; line-height: 25px; font-size: 12px; font-weight: bold;">1/12</div>
            <div style="flex: 1; background: #2A9D8F; color: white; text-align: center; line-height: 25px; font-size: 12px; font-weight: bold;">1/12</div>
            <div style="flex: 1; background: #2A9D8F; color: white; text-align: center; line-height: 25px; font-size: 12px; font-weight: bold;">1/12</div>
            <div style="flex: 1; background: #2A9D8F; color: white; text-align: center; line-height: 25px; font-size: 12px; font-weight: bold;">1/12</div>
            <div style="flex: 1; background: #2A9D8F; color: white; text-align: center; line-height: 25px; font-size: 12px; font-weight: bold;">1/12</div>
            <div style="flex: 1; background: #2A9D8F; color: white; text-align: center; line-height: 25px; font-size: 12px; font-weight: bold;">1/12</div>
          </div>
        </div>
        <div class="grid grid-3" style="gap: 15px; font-size: 22px; font-weight: bold; text-align: center;">
          <div style="background: #EBF8FF; padding: 10px; border-radius: 6px;">2/12 = 1/6</div>
          <div style="background: #EBF8FF; padding: 10px; border-radius: 6px;">10/12 = 5/6</div>
          <div style="background: #EBF8FF; padding: 10px; border-radius: 6px;">4/6 = 2/3</div>
        </div>
      </div>
      <div class="teacher-notes" style="display: none;">
        <h3>Fraction Wall Logistics</h3>
        <p><strong>DO:</strong> Draw vertical alignment lines down the fraction wall using the digital toolbar pen.</p>
        <p><strong>WORK:</strong> Visual demonstration.</p>
        <p><strong>RECORD:</strong> Confirm 2/12 matches 1/6 length.</p>
        <p><strong>FINISH:</strong> 4 minutes.</p>
        <p><strong>CHECK:</strong> Ask students how many 1/12 bars fit into 2/3 (8/12).</p>
      </div>
    </section>

    <!-- Slide 8: Concept 3 - Ordering Fractions -->
    <section class="slide theme-light" id="slide-8">
      <h2 class="slide-title fade-in-up">Concept 3: Ordering Related Fractions</h2>
      <div class="content fade-in-up delay-1">
        <p style="font-size: 26px; margin-bottom: 15px; color: var(--text-dark);">
          To order fractions, use <strong>equivalent fractions</strong> to give them the same denominator:
        </p>
        <div class="card" style="background: #F4F7F9; border: 2px solid var(--navy); padding: 20px; margin-bottom: 20px;">
          <h3 style="color: var(--navy); font-size: 26px; margin-bottom: 10px;">Example: Order 3/8, 3/4, 1/2, 1 1/8 (smallest first)</h3>
          <p style="font-size: 24px; color: var(--text-dark); line-height: 1.8;">
            1. Convert all fractions to <strong>eighths</strong>:<br>
            &nbsp;&nbsp;&bull; 3/4 = (3 &times; 2) / (4 &times; 2) = <strong>6/8</strong><br>
            &nbsp;&nbsp;&bull; 1/2 = (1 &times; 4) / (2 &times; 4) = <strong>4/8</strong><br>
            2. Compare converted values: <strong>3/8, 4/8, 6/8, 9/8 (1 1/8)</strong>.<br>
            3. Final Order: <span style="color: var(--orange); font-weight: bold;">3/8, 1/2, 3/4, 1 1/8</span>.
          </p>
        </div>
      </div>
      <div class="teacher-notes" style="display: none;">
        <h3>Ordering Logistics</h3>
        <p><strong>DO:</strong> Guide students through finding common denominator (LCM = 8).</p>
        <p><strong>WORK:</strong> Step-by-step board work.</p>
        <p><strong>RECORD:</strong> Have students convert 7/10, 1 1/10, 1/5, 1/2 to tenths on whiteboards.</p>
        <p><strong>FINISH:</strong> 5 minutes.</p>
        <p><strong>CHECK:</strong> Ensure mixed number 1 1/8 is recognized as largest (&gt; 1).</p>
      </div>
    </section>

    <!-- Slide 9: Concept 4 - Adding Fractions with Related Denominators -->
    <section class="slide theme-light" id="slide-9">
      <h2 class="slide-title fade-in-up">Concept 4: Adding Fractions (Related Denominators)</h2>
      <div class="content fade-in-up delay-1">
        <div class="card" style="background: #EBF8FF; border-left: 6px solid var(--navy); padding: 25px; margin-bottom: 25px;">
          <h3 style="color: var(--navy); font-size: 30px; margin-bottom: 12px;">Rule: Make the denominators the same BEFORE adding!</h3>
          <p style="font-size: 26px; color: var(--text-dark); line-height: 1.8;">
            Problem: <strong>3/8 + 1/4 = ?</strong><br>
            Step 1: Convert 1/4 to eighths &rarr; <strong>(1 &times; 2)/(4 &times; 2) = 2/8</strong>.<br>
            Step 2: Add numerators &rarr; <strong>3/8 + 2/8 = 5/8</strong>.
          </p>
        </div>
        <div class="card" style="background: #FFF9F2; border-left: 6px solid var(--orange); padding: 20px;">
          <h4 style="color: var(--orange); font-size: 24px; margin-bottom: 8px;">Another Example: 4/5 + 7/10</h4>
          <p style="font-size: 22px; color: var(--text-dark);">
            Convert 4/5 &rarr; 8/10. Then 8/10 + 7/10 = 15/10 = <strong>1 5/10 = 1 1/2</strong>.
          </p>
        </div>
      </div>
      <div class="teacher-notes" style="display: none;">
        <h3>Adding Fractions Logistics</h3>
        <p><strong>DO:</strong> Emphasize that denominators DO NOT get added together!</p>
        <p><strong>WORK:</strong> Explicit teaching.</p>
        <p><strong>RECORD:</strong> Write 1/4 + 3/8 on board.</p>
        <p><strong>FINISH:</strong> 4 minutes.</p>
        <p><strong>CHECK:</strong> Correct common misconception of adding denominators (3/8 + 1/4 != 4/12).</p>
      </div>
    </section>

    <!-- Slide 10: Concept 5 - Subtracting Fractions with Related Denominators -->
    <section class="slide theme-light" id="slide-10">
      <h2 class="slide-title fade-in-up">Concept 5: Subtracting Fractions (Related Denominators)</h2>
      <div class="content fade-in-up delay-1">
        <div class="card" style="background: #F4F7F9; border-left: 6px solid var(--blue); padding: 25px; margin-bottom: 25px;">
          <h3 style="color: var(--navy); font-size: 30px; margin-bottom: 12px;">Rule: Make the denominators the same BEFORE subtracting!</h3>
          <p style="font-size: 26px; color: var(--text-dark); line-height: 1.8;">
            Problem: <strong>5/8 - 1/4 = ?</strong><br>
            Step 1: Convert 1/4 to eighths &rarr; <strong>(1 &times; 2)/(4 &times; 2) = 2/8</strong>.<br>
            Step 2: Subtract numerators &rarr; <strong>5/8 - 2/8 = 3/8</strong>.
          </p>
        </div>
        <div class="grid grid-2" style="gap: 20px;">
          <div class="card" style="background: white; border: 1px solid var(--soft-grey);">
            <p style="font-size: 22px; font-weight: bold; color: var(--navy);">Example 1: 9/10 - 1/2</p>
            <p style="font-size: 20px; color: var(--text-dark); margin-top: 5px;">9/10 - 5/10 = 4/10 = <strong>2/5</strong></p>
          </div>
          <div class="card" style="background: white; border: 1px solid var(--soft-grey);">
            <p style="font-size: 22px; font-weight: bold; color: var(--navy);">Example 2: 7/10 - 2/5</p>
            <p style="font-size: 20px; color: var(--text-dark); margin-top: 5px;">7/10 - 4/10 = <strong>3/10</strong></p>
          </div>
        </div>
      </div>
      <div class="teacher-notes" style="display: none;">
        <h3>Subtracting Fractions Logistics</h3>
        <p><strong>DO:</strong> Show simplification of 4/10 into 2/5 where applicable.</p>
        <p><strong>WORK:</strong> Guided practice.</p>
        <p><strong>RECORD:</strong> Solve 3/4 - 3/8 on board.</p>
        <p><strong>FINISH:</strong> 4 minutes.</p>
        <p><strong>CHECK:</strong> Check student simplification accuracy.</p>
      </div>
    </section>

    <!-- Slide 11: Interactive Matching Deck -->
    <section class="slide theme-light" id="slide-11">
      <h2 class="slide-title fade-in-up">Interactive Deck: Operations Matching</h2>
      <div class="content fade-in-up delay-1">
        <p style="font-size: 24px; margin-bottom: 20px;">Click an operation on the left, then click its matching answer on the right:</p>
        <div class="grid grid-2" style="gap: 30px;" id="matching-container">
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <button class="match-card left-card" data-match="1" onclick="selectMatch(this, 'left')">1/4 + 3/8</button>
            <button class="match-card left-card" data-match="2" onclick="selectMatch(this, 'left')">5/8 - 1/4</button>
            <button class="match-card left-card" data-match="3" onclick="selectMatch(this, 'left')">9/10 - 1/2</button>
            <button class="match-card left-card" data-match="4" onclick="selectMatch(this, 'left')">3/5 + 3/10</button>
          </div>
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <button class="match-card right-card" data-match="3" onclick="selectMatch(this, 'right')">2/5 (or 4/10)</button>
            <button class="match-card right-card" data-match="1" onclick="selectMatch(this, 'right')">5/8</button>
            <button class="match-card right-card" data-match="4" onclick="selectMatch(this, 'right')">9/10</button>
            <button class="match-card right-card" data-match="2" onclick="selectMatch(this, 'right')">3/8</button>
          </div>
        </div>
      </div>
      <div class="teacher-notes" style="display: none;">
        <h3>Matching Deck Logistics</h3>
        <p><strong>DO:</strong> Invite students to smartboard to tap pair combinations.</p>
        <p><strong>WORK:</strong> Student interaction.</p>
        <p><strong>RECORD:</strong> Log matched answers.</p>
        <p><strong>FINISH:</strong> 4 minutes.</p>
        <p><strong>CHECK:</strong> Validate matching logic.</p>
      </div>
    </section>

    <!-- Slide 12: CFU Mini-Whiteboard Check 2 -->
    <section class="slide theme-light" id="slide-12">
      <div class="cfu-badge" style="position: absolute; top: 30px; right: 40px; background: var(--orange); color: white; padding: 10px 20px; border-radius: 20px; font-weight: bold; font-size: 20px;">
        CFU: Mini-Whiteboard Check #2
      </div>
      <h2 class="slide-title fade-in-up">Check for Understanding #2</h2>
      <div class="content fade-in-up delay-1">
        <div class="card" style="background: #F4F7F9; border: 3px solid var(--navy); padding: 30px; margin-top: 20px;">
          <h3 style="font-size: 32px; color: var(--navy); margin-bottom: 20px;">Solve on your mini-whiteboards:</h3>
          <p style="font-size: 34px; font-weight: bold; color: var(--orange); margin-bottom: 20px; line-height: 1.6;">
            1)  3/5 + 1/10 = ?<br>
            2)  7/8 - 3/4 = ?<br>
            3)  Order smallest to largest:  1/4,  1/8,  1/2
          </p>
        </div>
      </div>
      <div class="teacher-notes" style="display: none;">
        <h3>CFU #2 Logistics</h3>
        <p><strong>DO:</strong> Mini-whiteboard check before independent worksheet completion.</p>
        <p><strong>WORK:</strong> Individual response.</p>
        <p><strong>RECORD:</strong> 1) 7/10, 2) 1/8, 3) 1/8, 1/4, 1/2.</p>
        <p><strong>FINISH:</strong> 4 minutes.</p>
        <p><strong>CHECK:</strong> Clear any remaining doubts before releasing to worksheet.</p>
      </div>
    </section>

    <!-- Slide 13: Summary & Independent Work -->
    <section class="slide theme-dark" id="slide-13">
      <div class="content text-center flex-center">
        <h2 class="slide-title fade-in-up" style="color: var(--pure-white); font-size: 44px;">Independent Practice Time!</h2>
        <p class="subtitle fade-in-up delay-1" style="font-size: 28px; color: var(--blue); margin-top: 15px;">
          Complete Worksheet: Lessons 1:22 &amp; 1:23
        </p>
        <div class="card fade-in-up delay-2" style="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); max-width: 800px; margin: 30px auto 0; padding: 25px; text-align: left;">
          <h3 style="color: var(--orange); font-size: 24px; margin-bottom: 10px;">Worksheet Checklist:</h3>
          <ul style="color: var(--text-light); font-size: 22px; line-height: 1.8; margin-left: 20px;">
            <li>&check; Subtraction from 1 whole &amp; mixed numerals (Parts 1-3)</li>
            <li>&check; Fraction wall equivalent fractions &amp; T/F statements (Part 4)</li>
            <li>&check; Ordering fractions &amp; related denominator operations (Parts 5-7)</li>
            <li>&check; Mathematical reasoning response (Part 8)</li>
          </ul>
        </div>
      </div>
      <div class="teacher-notes" style="display: none;">
        <h3>Independent Practice Logistics</h3>
        <p><strong>DO:</strong> Distribute Lesson_1_22_1_23_Worksheet.docx.</p>
        <p><strong>WORK:</strong> Independent work / small group teacher support rotation.</p>
        <p><strong>RECORD:</strong> Monitor student progress.</p>
        <p><strong>FINISH:</strong> 20 minutes.</p>
        <p><strong>CHECK:</strong> Collect worksheets and administer MS Forms exit ticket.</p>
      </div>
    </section>
    """

    interactive_styles_and_scripts = """
    <style>
      .opt-btn {
        background: #EBF8FF;
        border: 2px solid var(--navy);
        color: var(--navy);
        padding: 10px 20px;
        border-radius: 6px;
        font-size: 20px;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.2s ease;
      }
      .opt-btn:hover {
        background: var(--navy);
        color: white;
      }
      .opt-btn.correct {
        background: var(--green-success) !important;
        color: white !important;
        border-color: var(--green-success) !important;
      }
      .opt-btn.incorrect {
        background: var(--red-error) !important;
        color: white !important;
        border-color: var(--red-error) !important;
      }
      .match-card {
        background: white;
        border: 2px solid var(--navy);
        padding: 15px 20px;
        border-radius: 8px;
        font-size: 22px;
        font-weight: bold;
        color: var(--navy);
        cursor: pointer;
        text-align: left;
        transition: all 0.2s ease;
      }
      .match-card.selected {
        border-color: var(--orange);
        background: #FFF9F2;
      }
      .match-card.matched {
        background: #E6F4EA;
        border-color: var(--green-success);
        color: var(--green-success);
        cursor: default;
      }
    </style>

    <script>
      function checkSub(btn, isCorrect) {
        let parent = btn.parentElement;
        let buttons = parent.querySelectorAll('.opt-btn');
        buttons.forEach(b => b.classList.remove('correct', 'incorrect'));
        if (isCorrect) {
          btn.classList.add('correct');
        } else {
          btn.classList.add('incorrect');
        }
      }

      let selectedLeft = null;
      function selectMatch(btn, side) {
        if (btn.classList.contains('matched')) return;
        
        if (side === 'left') {
          document.querySelectorAll('.left-card').forEach(c => c.classList.remove('selected'));
          btn.classList.add('selected');
          selectedLeft = btn;
        } else if (side === 'right' && selectedLeft) {
          let leftId = selectedLeft.getAttribute('data-match');
          let rightId = btn.getAttribute('data-match');
          if (leftId === rightId) {
            selectedLeft.classList.remove('selected');
            selectedLeft.classList.add('matched');
            btn.classList.add('matched');
            selectedLeft = null;
          } else {
            btn.style.borderColor = 'var(--red-error)';
            setTimeout(() => {
              btn.style.borderColor = 'var(--navy)';
            }, 600);
          }
        }
      }
    </script>
    """

    if "<!-- SLIDES GO HERE DURING DYNAMIC COMPILATION -->" in template_content:
        output_html = template_content.replace(
            "<!-- SLIDES GO HERE DURING DYNAMIC COMPILATION -->", 
            slides_html + interactive_styles_and_scripts
        )
    elif '<div class="presentation-container" id="presentationContainer">' in template_content:
        output_html = template_content.replace(
            '<div class="presentation-container" id="presentationContainer">',
            '<div class="presentation-container" id="presentationContainer">\n' + slides_html + interactive_styles_and_scripts
        )
    else:
        output_html = template_content.replace("</body>", slides_html + interactive_styles_and_scripts + "\n</body>")

    output_path = os.path.join(script_dir, "Lesson_1.22_1.23_Presentation.html")
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(output_html)

    print(f"Successfully generated presentation HTML at: {output_path}")

if __name__ == "__main__":
    build_presentation()
