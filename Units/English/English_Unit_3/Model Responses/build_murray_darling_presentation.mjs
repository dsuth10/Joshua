import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const compilerPath = path.resolve(__dirname, '../../../../.agent/skills/classroom-presentation/scripts/build_presentation.mjs');
const { compilePresentation } = await import(`file://${compilerPath.replace(/\\/g, '/')}`);

const slidesHtml = `
<!-- Slide 1: Title Slide -->
<section class="slide theme-dark active" id="slide-1" style="background: linear-gradient(135deg, #0F3854 0%, #1E6B7B 100%); color: #ffffff;">
  <div style="display: flex; flex-direction: column; height: 100%; justify-content: center; align-items: center; text-align: center; padding: 20px;">
    <span style="background: rgba(217, 130, 43, 0.25); border: 2px solid #D9822B; color: #FCD34D; padding: 10px 28px; border-radius: 30px; font-weight: 700; letter-spacing: 1px; margin-bottom: 24px; font-size: 22px; text-transform: uppercase;">
      English Unit 3 • Assessment Task 3 Model
    </span>

    <!-- Standard Pathway Title -->
    <div class="standard-only">
      <h1 style="font-size: 56px; font-weight: 700; line-height: 1.15; margin-bottom: 24px; max-width: 1100px; color: #ffffff;">
        Lifeline of Our Continent: Deconstructing an A-Standard Persuasive Text
      </h1>
      <p style="font-size: 32px; color: #E0F2FE; max-width: 950px; margin-bottom: 44px; font-weight: 400; line-height: 1.4;">
        Exploring Persuasive Writing, Authoritative Evidence, and Oral Delivery through the Protection of the Murray-Darling Basin
      </p>
    </div>

    <!-- Support Pathway Title (Calibrated for lower reading complexity) -->
    <div class="lucas-only">
      <h1 style="font-size: 56px; font-weight: 700; line-height: 1.15; margin-bottom: 24px; max-width: 1100px; color: #ffffff;">
        Saving Australia's Great River: How to Write a Winning Persuasive Essay
      </h1>
      <p style="font-size: 32px; color: #E0F2FE; max-width: 950px; margin-bottom: 44px; font-weight: 400; line-height: 1.4;">
        Learn how to plan, write, and present a powerful story to protect our Murray-Darling River
      </p>
    </div>

    <div style="display: flex; gap: 24px; align-items: center;">
      <div style="background: rgba(255, 255, 255, 0.1); border-left: 5px solid #D9822B; padding: 14px 28px; text-align: left; border-radius: 6px;">
        <div style="font-size: 18px; color: #94A3B8; text-transform: uppercase; font-weight: 700;">Task Component</div>
        <div style="font-size: 24px; color: #ffffff; font-weight: 600;">Part A: Written Essay &amp; Part B: Presentation</div>
      </div>
      <div style="background: rgba(255, 255, 255, 0.1); border-left: 5px solid #38BDF8; padding: 14px 28px; text-align: left; border-radius: 6px;">
        <div style="font-size: 18px; color: #94A3B8; text-transform: uppercase; font-weight: 700;">Curriculum Alignment</div>
        <div style="font-size: 24px; color: #ffffff; font-weight: 600;">AC9E5LE01 / AC9E6LE01 (AC v9)</div>
      </div>
    </div>
  </div>

  <div class="teacher-notes" style="display: none;">
    <h3>Teacher Notes &amp; Lesson Logistics</h3>
    <p><strong>DO:</strong> Project slide 1 as students enter. Ensure writing notebooks and highlighters are ready. Use top-right neutral toggle switch to alternate reading pathways silently.</p>
    <p><strong>WORK:</strong> Introduce lesson objective: analyzing an exemplar persuasive essay on the Murray-Darling Basin to learn how to construct their own assessment essay.</p>
    <p><strong>RECORD:</strong> Students note down key assessment success criteria in their workbooks.</p>
    <p><strong>FINISH:</strong> 2 minutes previewing the slide journey.</p>
    <p><strong>CHECK:</strong> Confirm all students understand the two assessment parts (Part A Written + Part B Spoken).</p>
  </div>
</section>

<!-- Slide 2: The Hook & Introduction Analysis -->
<section class="slide theme-light" id="slide-2">
  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
    <h2 style="font-size: 44px; color: #0F3854; margin: 0; font-weight: 700;">Slide 2: Deconstructing the Introduction (The Hook &amp; Thesis)</h2>
    <span style="background: #E0F2FE; color: #0369A1; padding: 8px 20px; border-radius: 20px; font-weight: 700; font-size: 20px;">Part A Focus: Paragraph 1</span>
  </div>

  <div style="display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 30px; height: calc(100% - 100px);">
    <!-- Left Column: Essay Text -->
    <div style="background: #F8FAFC; border: 2px solid #CBD5E1; border-radius: 12px; padding: 28px; display: flex; flex-direction: column; justify-content: space-between;">
      <div>
        <h3 style="font-size: 28px; color: #0F3854; margin-bottom: 18px; font-weight: 700;">Exemplar Paragraph 1 (Introduction)</h3>
        
        <!-- Standard Pathway Text -->
        <div class="standard-only">
          <p style="font-size: 26px; line-height: 1.6; color: #1E293B;">
            <span class="highlight-target hook-text-std" style="padding: 2px 6px; border-radius: 4px; transition: all 0.3s; cursor: pointer;" onclick="highlightSectionStd('hook')">
              Imagine standing on the banks of a mighty Australian river, watching crystal-clear water flow past ancient red gums while pelicans glide gracefully across the surface. Now, contrast that vibrant scene with a cracked, dry riverbed littered with millions of decaying native fish.
            </span>
            <span class="highlight-target context-text-std" style="padding: 2px 6px; border-radius: 4px; transition: all 0.3s; cursor: pointer;" onclick="highlightSectionStd('context')">
              This environmental tragedy is occurring right now across the Murray-Darling Basin—the lifeblood of our continent. Spanning over one million square kilometres across four states, this vital river system is suffocating due to severe water over-extraction, climate stress, and industrial mismanagement.
            </span>
            <span class="highlight-target thesis-text-std" style="padding: 2px 6px; border-radius: 4px; transition: all 0.3s; cursor: pointer;" onclick="highlightSectionStd('thesis')">
              To safeguard Australia’s water security, protect iconic wildlife, and honor First Nations heritage, we must urgently restore environmental river flows and enforce strict water buybacks.
            </span>
          </p>
        </div>

        <!-- Support Pathway Text (Year 3 Calibrated) -->
        <div class="lucas-only">
          <p style="font-size: 26px; line-height: 1.6; color: #1E293B;">
            <span class="highlight-target hook-text-luc" style="padding: 2px 6px; border-radius: 4px; transition: all 0.3s; cursor: pointer;" onclick="highlightSectionLuc('hook')">
              Picture a beautiful river full of big gum trees and flying pelicans. Now imagine the river turning completely dry, with dead fish lying on the muddy ground.
            </span>
            <span class="highlight-target context-text-luc" style="padding: 2px 6px; border-radius: 4px; transition: all 0.3s; cursor: pointer;" onclick="highlightSectionLuc('context')">
              This sad problem is happening right now in Australia's Murray-Darling River. The river is running out of water because big farms take too much water out of the river.
            </span>
            <span class="highlight-target thesis-text-luc" style="padding: 2px 6px; border-radius: 4px; transition: all 0.3s; cursor: pointer;" onclick="highlightSectionLuc('thesis')">
              We need to save our river right now by putting clean water back into the river and stopping people from taking too much water.
            </span>
          </p>
        </div>

      </div>
      <div style="background: #FEF3C7; border-left: 5px solid #D97706; padding: 14px; border-radius: 6px; font-size: 20px; color: #92400E; font-weight: 500;">
        💡 <strong>Interactive Challenge:</strong> Click on the text segments on the left to identify the 3 vital building blocks of a great introduction!
      </div>
    </div>

    <!-- Right Column: Interactive Analysis Activity -->
    <div style="background: #FFFFFF; border: 2px solid #0F3854; border-radius: 12px; padding: 28px; display: flex; flex-direction: column; justify-content: space-between;">
      <div>
        <h3 style="font-size: 28px; color: #0F3854; margin-bottom: 18px; font-weight: 700;">Student Activity: Introduction Blueprint</h3>
        
        <div id="info-hook" class="info-card" style="background: #EFF6FF; border-left: 6px solid #2563EB; padding: 18px; margin-bottom: 16px; border-radius: 8px;">
          <h4 style="font-size: 22px; color: #1E40AF; margin-bottom: 6px; font-weight: 700;">1. The Sensory Hook (Catch the Reader)</h4>
          <p style="font-size: 20px; color: #1E293B; line-height: 1.5;">Paints a vivid picture comparing a healthy river with a dry river to grab reader emotion.</p>
        </div>

        <div id="info-context" class="info-card" style="background: #F0FDF4; border-left: 6px solid #16A34A; padding: 18px; margin-bottom: 16px; border-radius: 8px;">
          <h4 style="font-size: 22px; color: #166534; margin-bottom: 6px; font-weight: 700;">2. Background Context (The Big Problem)</h4>
          <p style="font-size: 20px; color: #1E293B; line-height: 1.5;">Explains where the story takes place and why the river is in trouble.</p>
        </div>

        <div id="info-thesis" class="info-card" style="background: #FEF2F2; border-left: 6px solid #DC2626; padding: 18px; margin-bottom: 16px; border-radius: 8px;">
          <h4 style="font-size: 22px; color: #991B1B; margin-bottom: 6px; font-weight: 700;">3. Clear Stance (Your Opinion)</h4>
          <p style="font-size: 20px; color: #1E293B; line-height: 1.5;">States your opinion loud and clear using strong action words (<em>must save, protect now</em>).</p>
        </div>
      </div>

      <div style="background: #F1F5F9; padding: 18px; border-radius: 8px; border: 1px solid #CBD5E1;">
        <h4 style="font-size: 20px; color: #0F3854; font-weight: 700; margin-bottom: 6px;">✍️ Constructing Your Own Essay:</h4>
        <p style="font-size: 20px; color: #334155; line-height: 1.5;">Never start with 'I am going to talk about...'. Start with a cool picture or question, explain the problem, then state your clear opinion!</p>
      </div>
    </div>
  </div>

  <div class="teacher-notes" style="display: none;">
    <h3>Teacher Notes — Introduction Analysis</h3>
    <p><strong>DO:</strong> Guide students to click or identify the 3 colors of the introduction (Blue = Hook, Green = Context, Red = Thesis).</p>
    <p><strong>WORK:</strong> Have students highlight these three parts in their own draft introductions using 3 colored markers.</p>
    <p><strong>RECORD:</strong> Students write down the rule: <em>Hook + Context + Thesis = Perfect Introduction</em>.</p>
    <p><strong>CHECK:</strong> Ask 2 students to share their hook idea for their chosen topic.</p>
  </div>
</section>

<!-- Slide 3: Body Paragraph 1 Analysis (Evidence & Authority) -->
<section class="slide theme-light" id="slide-3">
  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
    <h2 style="font-size: 44px; color: #0F3854; margin: 0; font-weight: 700;">Slide 3: Body Paragraph 1 (Authoritative Research &amp; Data)</h2>
    <span style="background: #FEF3C7; color: #92400E; padding: 8px 20px; border-radius: 20px; font-weight: 700; font-size: 20px;">Part A Focus: Paragraph 2</span>
  </div>

  <div style="display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 30px; height: calc(100% - 100px);">
    <!-- Left Column: Paragraph Text -->
    <div style="background: #F8FAFC; border: 2px solid #CBD5E1; border-radius: 12px; padding: 28px; display: flex; flex-direction: column; justify-content: space-between;">
      <div>
        <h3 style="font-size: 28px; color: #0F3854; margin-bottom: 16px; font-weight: 700;">Exemplar Paragraph 2 (Water Extraction)</h3>
        
        <!-- Standard Pathway Text -->
        <div class="standard-only">
          <p style="font-size: 25px; line-height: 1.6; color: #1E293B;">
            <strong style="color: #0F3854; background: #DBEAFE; padding: 2px 6px; border-radius: 4px;">First and foremost, excessive water extraction for large-scale industrial irrigation is driving the Murray-Darling Basin to ecological collapse.</strong> 
            According to scientific reports from the CSIRO and the Murray-Darling Basin Authority (MDBA), decades of over-allocating water licenses to massive cotton and rice operations have starved downstream river systems. 
            In recent years, lower water flows and toxic blue-green algae blooms caused catastrophic mass fish kills at Menindee Lakes, destroying millions of native Murray cod and golden perch in a single week. 
            <em style="color: #991B1B; background: #FEE2E2; padding: 2px 6px; border-radius: 4px;">The Australian Academy of Science warned that without immediate increases in environmental water allocations, these devastating ecological collapses will become permanent.</em> 
            <strong style="color: #4338CA;">Can we truly sit back and allow Australia's greatest river system to turn into a dusty drain?</strong>
          </p>
        </div>

        <!-- Support Pathway Text (Year 3 Calibrated) -->
        <div class="lucas-only">
          <p style="font-size: 25px; line-height: 1.6; color: #1E293B;">
            <strong style="color: #0F3854; background: #DBEAFE; padding: 2px 6px; border-radius: 4px;">First, taking too much water out of the river is killing our fish and trees.</strong> 
            Scientists from the CSIRO found that big farms take too much water out of the river. 
            When the river dried up at Menindee Lakes, millions of native Murray cod fish died in just one week. 
            <em style="color: #991B1B; background: #FEE2E2; padding: 2px 6px; border-radius: 4px;">Science experts warn that if we do not put water back into the river, the river will dry up forever.</em> 
            <strong style="color: #4338CA;">Will we stand by and watch our giant river turn into dirt?</strong>
          </p>
        </div>

      </div>

      <div style="background: #F0F9FF; border-left: 5px solid #0284C7; padding: 16px; border-radius: 6px; font-size: 20px; color: #0369A1;">
        🔍 <strong>Notice:</strong> Topic Sentence (Blue) ➔ Scientist Facts (CSIRO/MDBA) ➔ Real Event Evidence ➔ Expert Warning (Red) ➔ Rhetorical Question (Purple).
      </div>
    </div>

    <!-- Right Column: Interactive Evidence Matching -->
    <div style="background: #FFFFFF; border: 2px solid #0F3854; border-radius: 12px; padding: 28px; display: flex; flex-direction: column; justify-content: space-between;">
      <div>
        <h3 style="font-size: 28px; color: #0F3854; margin-bottom: 18px; font-weight: 700;">Student Activity: Building Evidence Strength</h3>
        
        <div style="display: flex; flex-direction: column; gap: 14px;">
          <div style="border: 1px solid #CBD5E1; padding: 14px; border-radius: 8px; background: #F8FAFC;">
            <span style="font-weight: 700; color: #1D4ED8; font-size: 18px;">1. WEAK ASSERTION:</span>
            <p style="font-size: 19px; color: #475569; margin: 4px 0 0 0; line-height: 1.4;">"People take too much water and it kills fish." (No proof, bare claim)</p>
          </div>

          <div style="border: 2px solid #16A34A; padding: 14px; border-radius: 8px; background: #F0FDF4;">
            <span style="font-weight: 700; color: #15803D; font-size: 18px;">2. STRONG EVIDENCE (Exemplar):</span>
            <p style="font-size: 19px; color: #166534; margin: 4px 0 0 0; line-height: 1.4;">"According to scientists from the CSIRO... mass fish kills at Menindee Lakes destroyed millions of native fish in one week."</p>
          </div>
        </div>

        <div style="margin-top: 18px; background: #EFF6FF; padding: 16px; border-radius: 8px; border-left: 5px solid #2563EB;">
          <h4 style="font-size: 20px; color: #1E40AF; font-weight: 700; margin-bottom: 6px;">💡 Authoritative Source Bank for Students:</h4>
          <ul style="font-size: 19px; color: #1E293B; margin-left: 24px; line-height: 1.5;">
            <li>Scientists &amp; Researchers (CSIRO, Universities)</li>
            <li>Environment Groups (WWF, Wildlife Rescue)</li>
            <li>Government Reports &amp; Real Events</li>
          </ul>
        </div>
      </div>

      <div style="background: #F1F5F9; padding: 16px; border-radius: 8px;">
        <h4 style="font-size: 20px; color: #0F3854; font-weight: 700; margin-bottom: 4px;">✍️ Construction Rule for Your Essay:</h4>
        <p style="font-size: 19px; color: #334155; line-height: 1.4;">Every body paragraph MUST include at least ONE named expert source or real fact. Never rely on empty claims!</p>
      </div>
    </div>
  </div>

  <div class="teacher-notes" style="display: none;">
    <h3>Teacher Notes — Body Paragraph 1 Analysis</h3>
    <p><strong>DO:</strong> Emphasize the difference between a bare assertion ("Water extraction is bad") and authoritative evidence ("CSIRO scientists state...").</p>
    <p><strong>WORK:</strong> Ask students to identify authoritative sources they can cite for their own negotiated persuasive topics.</p>
    <p><strong>RECORD:</strong> Students write down 2 authoritative organisations relevant to their topic.</p>
    <p><strong>CHECK:</strong> Call on 3 students to name their authority sources.</p>
  </div>
</section>

<!-- Slide 4: Body Paragraph 2 Analysis (Biodiversity & Cultural Heritage) -->
<section class="slide theme-light" id="slide-4">
  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
    <h2 style="font-size: 44px; color: #0F3854; margin: 0; font-weight: 700;">Slide 4: Body Paragraph 2 (Multi-Perspective Arguments)</h2>
    <span style="background: #DCFCE7; color: #15803D; padding: 8px 20px; border-radius: 20px; font-weight: 700; font-size: 20px;">Part A Focus: Paragraph 3</span>
  </div>

  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; height: calc(100% - 100px);">
    <!-- Left Column: Essay Text -->
    <div style="background: #F8FAFC; border: 2px solid #CBD5E1; border-radius: 12px; padding: 28px; display: flex; flex-direction: column; justify-content: space-between;">
      <div>
        <h3 style="font-size: 28px; color: #0F3854; margin-bottom: 16px; font-weight: 700;">Exemplar Paragraph 3 (Biodiversity &amp; Cultural Heritage)</h3>
        
        <!-- Standard Pathway Text -->
        <div class="standard-only">
          <p style="font-size: 25px; line-height: 1.6; color: #1E293B;">
            <strong style="color: #0F3854; background: #E0E7FF; padding: 2px 6px; border-radius: 4px;">Furthermore, preserving the Murray-Darling Basin is essential to protect native biodiversity and sacred Cultural Water rights.</strong> 
            The Basin’s internationally recognized wetlands, such as the Macquarie Marshes and the Coorong, provide critical breeding grounds for over 120 waterbird species and endangered native animals. 
            For Indigenous First Nations communities, including the Barkandji people who have cared for the Baaka (Darling River) for over 65,000 years, the river is a sacred living ancestor. 
            When river channels dry up, ancient cultural traditions, traditional food sources, and community health are severely damaged. 
            <strong style="color: #166534; background: #DCFCE7; padding: 2px 6px; border-radius: 4px;">Restoring natural river flows is not merely an environmental responsibility; it is a fundamental act of cultural justice.</strong>
          </p>
        </div>

        <!-- Support Pathway Text (Year 3 Calibrated) -->
        <div class="lucas-only">
          <p style="font-size: 25px; line-height: 1.6; color: #1E293B;">
            <strong style="color: #0F3854; background: #E0E7FF; padding: 2px 6px; border-radius: 4px;">Second, we must keep the river full to protect wild animals and respect First Nations people.</strong> 
            Wetlands give safe homes to over 120 types of waterbirds. 
            Indigenous Barkandji people have loved and looked after the Baaka River for over 65,000 years. 
            When the river dries up, animals lose their homes and ancient cultural traditions are hurt. 
            <strong style="color: #166534; background: #DCFCE7; padding: 2px 6px; border-radius: 4px;">Saving the river protects both animals and First Nations culture.</strong>
          </p>
        </div>

      </div>

      <div style="background: #FEF2F2; border-left: 5px solid #EF4444; padding: 16px; border-radius: 6px; font-size: 20px; color: #991B1B;">
        🌿 <strong>Key Insight:</strong> Combining environmental impacts (wildlife/wetlands) with cultural heritage (Barkandji First Nations) makes the argument far stronger!
      </div>
    </div>

    <!-- Right Column: Interactive Multi-Perspective Analyzer -->
    <div style="background: #FFFFFF; border: 2px solid #0F3854; border-radius: 12px; padding: 28px; display: flex; flex-direction: column; justify-content: space-between;">
      <div>
        <h3 style="font-size: 28px; color: #0F3854; margin-bottom: 18px; font-weight: 700;">Student Activity: Dual-Perspective Strategy</h3>
        
        <div style="display: flex; flex-direction: column; gap: 16px;">
          <div style="background: #F0FDF4; border: 2px solid #22C55E; padding: 18px; border-radius: 8px;">
            <h4 style="font-size: 22px; color: #15803D; font-weight: 700; margin-bottom: 6px;">Perspective A: Environmental &amp; Animal Impact</h4>
            <p style="font-size: 19px; color: #166534; margin: 0; line-height: 1.4;">Macquarie Marshes &amp; Coorong wetlands ➔ 120+ waterbird species ➔ Protecting wildlife homes.</p>
          </div>

          <div style="background: #FFFBEB; border: 2px solid #F59E0B; padding: 18px; border-radius: 8px;">
            <h4 style="font-size: 22px; color: #B45309; font-weight: 700; margin-bottom: 6px;">Perspective B: First Nations Cultural Heritage</h4>
            <p style="font-size: 19px; color: #78350F; margin: 0; line-height: 1.4;">Barkandji people ➔ Caring for the Baaka for 65,000+ years ➔ Sacred living ancestor ➔ Cultural respect.</p>
          </div>
        </div>

        <div style="margin-top: 18px; background: #F8FAFC; padding: 16px; border-radius: 8px; border: 1px dashed #64748B;">
          <span style="font-size: 19px; color: #334155; font-weight: 600;">✨ Vocabulary Spotlight:</span>
          <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-top: 10px;">
            <span style="background: #DBEAFE; color: #1E40AF; padding: 6px 14px; border-radius: 14px; font-size: 17px; font-weight: 600;">Cultural Water</span>
            <span style="background: #DBEAFE; color: #1E40AF; padding: 6px 14px; border-radius: 14px; font-size: 17px; font-weight: 600;">Wetlands</span>
            <span style="background: #DBEAFE; color: #1E40AF; padding: 6px 14px; border-radius: 14px; font-size: 17px; font-weight: 600;">Living Ancestor</span>
          </div>
        </div>
      </div>

      <div style="background: #F1F5F9; padding: 16px; border-radius: 8px;">
        <h4 style="font-size: 20px; color: #0F3854; font-weight: 700; margin-bottom: 4px;">✍️ Construction Rule for Your Essay:</h4>
        <p style="font-size: 19px; color: #334155; line-height: 1.4;">Look beyond just one idea. Combine animal/nature reasons with human or cultural reasons for a winning argument!</p>
      </div>
    </div>
  </div>

  <div class="teacher-notes" style="display: none;">
    <h3>Teacher Notes — Body Paragraph 2 Analysis</h3>
    <p><strong>DO:</strong> Highlight the inclusion of First Nations Cultural Water rights (Barkandji people and the Baaka River).</p>
    <p><strong>WORK:</strong> Discuss how incorporating human/cultural heritage elevates an essay from a C to an A standard.</p>
    <p><strong>RECORD:</strong> Students note down: <em>Multi-perspective arguments = deeper persuasive impact</em>.</p>
    <p><strong>CHECK:</strong> Have students brainstorm 2 different angles (e.g. social vs environmental) for their topic.</p>
  </div>
</section>

<!-- Slide 5: Body Paragraph 3 Analysis (Counterargument & Rebuttal) -->
<section class="slide theme-light" id="slide-5">
  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
    <h2 style="font-size: 44px; color: #0F3854; margin: 0; font-weight: 700;">Slide 5: Body Paragraph 3 (Counterargument &amp; Rebuttal)</h2>
    <span style="background: #FEE2E2; color: #991B1B; padding: 8px 20px; border-radius: 20px; font-weight: 700; font-size: 20px;">Part A Focus: Paragraph 4</span>
  </div>

  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; height: calc(100% - 100px);">
    <!-- Left Column: Essay Text -->
    <div style="background: #F8FAFC; border: 2px solid #CBD5E1; border-radius: 12px; padding: 28px; display: flex; flex-direction: column; justify-content: space-between;">
      <div>
        <h3 style="font-size: 28px; color: #0F3854; margin-bottom: 16px; font-weight: 700;">Exemplar Paragraph 4 (Rebutting Irrigation Claims)</h3>
        
        <!-- Standard Pathway Text -->
        <div class="standard-only">
          <p style="font-size: 25px; line-height: 1.6; color: #1E293B;">
            <span style="background: #FEF3C7; color: #92400E; padding: 2px 6px; border-radius: 4px; font-weight: 600;">Some agricultural lobbyists argue that reducing irrigation water allocations will harm regional farming communities and reduce food production.</span> 
            <span style="background: #E0E7FF; color: #3730A3; padding: 2px 6px; border-radius: 4px;">While supporting primary producers is important, continuing to over-extract water from a dying river system is an unsustainable disaster.</span> 
            Scientific economic studies demonstrate that voluntary government water buybacks, combined with investments in water-efficient technology and drought-tolerant crops, protect regional economies without destroying river health. 
            <strong style="color: #991B1B; background: #FEE2E2; padding: 2px 6px; border-radius: 4px;">If the river dies, farming towns will perish too. Protecting environmental water flows ensures that both agriculture and nature can thrive together for generations to come.</strong>
          </p>
        </div>

        <!-- Support Pathway Text (Year 3 Calibrated) -->
        <div class="lucas-only">
          <p style="font-size: 25px; line-height: 1.6; color: #1E293B;">
            <span style="background: #FEF3C7; color: #92400E; padding: 2px 6px; border-radius: 4px; font-weight: 600;">Some people say that farmers need all the river water to grow food.</span> 
            <span style="background: #E0E7FF; color: #3730A3; padding: 2px 6px; border-radius: 4px;">It is true that farming is important.</span> 
            But if the river completely dries up, farmers will have no water left anyway! 
            <strong style="color: #991B1B; background: #FEE2E2; padding: 2px 6px; border-radius: 4px;">Buying back water for the river helps both farmers and nature stay alive together.</strong>
          </p>
        </div>

      </div>

      <div style="background: #EFF6FF; border-left: 5px solid #3B82F6; padding: 16px; border-radius: 6px; font-size: 20px; color: #1E40AF;">
        🎯 <strong>The 3-Step Rebuttal Formula:</strong> Opposing View (Yellow) ➔ Concession (Blue) ➔ Sharp Rebuttal &amp; Solution (Red).
      </div>
    </div>

    <!-- Right Column: Interactive Rebuttal Masterclass -->
    <div style="background: #FFFFFF; border: 2px solid #0F3854; border-radius: 12px; padding: 28px; display: flex; flex-direction: column; justify-content: space-between;">
      <div>
        <h3 style="font-size: 28px; color: #0F3854; margin-bottom: 18px; font-weight: 700;">Student Activity: Master the Rebuttal</h3>
        
        <div style="display: flex; flex-direction: column; gap: 14px;">
          <div style="background: #FFFBEB; border-left: 5px solid #F59E0B; padding: 14px; border-radius: 6px;">
            <h4 style="font-size: 20px; color: #92400E; font-weight: 700; margin-bottom: 4px;">Step 1: State Opposing View Fairly</h4>
            <p style="font-size: 18px; color: #78350F; margin: 0; line-height: 1.4;">"Some people say farmers need all the river water..."</p>
          </div>

          <div style="background: #EFF6FF; border-left: 5px solid #3B82F6; padding: 14px; border-radius: 6px;">
            <h4 style="font-size: 20px; color: #1E40AF; font-weight: 700; margin-bottom: 4px;">Step 2: Make a Brief Concession</h4>
            <p style="font-size: 18px; color: #1E3A8A; margin: 0; line-height: 1.4;">"It is true that farming is important..." (Shows fairness)</p>
          </div>

          <div style="background: #FEF2F2; border-left: 5px solid #EF4444; padding: 14px; border-radius: 6px;">
            <h4 style="font-size: 20px; color: #991B1B; font-weight: 700; margin-bottom: 4px;">Step 3: Deliver Strong Rebuttal &amp; Solution</h4>
            <p style="font-size: 18px; color: #7F1D1D; margin: 0; line-height: 1.4;">"If the river dries up, farmers have no water anyway... saving water helps both!"</p>
          </div>
        </div>
      </div>

      <div style="background: #F1F5F9; padding: 16px; border-radius: 8px;">
        <h4 style="font-size: 20px; color: #0F3854; font-weight: 700; margin-bottom: 4px;">✍️ Construction Rule for Your Essay:</h4>
        <p style="font-size: 19px; color: #334155; line-height: 1.4;">A great essay NEVER ignores the other side. Acknowledge what critics say, then explain why your solution is better long-term!</p>
      </div>
    </div>
  </div>

  <div class="teacher-notes" style="display: none;">
    <h3>Teacher Notes — Body Paragraph 3 Analysis</h3>
    <p><strong>DO:</strong> Explicitly model the 3-step rebuttal formula. Emphasize that acknowledging the counter-argument makes the author sound mature and credible.</p>
    <p><strong>WORK:</strong> Ask students to identify what critics might say about their chosen topic, and how to counter it.</p>
    <p><strong>RECORD:</strong> Students write down their topic's counter-argument and rebuttal sentence starter.</p>
    <p><strong>CHECK:</strong> Check 3 student rebuttals for logical strength.</p>
  </div>
</section>

<!-- Slide 6: Conclusion Analysis -->
<section class="slide theme-light" id="slide-6">
  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
    <h2 style="font-size: 44px; color: #0F3854; margin: 0; font-weight: 700;">Slide 6: Deconstructing the Conclusion (Final Call to Action)</h2>
    <span style="background: #F3E8FF; color: #6B21A8; padding: 8px 20px; border-radius: 20px; font-weight: 700; font-size: 20px;">Part A Focus: Paragraph 5</span>
  </div>

  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; height: calc(100% - 100px);">
    <!-- Left Column: Essay Text -->
    <div style="background: #F8FAFC; border: 2px solid #CBD5E1; border-radius: 12px; padding: 28px; display: flex; flex-direction: column; justify-content: space-between;">
      <div>
        <h3 style="font-size: 28px; color: #0F3854; margin-bottom: 16px; font-weight: 700;">Exemplar Paragraph 5 (Conclusion)</h3>
        
        <!-- Standard Pathway Text -->
        <div class="standard-only">
          <p style="font-size: 26px; line-height: 1.6; color: #1E293B;">
            <strong style="color: #6B21A8; background: #F3E8FF; padding: 2px 6px; border-radius: 4px;">In conclusion, restoring the Murray-Darling Basin is one of the most critical environmental challenges facing our nation.</strong> 
            By returning at least 450 gigalitres of water to environmental flows, enforcing strict extraction limits, and supporting sustainable farming, we can revive Australia’s greatest river system. 
            <em style="color: #991B1B;">We cannot allow greed and neglect to dry up the lifeblood of our country.</em> 
            <strong style="color: #0F3854; background: #FEF08A; padding: 2px 6px; border-radius: 4px;">The time for decisive action is right now—will you stand up to protect the Murray-Darling Basin before its rivers run dry forever?</strong>
          </p>
        </div>

        <!-- Support Pathway Text (Year 3 Calibrated) -->
        <div class="lucas-only">
          <p style="font-size: 26px; line-height: 1.6; color: #1E293B;">
            <strong style="color: #6B21A8; background: #F3E8FF; padding: 2px 6px; border-radius: 4px;">In conclusion, saving the Murray-Darling River is one of the most important jobs for Australia today.</strong> 
            We must put water back into the river and stop taking too much. 
            <em style="color: #991B1B;">We cannot let our greatest river die.</em> 
            <strong style="color: #0F3854; background: #FEF08A; padding: 2px 6px; border-radius: 4px;">The time to act is right now—will you help save our river before it is gone forever?</strong>
          </p>
        </div>

      </div>

      <div style="background: #FDF4FF; border-left: 5px solid #A855F7; padding: 16px; border-radius: 6px; font-size: 20px; color: #7E22CE;">
        🚀 <strong>Conclusion Formula:</strong> Re-state Stance (Purple) ➔ Summarise Key Actions ➔ Reminder Warning ➔ Final Call Question (Yellow).
      </div>
    </div>

    <!-- Right Column: Interactive Conclusion Builder -->
    <div style="background: #FFFFFF; border: 2px solid #0F3854; border-radius: 12px; padding: 28px; display: flex; flex-direction: column; justify-content: space-between;">
      <div>
        <h3 style="font-size: 28px; color: #0F3854; margin-bottom: 18px; font-weight: 700;">Student Activity: Conclusion Checklist</h3>
        
        <div style="display: flex; flex-direction: column; gap: 14px;">
          <div style="display: flex; align-items: center; gap: 14px; background: #F8FAFC; padding: 14px; border-radius: 8px; border: 1px solid #E2E8F0;">
            <span style="background: #22C55E; color: white; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 20px;">✓</span>
            <span style="font-size: 20px; color: #1E293B; font-weight: 600;">Re-state opinion using fresh words</span>
          </div>

          <div style="display: flex; align-items: center; gap: 14px; background: #F8FAFC; padding: 14px; border-radius: 8px; border: 1px solid #E2E8F0;">
            <span style="background: #22C55E; color: white; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 20px;">✓</span>
            <span style="font-size: 20px; color: #1E293B; font-weight: 600;">Summarise core solutions (putting water back)</span>
          </div>

          <div style="display: flex; align-items: center; gap: 14px; background: #F8FAFC; padding: 14px; border-radius: 8px; border: 1px solid #E2E8F0;">
            <span style="background: #22C55E; color: white; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 20px;">✓</span>
            <span style="font-size: 20px; color: #1E293B; font-weight: 600;">Final Call to Action + Question</span>
          </div>
        </div>

        <div style="margin-top: 20px; background: #FEF2F2; padding: 16px; border-radius: 8px; border-left: 5px solid #EF4444;">
          <h4 style="font-size: 20px; color: #991B1B; font-weight: 700; margin-bottom: 4px;">❌ Common Conclusion Pitfalls:</h4>
          <p style="font-size: 18px; color: #7F1D1D; margin: 0; line-height: 1.4;">Never add NEW reasons in your conclusion. Never say 'Thanks for reading'. End with a strong challenge!</p>
        </div>
      </div>

      <div style="background: #F1F5F9; padding: 16px; border-radius: 8px;">
        <h4 style="font-size: 20px; color: #0F3854; font-weight: 700; margin-bottom: 4px;">✍️ Construction Rule for Your Essay:</h4>
        <p style="font-size: 19px; color: #334155; line-height: 1.4;">Your final sentence must stay in the reader's mind. Use a strong final question!</p>
      </div>
    </div>
  </div>

  <div class="teacher-notes" style="display: none;">
    <h3>Teacher Notes — Conclusion Analysis</h3>
    <p><strong>DO:</strong> Guide students to contrast a weak conclusion ("Thanks for reading my essay") with an A-Standard call to action.</p>
    <p><strong>WORK:</strong> Have students draft their final closing rhetorical question.</p>
    <p><strong>RECORD:</strong> Students write down their final call-to-action sentence.</p>
    <p><strong>CHECK:</strong> Hear 3 closing sentences from the class.</p>
  </div>
</section>

<!-- Slide 7: Part A Student Planning Sheet Blueprint -->
<section class="slide theme-light" id="slide-7">
  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
    <h2 style="font-size: 44px; color: #0F3854; margin: 0; font-weight: 700;">Slide 7: Part A Planning Sheet (Organising Your Research)</h2>
    <span style="background: #DBEAFE; color: #1E40AF; padding: 8px 20px; border-radius: 20px; font-weight: 700; font-size: 20px;">Planning Strategy</span>
  </div>

  <div style="height: calc(100% - 90px); overflow-y: auto;">
    <!-- Standard Pathway Table -->
    <div class="standard-only">
      <table style="width: 100%; border-collapse: collapse; background: #FFFFFF; border: 2px solid #0F3854; border-radius: 8px; font-size: 22px;">
        <thead>
          <tr style="background: #0F3854; color: #ffffff;">
            <th style="padding: 16px; text-align: left; width: 25%; font-size: 24px;">Planning Category</th>
            <th style="padding: 16px; text-align: left; width: 75%; font-size: 24px;">Exemplar Student Details (Murray-Darling Basin)</th>
          </tr>
        </thead>
        <tbody>
          <tr style="background: #F8FAFC; border-bottom: 1px solid #E2E8F0;">
            <td style="padding: 14px 16px; font-weight: 700; color: #0F3854;">Topic &amp; Stance</td>
            <td style="padding: 14px 16px; color: #1E293B;">Restoring the Murray-Darling Basin. Governments must enforce strict water buybacks, return environmental flows, and restrict industrial over-extraction.</td>
          </tr>
          <tr style="background: #FFFFFF; border-bottom: 1px solid #E2E8F0;">
            <td style="padding: 14px 16px; font-weight: 700; color: #0F3854;">Audience &amp; Formality</td>
            <td style="padding: 14px 16px; color: #1E293B;">School community, Australian citizens, and regional policy makers. Formal, passionate, urgent, and evidence-based tone.</td>
          </tr>
          <tr style="background: #F8FAFC; border-bottom: 1px solid #E2E8F0;">
            <td style="padding: 14px 16px; font-weight: 700; color: #0F3854;">Hook Strategy</td>
            <td style="padding: 14px 16px; color: #1E293B;">Sensory contrast: Pristine river red gums &amp; pelicans vs cracked dry riverbeds &amp; mass fish kills.</td>
          </tr>
          <tr style="background: #FFFFFF; border-bottom: 1px solid #E2E8F0;">
            <td style="padding: 14px 16px; font-weight: 700; color: #0F3854;">Argument 1 (Water Extraction)</td>
            <td style="padding: 14px 16px; color: #1E293B;">Excessive irrigation suffocates rivers. CSIRO &amp; MDBA data on over-allocation, Menindee Lakes fish kills, Academy of Science warnings.</td>
          </tr>
          <tr style="background: #F8FAFC; border-bottom: 1px solid #E2E8F0;">
            <td style="padding: 14px 16px; font-weight: 700; color: #0F3854;">Argument 2 (Biodiversity/Culture)</td>
            <td style="padding: 14px 16px; color: #1E293B;">120+ waterbird species in Macquarie Marshes &amp; Coorong. Barkandji First Nations caring for the Baaka (Darling River) for 65,000+ years.</td>
          </tr>
          <tr style="background: #FFFFFF; border-bottom: 1px solid #E2E8F0;">
            <td style="padding: 14px 16px; font-weight: 700; color: #0F3854;">Counterargument &amp; Rebuttal</td>
            <td style="padding: 14px 16px; color: #1E293B;">Counter: Irrigators claim cutting water harms farming jobs. Rebuttal: Dying river kills towns too; buybacks &amp; tech protect both farming &amp; rivers.</td>
          </tr>
          <tr style="background: #F8FAFC;">
            <td style="padding: 14px 16px; font-weight: 700; color: #0F3854;">Persuasive Devices</td>
            <td style="padding: 14px 16px; color: #1E293B;">Extended metaphor (lifeblood, dusty drain), rhetorical questions, rule of three, high-modality verbs (must, urgently, cannot), expert quotes.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Support Pathway Table (Calibrated for lower reading complexity) -->
    <div class="lucas-only">
      <table style="width: 100%; border-collapse: collapse; background: #FFFFFF; border: 2px solid #0F3854; border-radius: 8px; font-size: 22px;">
        <thead>
          <tr style="background: #0F3854; color: #ffffff;">
            <th style="padding: 16px; text-align: left; width: 25%; font-size: 24px;">Planning Step</th>
            <th style="padding: 16px; text-align: left; width: 75%; font-size: 24px;">My Essay Plan Details</th>
          </tr>
        </thead>
        <tbody>
          <tr style="background: #F8FAFC; border-bottom: 1px solid #E2E8F0;">
            <td style="padding: 14px 16px; font-weight: 700; color: #0F3854;">Topic &amp; Opinion</td>
            <td style="padding: 14px 16px; color: #1E293B;">Saving the Murray-Darling River. We must put water back into the river and stop taking too much out.</td>
          </tr>
          <tr style="background: #FFFFFF; border-bottom: 1px solid #E2E8F0;">
            <td style="padding: 14px 16px; font-weight: 700; color: #0F3854;">Hook Idea</td>
            <td style="padding: 14px 16px; color: #1E293B;">Compare a healthy green river with pelicans to a dry muddy riverbed with dead fish.</td>
          </tr>
          <tr style="background: #F8FAFC; border-bottom: 1px solid #E2E8F0;">
            <td style="padding: 14px 16px; font-weight: 700; color: #0F3854;">Reason 1 (Water Problem)</td>
            <td style="padding: 14px 16px; color: #1E293B;">Taking too much water kills fish. CSIRO scientists found millions of fish died in one week at Menindee Lakes.</td>
          </tr>
          <tr style="background: #FFFFFF; border-bottom: 1px solid #E2E8F0;">
            <td style="padding: 14px 16px; font-weight: 700; color: #0F3854;">Reason 2 (Animals &amp; Culture)</td>
            <td style="padding: 14px 16px; color: #1E293B;">Over 120 waterbird species need the river. Indigenous Barkandji people have loved and protected the river for 65,000+ years.</td>
          </tr>
          <tr style="background: #F8FAFC; border-bottom: 1px solid #E2E8F0;">
            <td style="padding: 14px 16px; font-weight: 700; color: #0F3854;">What Others Say (Rebuttal)</td>
            <td style="padding: 14px 16px; color: #1E293B;">Some say farmers need all the water. But if the river dries up, farmers lose everything anyway! Saving water helps both.</td>
          </tr>
          <tr style="background: #FFFFFF;">
            <td style="padding: 14px 16px; font-weight: 700; color: #0F3854;">Ending Question</td>
            <td style="padding: 14px 16px; color: #1E293B;">"Will you help save our river before it is gone forever?"</td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>

  <div class="teacher-notes" style="display: none;">
    <h3>Teacher Notes — Planning Sheet Overview</h3>
    <p><strong>DO:</strong> Emphasize that top-scoring students complete their planning sheet BEFORE writing a single sentence of their essay draft.</p>
    <p><strong>WORK:</strong> Hand out blank planning templates for student essay topics.</p>
    <p><strong>RECORD:</strong> Students fill out Topic, Stance, and 3 Arguments on their planning templates.</p>
    <p><strong>CHECK:</strong> Teacher moves around the room to sign off on student essay plans.</p>
  </div>
</section>

<!-- Slide 8: Part B Speaking & Listening Delivery Annotations -->
<section class="slide theme-light" id="slide-8">
  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
    <h2 style="font-size: 44px; color: #0F3854; margin: 0; font-weight: 700;">Slide 8: Part B Oral Presentation (Voice &amp; Gesture Coach)</h2>
    <span style="background: #FCE7F3; color: #BE185D; padding: 8px 20px; border-radius: 20px; font-weight: 700; font-size: 20px;">Part B Spoken Presentation</span>
  </div>

  <div style="display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 30px; height: calc(100% - 100px);">
    <!-- Left Column: Speech Script -->
    <div style="background: #FFF5F5; border: 2px solid #F43F5E; border-radius: 12px; padding: 28px; overflow-y: auto;">
      <h3 style="font-size: 26px; color: #BE185D; margin-bottom: 14px; font-weight: 700;">Annotated Speech Script Excerpt</h3>
      
      <div style="background: #FFFFFF; padding: 14px; border-radius: 8px; border: 1px solid #FECDD3; margin-bottom: 14px;">
        <span style="color: #D97706; font-weight: 700; font-size: 18px;">[VISUAL CUE: Slide showing healthy river red gums vs Menindee fish kill map]</span>
      </div>

      <!-- Standard Pathway Speech Script -->
      <div class="standard-only">
        <p style="font-size: 24px; line-height: 1.5; color: #1E293B; margin-bottom: 14px;">
          <span style="color: #2563EB; font-style: italic; font-weight: 600;">[TONE: Warm, engaging. PACE: Moderate. GESTURE: Direct eye contact, open hands]</span><br>
          Good morning teachers and classmates.
        </p>

        <p style="font-size: 24px; line-height: 1.5; color: #1E293B; margin-bottom: 14px;">
          <span style="color: #DC2626; font-style: italic; font-weight: 600;">[PAUSE - 2 seconds. PITCH: Drops slightly to a serious tone]</span><br>
          Imagine standing on the banks of a mighty Australian river, watching crystal-clear water flow past ancient red gums while pelicans glide across the surface. Now, contrast that scene with a cracked, dry riverbed littered with millions of decaying native fish.
        </p>

        <p style="font-size: 24px; line-height: 1.5; color: #1E293B; margin-bottom: 14px;">
          <span style="color: #16A34A; font-style: italic; font-weight: 600;">[TONE: Urgent, firm. EMPHASIS on 'lifeblood' and 'right now']</span><br>
          This environmental tragedy is happening right now across the Murray-Darling Basin—the lifeblood of our continent!
        </p>
      </div>

      <!-- Support Pathway Speech Script (Year 3 Calibrated) -->
      <div class="lucas-only">
        <p style="font-size: 24px; line-height: 1.5; color: #1E293B; margin-bottom: 14px;">
          <span style="color: #2563EB; font-style: italic; font-weight: 600;">[TONE: Friendly, clear. PACE: Slow &amp; steady. GESTURE: Look at class, open hands]</span><br>
          Good morning everyone.
        </p>

        <p style="font-size: 24px; line-height: 1.5; color: #1E293B; margin-bottom: 14px;">
          <span style="color: #DC2626; font-style: italic; font-weight: 600;">[PAUSE - 2 seconds. PITCH: Serious voice]</span><br>
          Picture a beautiful river full of green trees and pelicans. Now imagine the river turning completely dry with dead fish on the ground.
        </p>

        <p style="font-size: 24px; line-height: 1.5; color: #1E293B; margin-bottom: 14px;">
          <span style="color: #16A34A; font-style: italic; font-weight: 600;">[TONE: Strong &amp; clear. EMPHASIS on 'save our river']</span><br>
          We need to save our river right now by putting water back in!
        </p>
      </div>

    </div>

    <!-- Right Column: Voice Features Guide -->
    <div style="background: #FFFFFF; border: 2px solid #0F3854; border-radius: 12px; padding: 28px; display: flex; flex-direction: column; justify-content: space-between;">
      <div>
        <h3 style="font-size: 28px; color: #0F3854; margin-bottom: 18px; font-weight: 700;">Features of Voice Checklist (Part B Rubric)</h3>
        
        <div style="display: flex; flex-direction: column; gap: 12px;">
          <div style="background: #EFF6FF; padding: 14px; border-radius: 8px; border-left: 5px solid #2563EB;">
            <strong style="color: #1E40AF; font-size: 20px;">1. Pitch:</strong> <span style="font-size: 19px; color: #1E293B; line-height: 1.4;">Raise pitch for exciting hooks; lower pitch for serious facts and expert quotes.</span>
          </div>

          <div style="background: #F0FDF4; padding: 14px; border-radius: 8px; border-left: 5px solid #16A34A;">
            <strong style="color: #166534; font-size: 20px;">2. Tone:</strong> <span style="font-size: 19px; color: #1E293B; line-height: 1.4;">Shift from warm/engaging in intro to urgent/passionate in body paragraphs.</span>
          </div>

          <div style="background: #FEF3C7; padding: 14px; border-radius: 8px; border-left: 5px solid #D97706;">
            <strong style="color: #92400E; font-size: 20px;">3. Pace &amp; Pauses:</strong> <span style="font-size: 19px; color: #1E293B; line-height: 1.4;">Slow down during key statistics; use 2-second pauses before questions!</span>
          </div>

          <div style="background: #FDF4FF; padding: 14px; border-radius: 8px; border-left: 5px solid #A855F7;">
            <strong style="color: #7E22CE; font-size: 20px;">4. Multimodal Visual Cues:</strong> <span style="font-size: 19px; color: #1E293B; line-height: 1.4;">Time slide changes to match key facts and calls to action.</span>
          </div>
        </div>
      </div>

      <div style="background: #F1F5F9; padding: 16px; border-radius: 8px;">
        <h4 style="font-size: 20px; color: #0F3854; font-weight: 700; margin-bottom: 4px;">✍️ Presentation Practice Rule:</h4>
        <p style="font-size: 19px; color: #334155; line-height: 1.4;">Do NOT read your essay like a script! Annotate your notes with voice markers and speak directly to your audience!</p>
      </div>
    </div>
  </div>

  <div class="teacher-notes" style="display: none;">
    <h3>Teacher Notes — Presentation Annotations</h3>
    <p><strong>DO:</strong> Demonstrate reading the speech excerpt aloud twice: first monotone (flat), then with annotated voice features (pitch, tone, pace, pauses).</p>
    <p><strong>WORK:</strong> Have students annotate 2 sentences of their own draft with pitch/tone/pause markers and practise with a peer.</p>
    <p><strong>RECORD:</strong> Peers provide 1 compliment and 1 tip on voice pace.</p>
    <p><strong>CHECK:</strong> Select 2 student volunteers to deliver their annotated opening lines to the class.</p>
  </div>
</section>

<!-- Slide 9: Student Self-Assessment & Checklist -->
<section class="slide theme-light" id="slide-9">
  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
    <h2 style="font-size: 44px; color: #0F3854; margin: 0; font-weight: 700;">Slide 9: Student Self-Assessment &amp; Success Criteria</h2>
    <span style="background: #DCFCE7; color: #15803D; padding: 8px 20px; border-radius: 20px; font-weight: 700; font-size: 20px;">Checklist for Success</span>
  </div>

  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; height: calc(100% - 100px);">
    <!-- Left Column: Part A Checklist -->
    <div style="background: #FFFFFF; border: 2px solid #0F3854; border-radius: 12px; padding: 28px; display: flex; flex-direction: column; justify-content: space-between;">
      <div>
        <h3 style="font-size: 28px; color: #0F3854; margin-bottom: 18px; font-weight: 700;">📝 Part A: Written Essay Checklist</h3>
        
        <div style="display: flex; flex-direction: column; gap: 14px;">
          <label style="display: flex; align-items: center; gap: 14px; font-size: 22px; color: #1E293B; cursor: pointer;">
            <input type="checkbox" style="width: 26px; height: 26px; accent-color: #0F3854;">
            <span>5-paragraph structure with clear opinion in Intro</span>
          </label>

          <label style="display: flex; align-items: center; gap: 14px; font-size: 22px; color: #1E293B; cursor: pointer;">
            <input type="checkbox" style="width: 26px; height: 26px; accent-color: #0F3854;">
            <span>Topic sentences for every body paragraph</span>
          </label>

          <label style="display: flex; align-items: center; gap: 14px; font-size: 22px; color: #1E293B; cursor: pointer;">
            <input type="checkbox" style="width: 26px; height: 26px; accent-color: #0F3854;">
            <span>At least 2 expert sources or real facts (CSIRO, scientists, stats)</span>
          </label>

          <label style="display: flex; align-items: center; gap: 14px; font-size: 22px; color: #1E293B; cursor: pointer;">
            <input type="checkbox" style="width: 26px; height: 26px; accent-color: #0F3854;">
            <span>Addressed opposing view with a strong rebuttal</span>
          </label>

          <label style="display: flex; align-items: center; gap: 14px; font-size: 22px; color: #1E293B; cursor: pointer;">
            <input type="checkbox" style="width: 26px; height: 26px; accent-color: #0F3854;">
            <span>Descriptive words &amp; strong action words (must, save)</span>
          </label>

          <label style="display: flex; align-items: center; gap: 14px; font-size: 22px; color: #1E293B; cursor: pointer;">
            <input type="checkbox" style="width: 26px; height: 26px; accent-color: #0F3854;">
            <span>Conclusion with restated opinion &amp; final question</span>
          </label>
        </div>
      </div>

      <div style="background: #F0FDF4; padding: 14px; border-radius: 8px; border-left: 5px solid #16A34A; font-size: 19px; color: #166534;">
        Target length: 200–400 words (QCAA/AC guidelines).
      </div>
    </div>

    <!-- Right Column: Part B Checklist -->
    <div style="background: #FFFFFF; border: 2px solid #0F3854; border-radius: 12px; padding: 28px; display: flex; flex-direction: column; justify-content: space-between;">
      <div>
        <h3 style="font-size: 28px; color: #0F3854; margin-bottom: 18px; font-weight: 700;">🎤 Part B: Spoken Presentation Checklist</h3>
        
        <div style="display: flex; flex-direction: column; gap: 14px;">
          <label style="display: flex; align-items: center; gap: 14px; font-size: 22px; color: #1E293B; cursor: pointer;">
            <input type="checkbox" style="width: 26px; height: 26px; accent-color: #0F3854;">
            <span>Annotated speech notes for pitch, tone, pace, and pauses</span>
          </label>

          <label style="display: flex; align-items: center; gap: 14px; font-size: 22px; color: #1E293B; cursor: pointer;">
            <input type="checkbox" style="width: 26px; height: 26px; accent-color: #0F3854;">
            <span>Maintained eye contact with audience (not just reading)</span>
          </label>

          <label style="display: flex; align-items: center; gap: 14px; font-size: 22px; color: #1E293B; cursor: pointer;">
            <input type="checkbox" style="width: 26px; height: 26px; accent-color: #0F3854;">
            <span>Used clear hand gestures and open body language</span>
          </label>

          <label style="display: flex; align-items: center; gap: 14px; font-size: 22px; color: #1E293B; cursor: pointer;">
            <input type="checkbox" style="width: 26px; height: 26px; accent-color: #0F3854;">
            <span>Integrated visual slide cues (images, graphs, quotes)</span>
          </label>

          <label style="display: flex; align-items: center; gap: 14px; font-size: 22px; color: #1E293B; cursor: pointer;">
            <input type="checkbox" style="width: 26px; height: 26px; accent-color: #0F3854;">
            <span>Rehearsed timing (1:30 to 2:30 minutes)</span>
          </label>
        </div>
      </div>

      <div style="background: #EFF6FF; padding: 14px; border-radius: 8px; border-left: 5px solid #2563EB; font-size: 19px; color: #1E40AF;">
        Target timing: 1:30–2:30 minutes.
      </div>
    </div>
  </div>

  <div class="teacher-notes" style="display: none;">
    <h3>Teacher Notes — Self-Assessment &amp; Exit Ticket</h3>
    <p><strong>DO:</strong> Have students review their draft essay against both checklists.</p>
    <p><strong>WORK:</strong> Students check off items they have achieved and highlight 1 area to revise before final submission.</p>
    <p><strong>RECORD:</strong> Students write down their 1 revision goal on an exit ticket.</p>
    <p><strong>FINISH:</strong> Collect exit tickets and congratulate class on deconstructing an A-Standard persuasive text!</p>
  </div>
</section>
`;

