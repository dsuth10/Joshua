const fs = require('fs');
const path = require('path');

function compile() {
  const rootPath = 'c:\\Users\\dsuth\\Documents\\Joshua';
  const templatePath = path.join(rootPath, '.agent', 'skills', 'lesson-creator', 'assets', 'presentation_template.html');
  const outputPath = path.join(__dirname, '..', 'Lesson_25.2_Presentation.html');
  
  if (!fs.existsSync(templatePath)) {
    console.error("❌ Standard presentation template not found at:", templatePath);
    process.exit(1);
  }
  
  let templateContent = fs.readFileSync(templatePath, 'utf8');
  
  // Custom tsunami slides structure
  const slidesContent = `
    <!-- Slide 1: Title Slide (theme-dark) -->
    <div class="slide theme-dark" id="slide1">
      <div class="fade-in-up">
        <h1>Causes & Effects of Tsunamis</h1>
        <h2>Wave Dynamics & Part A Prep</h2>
        <p class="subtitle">An interactive learning sequence to master skimming, scanning, and analytical comprehension for the Part A English Assessment.</p>
      </div>
    </div>
    
    <!-- Slide 2: Learning Intentions & Success Criteria (theme-light) -->
    <div class="slide theme-light" id="slide2">
      <h2 class="slide-title">Learning Intentions & Success Criteria</h2>
      <div class="content fade-in-up delay-1">
        <div class="remember-box" style="margin-top: 10px;">
          <strong>Learning Intention:</strong> I can read and comprehend an informative text on tsunamis, explaining purpose, audience, text structures, and language/visual features. (AC9E5LY03, AC9E5LY04, AC9E5LY05)
        </div>
        <ul class="success-list" style="margin-top: 25px;">
          <li class="delay-2">I can scan a complex informative text to locate tsunami facts.</li>
          <li class="delay-3">I can identify structural features of a science report (headings, glossary, comparison tables).</li>
          <li class="delay-4">I can explain how authors use parenthetical definitions to scaffold scientific terminology.</li>
          <li class="delay-5">I can use the two-step formula (Evidence + Precise Effect) to decode language and visual features.</li>
        </ul>
      </div>
    </div>
    
    <!-- Slide 3: Model Part 1: Topic & Core Definition (theme-light) -->
    <div class="slide theme-light standard-only" id="slide3">
      <h2 class="slide-title">01. Introduction: What is a Tsunami?</h2>
      <div class="content fade-in-up delay-1">
        <p class="intro-text"><strong>Modeling Goal:</strong> Show how to scan for topic details and decode parenthetical definitions.</p>
        
        <div class="annotations-grid" style="grid-template-columns: 1.25fr 0.75fr; margin-top: 10px;">
          <div class="text-workspace" style="font-size: 22px; line-height: 1.8; background-color: var(--pure-white); border: 3px solid var(--navy); border-radius: 8px; box-shadow: 6px 6px 0px rgba(17,45,78,0.1); padding: 25px; max-height: 380px; overflow-y: auto; color: var(--text-dark);">
            <p>A tsunami is a series of giant, fast-moving ocean waves. Tsunami is a Japanese word. It means 'harbour wave'. These waves are caused by a sudden <span class="decodable-segment" id="seg1" style="background-color: var(--blue-light); border-bottom: 2px dashed var(--orange); padding: 0 4px; cursor: pointer; border-radius: 2px; font-weight: 500;">displacement (movement out of place)</span> of water. Normal waves are made by wind, but tsunamis are different. They are triggered by underwater events. These include volcanic eruptions, landslides, or submarine earthquakes.</p>
          </div>
          
          <div class="annotation-sidebar" id="decodeInfoCard1" style="min-height: 250px; justify-content: center; align-items: center; text-align: center; color: var(--text-dark); background-color: var(--pure-white); border: 3px solid var(--navy); border-radius: 8px; box-shadow: 6px 6px 0px rgba(17,45,78,0.1); padding: 20px; display: flex; flex-direction: column;">
            <h3 class="sidebar-header" id="decodeTitle1" style="border-bottom: none; font-size: 20px; font-weight: bold; color: var(--navy); margin-bottom: 12px;">Q1 & Q2: Topic & Facts</h3>
            <div class="sidebar-content" id="decodeContent1" style="font-size: 15px; line-height: 1.5; text-align: left;">
              <p style="margin-bottom: 10px;"><strong>Q1 (Topic):</strong> The text is about tsunamis, explaining their causes and effects.</p>
              <p style="margin-bottom: 10px;"><strong>Q2 (Fact):</strong> Tsunamis are triggered by underwater disturbances like landslides or volcanic eruptions.</p>
              <p><em>Click the underlined text to analyze the language feature.</em></p>
            </div>
          </div>
        </div>
        
        <div class="teacher-notes" style="display:none;">
          <strong>Teacher Notes - Modelling:</strong>
          <p>Read the paragraph aloud. Point out that the author uses a parenthetical definition next to 'displacement' to support the reader's vocabulary.</p>
        </div>
      </div>
      <script>
        (function() {
          const title = document.getElementById('decodeTitle1');
          const content = document.getElementById('decodeContent1');
          const seg1 = document.getElementById('seg1');

          seg1.addEventListener('click', () => {
            seg1.classList.add('active-decode');
            title.innerText = "⭐ Language Feature Analysis";
            title.style.borderBottom = '3px solid var(--orange)';
            content.innerHTML = "\\<strong\\>Feature:\\</strong\\> Parenthetical Definition\\<br\\>\\<em\\>\\"displacement (movement out of place)\\"\\</em\\>\\<br\\>\\<br\\>\\<strong\\>Precise Effect:\\</strong\\> The author uses parentheses to explain the scientific term 'displacement' inline, ensuring Year 5 readers comprehend the physical cause without breaking the flow of information.";
          });
        })();
      </script>
    </div>
    
    <!-- Slide 4: Model Part 2: Undersea Earthquakes (theme-light) -->
    <div class="slide theme-light standard-only" id="slide4">
      <h2 class="slide-title">02. Undersea Earthquakes & Energy</h2>
      <div class="content fade-in-up delay-1">
        <p class="intro-text"><strong>Modeling Goal:</strong> Trace cause-and-effect structures and cohesive markers.</p>
        
        <div class="annotations-grid" style="grid-template-columns: 1.25fr 0.75fr; margin-top: 10px;">
          <div class="text-workspace" style="font-size: 22px; line-height: 1.8; background-color: var(--pure-white); border: 3px solid var(--navy); border-radius: 8px; box-shadow: 6px 6px 0px rgba(17,45,78,0.1); padding: 25px; max-height: 380px; overflow-y: auto; color: var(--text-dark);">
            <p>Most tsunamis start with undersea earthquakes. These happen along tectonic plate boundaries. <span class="decodable-segment" id="seg2" style="background-color: var(--blue-light); border-bottom: 2px dashed var(--orange); padding: 0 4px; cursor: pointer; border-radius: 2px; font-weight: 500;">The plates suddenly break or slip, which releases seismic (earth-shaking) energy.</span> The sea floor pushes up or down, lifting the water column above it. The water shifts and makes powerful waves. The waves spread out in all directions.</p>
          </div>
          
          <div class="annotation-sidebar" id="decodeInfoCard2" style="min-height: 250px; justify-content: center; align-items: center; text-align: center; color: var(--text-dark); background-color: var(--pure-white); border: 3px solid var(--navy); border-radius: 8px; box-shadow: 6px 6px 0px rgba(17,45,78,0.1); padding: 20px; display: flex; flex-direction: column;">
            <h3 class="sidebar-header" id="decodeTitle2" style="border-bottom: none; font-size: 20px; font-weight: bold; color: var(--navy); margin-bottom: 12px;">Q3: Main & Supporting Ideas</h3>
            <div class="sidebar-content" id="decodeContent2" style="font-size: 15px; line-height: 1.5; text-align: left;">
              <p style="margin-bottom: 10px;"><strong>Main Idea:</strong> Undersea earthquakes are the primary trigger for tsunamis.</p>
              <p style="margin-bottom: 10px;"><strong>Supporting Detail:</strong> Tectonic plates slip, releasing energy that pushes the ocean floor and lifts the water column.</p>
              <p><em>Click the underlined text to analyze the language feature.</em></p>
            </div>
          </div>
        </div>
        
        <div class="teacher-notes" style="display:none;">
          <strong>Teacher Notes - Modelling:</strong>
          <p>Show how a chain of actions creates the tsunami: plates slip -> energy released -> sea floor moves -> water column lifted -> waves spread.</p>
        </div>
      </div>
      <script>
        (function() {
          const title = document.getElementById('decodeTitle2');
          const content = document.getElementById('decodeContent2');
          const seg2 = document.getElementById('seg2');

          seg2.addEventListener('click', () => {
            seg2.classList.add('active-decode');
            title.innerText = "⭐ Cohesion & Text Structure";
            title.style.borderBottom = '3px solid var(--orange)';
            content.innerHTML = "\\<strong\\>Feature:\\</strong\\> Cause-and-Effect Clause Structure\\<br\\>\\<em\\>\\"plates break or slip, which releases... seismic energy\\"\\</em\\>\\<br\\>\\<br\\>\\<strong\\>Precise Effect:\\</strong\\> The relative clause ('which releases...') links the physical action of tectonic plates directly to the consequence of energy release, building logical cohesion.";
          });
        })();
      </script>
    </div>
    
    <!-- Slide 5: Model Part 3: Deep Ocean Propagation (theme-light) -->
    <div class="slide theme-light standard-only" id="slide5">
      <h2 class="slide-title">03. Deep Ocean Wave Propagation</h2>
      <div class="content fade-in-up delay-1">
        <p class="intro-text"><strong>Modeling Goal:</strong> Explore how the author addresses the audience and establishes scientific purpose.</p>
        
        <div class="annotations-grid" style="grid-template-columns: 1.25fr 0.75fr; margin-top: 10px;">
          <div class="text-workspace" style="font-size: 22px; line-height: 1.8; background-color: var(--pure-white); border: 3px solid var(--navy); border-radius: 8px; box-shadow: 6px 6px 0px rgba(17,45,78,0.1); padding: 25px; max-height: 380px; overflow-y: auto; color: var(--text-dark);">
            <p>In the deep ocean, tsunamis travel very fast. They can go over 800 kilometres per hour. <span class="decodable-segment" id="seg3" style="background-color: var(--blue-light); border-bottom: 2px dashed var(--orange); padding: 0 4px; cursor: pointer; border-radius: 2px; font-weight: 500;">However, the deep waves are not very high. They are often less than one metre tall.</span> Ships at sea might not notice them. This travel is called wave <span class="decodable-segment" id="seg4" style="background-color: var(--blue-light); border-bottom: 2px dashed var(--orange); padding: 0 4px; cursor: pointer; border-radius: 2px; font-weight: 500;">propagation (how waves move in deep water)</span>.</p>
          </div>
          
          <div class="annotation-sidebar" id="decodeInfoCard3" style="min-height: 250px; justify-content: center; align-items: center; text-align: center; color: var(--text-dark); background-color: var(--pure-white); border: 3px solid var(--navy); border-radius: 8px; box-shadow: 6px 6px 0px rgba(17,45,78,0.1); padding: 20px; display: flex; flex-direction: column;">
            <h3 class="sidebar-header" id="decodeTitle3" style="border-bottom: none; font-size: 20px; font-weight: bold; color: var(--navy); margin-bottom: 12px;">Q4 & Q5: Audience & Purpose</h3>
            <div class="sidebar-content" id="decodeContent3" style="font-size: 15px; line-height: 1.5; text-align: left;">
              <p style="margin-bottom: 10px;"><strong>Q4 (Audience):</strong> Students and general readers interested in earth science.</p>
              <p style="margin-bottom: 10px;"><strong>Q5 (Purpose):</strong> To explain the surprising science of wave dynamics, showing that tsunamis are almost invisible in deep water.</p>
              <p><em>Click the underlined segments to analyze features.</em></p>
            </div>
          </div>
        </div>
        
        <div class="teacher-notes" style="display:none;">
          <strong>Teacher Notes - Modelling:</strong>
          <p>Discuss the contrast word 'However'. It marks a transition to a surprising detail (very fast waves that are extremely low in height).</p>
        </div>
      </div>
      <script>
        (function() {
          const title = document.getElementById('decodeTitle3');
          const content = document.getElementById('decodeContent3');
          const seg3 = document.getElementById('seg3');
          const seg4 = document.getElementById('seg4');

          seg3.addEventListener('click', () => {
            seg3.classList.add('active-decode');
            seg4.classList.remove('active-decode');
            title.innerText = "⭐ Conjunction of Contrast";
            title.style.borderBottom = '3px solid var(--orange)';
            content.innerHTML = "\\<strong\\>Feature:\\</strong\\> Conjunction of Contrast ('However')\\<br\\>\\<br\\>\\<strong\\>Precise Effect:\\</strong\\> Introduces information that goes against expectations. The reader expects an 800 km/h wave to be massive, but 'However' signals that it is actually less than a metre tall in deep water.";
          });

          seg4.addEventListener('click', () => {
            seg4.classList.add('active-decode');
            seg3.classList.remove('active-decode');
            title.innerText = "⭐ Terminology Scaffolding";
            title.style.borderBottom = '3px solid var(--orange)';
            content.innerHTML = "\\<strong\\>Feature:\\</strong\\> Technical Parenthetical Definition\\<br\\>\\<em\\>\\"propagation (how waves move in deep water)\\"\\</em\\>\\<br\\>\\<br\\>\\<strong\\>Precise Effect:\\</strong\\> Introduces the formal academic term 'propagation' while providing a simple synonym in parentheses to keep the text engaging and understandable for a Year 5 reader.";
          });
        })();
      </script>
    </div>
    
    <!-- Slide 6: Model Part 4: Shallow Water Shoaling (theme-light) -->
    <div class="slide theme-light standard-only" id="slide6">
      <h2 class="slide-title">04. Wave Shoaling & Coastal Threat</h2>
      <div class="content fade-in-up delay-1">
        <p class="intro-text"><strong>Modeling Goal:</strong> Identify structural features and cohesion.</p>
        
        <div class="annotations-grid" style="grid-template-columns: 1.25fr 0.75fr; margin-top: 10px;">
          <div class="text-workspace" style="font-size: 22px; line-height: 1.8; background-color: var(--pure-white); border: 3px solid var(--navy); border-radius: 8px; box-shadow: 6px 6px 0px rgba(17,45,78,0.1); padding: 25px; max-height: 380px; overflow-y: auto; color: var(--text-dark);">
            <p>The waves slow down as they reach shallow water. They drop to about 50 kilometres per hour. But the water piles up, causing the waves to grow very tall. <span class="decodable-segment" id="seg5" style="background-color: var(--blue-light); border-bottom: 2px dashed var(--orange); padding: 0 4px; cursor: pointer; border-radius: 2px; font-weight: 500;">This dramatic growth is called wave shoaling (compressing and rising near land).</span> <span class="decodable-segment" id="seg6" style="background-color: var(--blue-light); border-bottom: 2px dashed var(--orange); padding: 0 4px; cursor: pointer; border-radius: 2px; font-weight: 500;">The water might suddenly pull back from the beach. Then, a massive wall of water hits the shore.</span></p>
            <div style="margin-top: 15px; text-align: center;">
              <img src="Tsunami_Reading/wave_shoaling.jpg" alt="Figure 1: Wave Shoaling Diagram" style="max-height: 120px; border: 2px solid var(--navy); border-radius: 4px; cursor: zoom-in; box-shadow: 3px 3px 0px rgba(17,45,78,0.1);">
              <div style="font-size: 14px; color: var(--text-muted); margin-top: 4px; font-style: italic;">Click to enlarge diagram</div>
            </div>
          </div>
          
          <div class="annotation-sidebar" id="decodeInfoCard4" style="min-height: 250px; justify-content: center; align-items: center; text-align: center; color: var(--text-dark); background-color: var(--pure-white); border: 3px solid var(--navy); border-radius: 8px; box-shadow: 6px 6px 0px rgba(17,45,78,0.1); padding: 20px; display: flex; flex-direction: column;">
            <h3 class="sidebar-header" id="decodeTitle4" style="border-bottom: none; font-size: 20px; font-weight: bold; color: var(--navy); margin-bottom: 12px;">Q6 & Q7: Text Type & Cohesion</h3>
            <div class="sidebar-content" id="decodeContent4" style="font-size: 15px; line-height: 1.5; text-align: left;">
              <p style="margin-bottom: 10px;"><strong>Q6 (Text Type):</strong> Information report. Structural features include technical headings, factual vocabulary, and process sequencing.</p>
              <p style="margin-bottom: 10px;"><strong>Q7 (Cohesion):</strong> Connectives like 'But', 'As', and 'Then' sequence the steps of the wave hitting the shore.</p>
              <p><em>Click the underlined segments to analyze features.</em></p>
            </div>
          </div>
        </div>
        
        <div class="teacher-notes" style="display:none;">
          <strong>Teacher Notes - Modelling:</strong>
          <p>Highlight how temporal connectives like 'Then' establish chronological order in natural disaster events, preparing the reader for the climax of the wave impact.</p>
        </div>
      </div>
      <script>
        (function() {
          const title = document.getElementById('decodeTitle4');
          const content = document.getElementById('decodeContent4');
          const seg5 = document.getElementById('seg5');
          const seg6 = document.getElementById('seg6');

          seg5.addEventListener('click', () => {
            seg5.classList.add('active-decode');
            seg6.classList.remove('active-decode');
            title.innerText = "⭐ Technical Nomenclature";
            title.style.borderBottom = '3px solid var(--orange)';
            content.innerHTML = "\\<strong\\>Feature:\\</strong\\> Precise Scientific Terminology\\<br\\>\\<em\\>\\"wave shoaling\\"\\</em\\>\\<br\\>\\<br\\>\\<strong\\>Precise Effect:\\</strong\\> Introduces the proper physical term for wave compression ('shoaling') so that students learn official earth science nomenclature while preparing for formal writing.";
          });

          seg6.addEventListener('click', () => {
            seg6.classList.add('active-decode');
            seg5.classList.remove('active-decode');
            title.innerText = "⭐ Temporal Cohesive Devices";
            title.style.borderBottom = '3px solid var(--orange)';
            content.innerHTML = "\\<strong\\>Feature:\\</strong\\> Sequential Conjunctions ('Then')\\<br\\>\\<br\\>\\<strong\\>Precise Effect:\\</strong\\> 'Then' acts as a temporal signpost, linking the initial drawback of water immediately to the impact of the wave, creating narrative-like tension and clarity in a factual text.";
          });
        })();
      </script>
    </div>
    
    <!-- Slide 7: Model Part 5: Inundation & Visual Comparison (theme-light) -->
    <div class="slide theme-light standard-only" id="slide7">
      <h2 class="slide-title">05. Inundation & Visual Organizer</h2>
      <div class="content fade-in-up delay-1">
        <p class="intro-text"><strong>Modeling Goal:</strong> Evaluate language choices and how comparison tables multiply meaning.</p>
        
        <div class="annotations-grid" style="grid-template-columns: 1.1fr 0.9fr; margin-top: 10px;">
          <div class="text-workspace" style="font-size: 20px; line-height: 1.6; background-color: var(--pure-white); border: 3px solid var(--navy); border-radius: 8px; box-shadow: 6px 6px 0px rgba(17,45,78,0.1); padding: 20px; max-height: 380px; overflow-y: auto; color: var(--text-dark);">
            <p>When the waves reach land, they cause severe <span class="decodable-segment" id="seg7" style="background-color: var(--blue-light); border-bottom: 2px dashed var(--orange); padding: 0 4px; cursor: pointer; border-radius: 2px; font-weight: 500;">inundation (extreme flooding)</span>. Tsunamis strip away sand, destroy buildings, and wash away cars.</p>
            
            <table style="width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 16px;">
              <thead>
                <tr style="background-color: var(--navy); color: var(--white);">
                  <th style="padding: 8px; border: 1px solid var(--border-color);">Feature</th>
                  <th style="padding: 8px; border: 1px solid var(--border-color);">Deep Ocean</th>
                  <th style="padding: 8px; border: 1px solid var(--border-color);">Shallow Shore</th>
                </tr>
              </thead>
              <tbody>
                <tr style="background-color: #f8fafc;">
                  <td style="padding: 8px; border: 1px solid var(--border-color);"><strong>Wave Speed</strong></td>
                  <td style="padding: 8px; border: 1px solid var(--border-color);">Exceeds 800 km/h</td>
                  <td style="padding: 8px; border: 1px solid var(--border-color);">Drops to 50 km/h</td>
                </tr>
                <tr>
                  <td style="padding: 8px; border: 1px solid var(--border-color);"><strong>Wave Height</strong></td>
                  <td style="padding: 8px; border: 1px solid var(--border-color);">Less than 1 metre</td>
                  <td style="padding: 8px; border: 1px solid var(--border-color);">Grows up to 30 m</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div class="annotation-sidebar" id="decodeInfoCard5" style="min-height: 250px; justify-content: center; align-items: center; text-align: center; color: var(--text-dark); background-color: var(--pure-white); border: 3px solid var(--navy); border-radius: 8px; box-shadow: 6px 6px 0px rgba(17,45,78,0.1); padding: 20px; display: flex; flex-direction: column;">
            <h3 class="sidebar-header" id="decodeTitle5" style="border-bottom: none; font-size: 20px; font-weight: bold; color: var(--navy); margin-bottom: 12px;">Q8 & Q9: Language & Visuals</h3>
            <div class="sidebar-content" id="decodeContent5" style="font-size: 15px; line-height: 1.5; text-align: left;">
              <p style="margin-bottom: 10px;"><strong>Q8 (Language):</strong> Action verbs ('strip', 'destroy', 'wash') create vivid descriptions of destruction.</p>
              <p style="margin-bottom: 10px;"><strong>Q9 (Visual Feature):</strong> The comparison table maps deep vs. shallow wave speed and height, making data easy to scan and compare.</p>
              <p><em>Click the underlined text to analyze language.</em></p>
            </div>
          </div>
        </div>
        
        <div class="teacher-notes" style="display:none;">
          <strong>Teacher Notes - Modelling:</strong>
          <p>Explain how the table acts as a visual organizer. Instead of reading two separate paragraphs of numbers, the reader can scan across the rows to compare speeds and heights immediately.</p>
        </div>
      </div>
      <script>
        (function() {
          const title = document.getElementById('decodeTitle5');
          const content = document.getElementById('decodeContent5');
          const seg7 = document.getElementById('seg7');

          seg7.addEventListener('click', () => {
            seg7.classList.add('active-decode');
            title.innerText = "⭐ Verbs of Action & Destruction";
            title.style.borderBottom = '3px solid var(--orange)';
            content.innerHTML = "\\<strong\\>Feature:\\</strong\\> Precise Active Verbs\\<br\\>\\<em\\>\\"strip away sand, destroy buildings, wash away cars\\"\\</em\\>\\<br\\>\\<br\\>\\<strong\\>Precise Effect:\\</strong\\> Using strong, active verbs in a list demonstrates the physical power and violent nature of a tsunami's landing, replacing passive descriptions with direct action.";
          });
        })();
      </script>
    </div>
    
    <!-- Slide 8: Lucas Pathway: Structure Patrol (theme-light) -->
    <div class="slide theme-light lucas-only" id="slide8">
      <h2 class="slide-title">Lucas: Web Page Structure Patrol</h2>
      <div class="content fade-in-up delay-1">
        <p class="intro-text" style="font-size: 28px;">With your helper, click the correct parts of our tsunami website mockup!</p>
        
        <div class="lucas-stage" style="display: grid; grid-template-columns: 1.3fr 0.7fr; gap: 25px; margin-top: 15px;">
          <div class="website-mockup" id="lucasMockup" style="max-height: 400px; padding: 25px; background-color: var(--pure-white); border: 3px dashed var(--navy); border-radius: 8px; box-shadow: 6px 6px 0px rgba(17,45,78,0.1); position: relative;">
            <div class="mock-header" id="lucasTitle" style="font-size: 28px; font-weight: bold; background-color: #e8f4f8; margin-bottom: 20px; border: 2px solid var(--navy); border-radius: 6px; padding: 10px; text-align: center; cursor: pointer; transition: all 0.2s ease;">
              TSUNAMI WAVES: SCIENCE REPORT
            </div>
            
            <div class="mock-content-row" style="display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 15px;">
              <div class="mock-body-card" style="font-size: 18px; padding: 15px; background-color: #f8fafc; border: 2px solid var(--navy); border-radius: 6px; color: #475569;">
                <div id="lucasHeading" style="font-weight: bold; font-size: 20px; color: var(--wave-cyan); margin-bottom: 8px; border-bottom: 2px solid var(--wave-cyan); padding-bottom: 4px; cursor: pointer; text-align: center; transition: all 0.2s ease;">
                  01. GIANT OCEAN WAVES
                </div>
                Tsunami waves are giant walls of water. They move very fast.
              </div>
              
              <div class="mock-image-container" id="lucasDiagram" style="height: 140px; border: 2px solid var(--navy); border-radius: 6px; overflow: hidden; position: relative; cursor: pointer; transition: all 0.2s ease; display: flex; flex-direction: column; justify-content: center; align-items: center;">
                <img src="Tsunami_Reading/wave_shoaling.jpg" alt="Tsunami Wave Diagram" style="width: 100%; height: 100%; object-fit: cover;">
                <div class="mock-caption" id="lucasCaption" style="position: absolute; bottom: 0; left: 0; right: 0; background: rgba(255,255,255,0.9); font-size: 12px; padding: 4px; border-top: 1px solid var(--navy); text-align: center; color: var(--navy); font-weight: bold;">Figure 1: Waves growing tall near land</div>
              </div>
            </div>
          </div>
          
          <div class="lucas-coach-card" style="min-height: 250px; justify-content: center; align-items: center; text-align: center; background-color: var(--pure-white); border: 3px solid var(--navy); box-shadow: 6px 6px 0px rgba(17,45,78,0.1); border-radius: 8px; padding: 25px; display: flex; flex-direction: column;">
            <h3 class="info-title" id="lucasCoachTitle" style="border-bottom: none; font-size: 26px; font-weight: 700; color: var(--navy); margin-bottom: 12px; text-transform: uppercase;">Web Structure Patrol</h3>
            <div class="info-detail-box" id="lucasCoachDetail" style="font-size: 22px; margin-top: 10px;">
              Click the **Website Title**, the **Section Heading**, or the **Tsunami Diagram** to complete your checklist!
            </div>
          </div>
        </div>
      </div>
      <script>
        (function() {
          const title = document.getElementById('lucasTitle');
          const heading = document.getElementById('lucasHeading');
          const diag = document.getElementById('lucasDiagram');
          const coachTitle = document.getElementById('lucasCoachTitle');
          const coachDetail = document.getElementById('lucasCoachDetail');

          title.addEventListener('click', () => {
            title.classList.toggle('circled');
            if (title.classList.contains('circled')) {
              coachTitle.innerText = "⭐ Title Patrol Successful!";
              coachDetail.innerText = "Awesome! You found the main Website Title. It tells us the big topic in large letters!";
            }
          });

          heading.addEventListener('click', () => {
            heading.classList.toggle('circled');
            if (heading.classList.contains('circled')) {
              coachTitle.innerText = "⭐ Heading Patrol Successful!";
              coachDetail.innerText = "Excellent! You found the Section Heading. It tells us we are starting a new section!";
            }
          });

          diag.addEventListener('click', () => {
            diag.classList.toggle('circled');
            if (diag.classList.contains('circled')) {
              coachTitle.innerText = "⭐ Diagram Patrol Successful!";
              coachDetail.innerText = "Superb! You found the Tsunami Diagram. Pictures and drawings help us see how waves approach land!";
            }
          });

          // Show Answer override listener
          document.getElementById('slide8').addEventListener('show-answer', () => {
            title.classList.add('circled');
            heading.classList.add('circled');
            diag.classList.add('circled');
            coachTitle.innerText = "⭐ Full Patrol Completed!";
            coachDetail.innerText = "Wonderful work! You found the Title, Heading, and Diagram! You are a master website structural detective!";
          });
        })();
      </script>
    </div>
  `;
  
  // Replace standard placeholder
  let finalContent = templateContent.replace('<!-- SLIDES GO HERE DURING DYNAMIC COMPILATION -->', slidesContent);
  
  // Update page title and add SEO metadata
  finalContent = finalContent.replace('<title>Classroom Presentation Template</title>', `
    <title>Lesson 25.2: Causes and Effects of Tsunamis & Assessment Preparation</title>
    <meta name="description" content="Interactive classroom slide presentation for Year 5 English Unit 2 Lesson 25.2 on Tsunamis.">
    <meta property="og:title" content="Lesson 25.2: Causes and Effects of Tsunamis & Assessment Preparation">
    <meta property="og:description" content="Interactive classroom slide presentation for Year 5 English Unit 2 Lesson 25.2 on Tsunamis.">
    <meta property="og:type" content="website">
  `);
  
  // Write compiled slides file
  fs.writeFileSync(outputPath, finalContent, 'utf8');
  console.log("🎉 Standalone Interactive Presentation compiled successfully!");
}

compile();