const extraHead = `
<style>
  /* Pathway Switch Styling - Fixed Top Right */
  #pathwayToggle {
    position: fixed !important;
    top: 20px !important;
    right: 25px !important;
    z-index: 1100 !important;
    display: flex !important;
    align-items: center !important;
    background: rgba(15, 56, 84, 0.9) !important;
    padding: 6px 12px !important;
    border-radius: 30px !important;
    border: 2px solid rgba(255, 255, 255, 0.25) !important;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3) !important;
  }

  .switch {
    position: relative;
    display: inline-block;
    width: 56px;
    height: 30px;
    margin: 0;
  }

  .switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #EF4444; /* RED when unchecked */
    transition: .3s cubic-bezier(0.16, 1, 0.3, 1);
    border-radius: 30px;
  }

  .slider:before {
    position: absolute;
    content: "";
    height: 22px;
    width: 22px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: .3s cubic-bezier(0.16, 1, 0.3, 1);
    border-radius: 50%;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  }

  input:checked + .slider {
    background-color: #22C55E; /* GREEN when checked */
  }

  input:checked + .slider:before {
    transform: translateX(26px);
  }

  /* Dual Pathway Visibility Rules */
  .lucas-only { display: none !important; }
  .standard-only { display: block !important; }

  body.lucas-active .lucas-only { display: block !important; }
  body.lucas-active .standard-only { display: none !important; }
</style>
`;

const extraScripts = `
<script>
  function highlightSectionStd(section) {
    const hook = document.querySelector('.hook-text-std');
    const context = document.querySelector('.context-text-std');
    const thesis = document.querySelector('.thesis-text-std');
    
    const infoHook = document.getElementById('info-hook');
    const infoContext = document.getElementById('info-context');
    const infoThesis = document.getElementById('info-thesis');

    [hook, context, thesis].forEach(el => {
      if(el) {
        el.style.backgroundColor = 'transparent';
        el.style.color = '#1E293B';
        el.style.fontWeight = 'normal';
      }
    });

    [infoHook, infoContext, infoThesis].forEach(el => {
      if(el) {
        el.style.transform = 'scale(1)';
        el.style.boxShadow = 'none';
      }
    });

    if (section === 'hook') {
      hook.style.backgroundColor = '#BFDBFE';
      hook.style.color = '#1E40AF';
      hook.style.fontWeight = 'bold';
      infoHook.style.transform = 'scale(1.03)';
      infoHook.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.2)';
    } else if (section === 'context') {
      context.style.backgroundColor = '#BBF7D0';
      context.style.color = '#166534';
      context.style.fontWeight = 'bold';
      infoContext.style.transform = 'scale(1.03)';
      infoContext.style.boxShadow = '0 4px 12px rgba(22, 163, 74, 0.2)';
    } else if (section === 'thesis') {
      thesis.style.backgroundColor = '#FCA5A5';
      thesis.style.color = '#991B1B';
      thesis.style.fontWeight = 'bold';
      infoThesis.style.transform = 'scale(1.03)';
      infoThesis.style.boxShadow = '0 4px 12px rgba(220, 38, 38, 0.2)';
    }
  }

  function highlightSectionLuc(section) {
    const hook = document.querySelector('.hook-text-luc');
    const context = document.querySelector('.context-text-luc');
    const thesis = document.querySelector('.thesis-text-luc');
    
    const infoHook = document.getElementById('info-hook');
    const infoContext = document.getElementById('info-context');
    const infoThesis = document.getElementById('info-thesis');

    [hook, context, thesis].forEach(el => {
      if(el) {
        el.style.backgroundColor = 'transparent';
        el.style.color = '#1E293B';
        el.style.fontWeight = 'normal';
      }
    });

    [infoHook, infoContext, infoThesis].forEach(el => {
      if(el) {
        el.style.transform = 'scale(1)';
        el.style.boxShadow = 'none';
      }
    });

    if (section === 'hook') {
      hook.style.backgroundColor = '#BFDBFE';
      hook.style.color = '#1E40AF';
      hook.style.fontWeight = 'bold';
      infoHook.style.transform = 'scale(1.03)';
      infoHook.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.2)';
    } else if (section === 'context') {
      context.style.backgroundColor = '#BBF7D0';
      context.style.color = '#166534';
      context.style.fontWeight = 'bold';
      infoContext.style.transform = 'scale(1.03)';
      infoContext.style.boxShadow = '0 4px 12px rgba(22, 163, 74, 0.2)';
    } else if (section === 'thesis') {
      thesis.style.backgroundColor = '#FCA5A5';
      thesis.style.color = '#991B1B';
      thesis.style.fontWeight = 'bold';
      infoThesis.style.transform = 'scale(1.03)';
      infoThesis.style.boxShadow = '0 4px 12px rgba(220, 38, 38, 0.2)';
    }
  }

  // Bind Pathway Switch listener on DOM load
  window.addEventListener('DOMContentLoaded', () => {
    const pathwayToggleBtn = document.getElementById('pathwayToggleBtn');
    const pathwayToggle = document.getElementById('pathwayToggle');
    if (pathwayToggle) {
      pathwayToggle.style.display = 'flex';
    }
    if (pathwayToggleBtn) {
      pathwayToggleBtn.addEventListener('change', (e) => {
        if (e.target.checked) {
          document.body.classList.add('lucas-active');
        } else {
          document.body.classList.remove('lucas-active');
        }
      });
    }
  });
</script>
`;

const outputPath = path.resolve(__dirname, 'Exemplar_Presentation_Murray_Darling_Basin.html');

compilePresentation({
  slidesHtml: slidesHtml,
  outputPath: outputPath,
  title: 'Lifeline of Our Continent — Persuasive Writing Presentation',
  extraHead: extraHead,
  extraScripts: extraScripts
});

console.log('Successfully compiled high-visibility dual-pathway interactive presentation to: ' + outputPath);
