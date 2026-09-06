import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const compilerPath = path.resolve(__dirname, '../../../../.agent/skills/classroom-presentation/scripts/build_presentation.mjs');
const { compilePresentation } = await import(`file://${compilerPath.replace(/\\/g, '/')}`);

const slidesHtml = `
<!-- Slide 1: Title Slide -->
<section class="slide theme-dark active" id="slide-1" style="background: linear-gradient(135deg, #1B4D3E 0%, #2E6F40 100%); color: #ffffff;">
  <div style="display: flex; flex-direction: column; height: 100%; justify-content: center; align-items: center; text-align: center; padding: 20px;">
    <span style="background: rgba(200, 138, 43, 0.25); border: 2px solid #C88A2B; color: #FCD34D; padding: 10px 28px; border-radius: 30px; font-weight: 700; letter-spacing: 1px; margin-bottom: 24px; font-size: 22px; text-transform: uppercase;">
      Year 5 English Unit 3 • Assessment Task 3 Model
    </span>

    <!-- Standard Pathway Title -->
    <div class="standard-only">
      <h1 style="font-size: 56px; font-weight: 700; line-height: 1.15; margin-bottom: 24px; max-width: 1100px; color: #ffffff;">
        Silent Voices of the Rainforest: Deconstructing an A-Standard Persuasive Text
      </h1>
      <p style="font-size: 32px; color: #E0F2FE; max-width: 950px; margin-bottom: 44px; font-weight: 400; line-height: 1.4;">
        Persuasive Writing, Authoritative Evidence &amp; Presentation Skills: Protecting Orangutans from Palm Oil Farms
      </p>
    </div>

    <!-- Support Pathway Title (Calibrated for lower reading complexity) -->
    <div class="lucas-only">
      <h1 style="font-size: 56px; font-weight: 700; line-height: 1.15; margin-bottom: 24px; max-width: 1100px; color: #ffffff;">
        Save the Rainforest Orangutans: How to Write a Winning Persuasive Essay
      </h1>
      <p style="font-size: 32px; color: #E0F2FE; max-width: 950px; margin-bottom: 44px; font-weight: 400; line-height: 1.4;">
        Learn how to plan, write, and present a powerful story to stop palm oil rainforest destruction
      </p>
    </div>

    <div style="display: flex; gap: 24px; align-items: center;">
      <div style="background: rgba(255, 255, 255, 0.1); border-left: 5px solid #C88A2B; padding: 14px 28px; text-align: left; border-radius: 6px;">
        <div style="font-size: 18px; color: #94A3B8; text-transform: uppercase; font-weight: 700;">Task Component</div>
        <div style="font-size: 24px; color: #ffffff; font-weight: 600;">Part A: Written Essay &amp; Part B: Presentation</div>
      </div>
      <div style="background: rgba(255, 255, 255, 0.1); border-left: 5px solid #34D399; padding: 14px 28px; text-align: left; border-radius: 6px;">
        <div style="font-size: 18px; color: #94A3B8; text-transform: uppercase; font-weight: 700;">Literary Anchor</div>
        <div style="font-size: 24px; color: #ffffff; font-weight: 600;">Berani by Michelle Kadarusman</div>
      </div>
    </div>
  </div>

  <div class="teacher-notes" style="display: none;">
    <h3>Teacher Notes &amp; Lesson Logistics</h3>
    <p><strong>DO:</strong> Project slide 1 as students enter. Ensure notebooks ready. Use top-right neutral toggle to alternate reading pathways silently.</p>
    <p><strong>WORK:</strong> Introduce lesson objective: analyzing an A-Standard persuasive essay on protecting orangutans to learn how to construct their own essay.</p>
    <p><strong>RECORD:</strong> Students note down key assessment success criteria in their workbooks.</p>
    <p><strong>FINISH:</strong> 2 minutes previewing the slide journey.</p>
    <p><strong>CHECK:</strong> Confirm all students understand Part A (Written) and Part B (Spoken).</p>
  </div>
</section>

<!-- Slide 2: The Hook & Introduction Analysis -->
<section class="slide theme-light" id="slide-2">
  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
    <h2 style="font-size: 44px; color: #1B4D3E; margin: 0; font-weight: 700;">Slide 2: Deconstructing the Introduction (The Hook &amp; Thesis)</h2>
    <span style="background: #D1FAE5; color: #065F46; padding: 8px 20px; border-radius: 20px; font-weight: 700; font-size: 20px;">Part A Focus: Paragraph 1</span>
  </div>

  <div style="display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 30px; height: calc(100% - 100px);">
    <!-- Left Column: Essay Text -->
    <div style="background: #F7FAF8; border: 2px solid #A7F3D0; border-radius: 12px; padding: 28px; display: flex; flex-direction: column; justify-content: space-between;">
      <div>
        <h3 style="font-size: 28px; color: #1B4D3E; margin-bottom: 18px; font-weight: 700;">Exemplar Paragraph 1 (Introduction)</h3>
        
        <!-- Standard Pathway Text -->
        <div class="standard-only">
          <p style="font-size: 26px; line-height: 1.6; color: #1E293B;">
            <span class="highlight-target hook-text-std" style="padding: 2px 6px; border-radius: 4px; transition: all 0.3s; cursor: pointer;" onclick="highlightSectionStd('hook')">
              Imagine walking through a lush, ancient Indonesian rainforest, surrounded by towering emerald trees, only to hear the crushing roar of a bulldozer flattening everything in its path. This devastating reality is happening right now across Sumatra and Borneo.
            </span>
            <span class="highlight-target context-text-std" style="padding: 2px 6px; border-radius: 4px; transition: all 0.3s; cursor: pointer;" onclick="highlightSectionStd('context')">
              Industrial palm oil plantations are systematically destroying the sacred habitat of the critically endangered orangutan.
            </span>
            <span class="highlight-target thesis-text-std" style="padding: 2px 6px; border-radius: 4px; transition: all 0.3s; cursor: pointer;" onclick="highlightSectionStd('thesis')">
              To protect these magnificent creatures—our closest biological relatives sharing nearly 97 per cent of human DNA—we must urgently eradicate destructive, uncertified palm oil farming in Indonesia and demand sustainable alternatives.
            </span>
          </p>
        </div>

        <!-- Support Pathway Text (Year 3 Calibrated) -->
        <div class="lucas-only">
          <p style="font-size: 26px; line-height: 1.6; color: #1E293B;">
            <span class="highlight-target hook-text-luc" style="padding: 2px 6px; border-radius: 4px; transition: all 0.3s; cursor: pointer;" onclick="highlightSectionLuc('hook')">
              Picture walking through a giant, green rainforest full of singing birds. Now imagine hearing noisy bulldozers knocking down all the big trees.
            </span>
            <span class="highlight-target context-text-luc" style="padding: 2px 6px; border-radius: 4px; transition: all 0.3s; cursor: pointer;" onclick="highlightSectionLuc('context')">
              This sad problem is happening right now in Indonesia. Big palm oil farms are cutting down the rainforest home of wild orangutans.
            </span>
            <span class="highlight-target thesis-text-luc" style="padding: 2px 6px; border-radius: 4px; transition: all 0.3s; cursor: pointer;" onclick="highlightSectionLuc('thesis')">
              We must stop bad palm oil farming right now to save wild orangutans from dying out.
            </span>
          </p>
        </div>

      </div>
      <div style="background: #FEF3C7; border-left: 5px solid #D97706; padding: 14px; border-radius: 6px; font-size: 20px; color: #92400E; font-weight: 500;">
        💡 <strong>Interactive Challenge:</strong> Click on the text segments on the left to identify the 3 vital building blocks of a great introduction!
      </div>
    </div>

    <!-- Right Column: Interactive Analysis Activity -->
    <div style="background: #FFFFFF; border: 2px solid #1B4D3E; border-radius: 12px; padding: 28px; display: flex; flex-direction: column; justify-content: space-between;">
      <div>
        <h3 style="font-size: 28px; color: #1B4D3E; margin-bottom: 18px; font-weight: 700;">Student Activity: Introduction Blueprint</h3>
        
        <div id="info-hook" class="info-card" style="background: #EFF6FF; border-left: 6px solid #2563EB; padding: 18px; margin-bottom: 16px; border-radius: 8px;">
          <h4 style="font-size: 22px; color: #1E40AF; margin-bottom: 6px; font-weight: 700;">1. The Sensory Hook (Sensory Contrast)</h4>
          <p style="font-size: 20px; color: #1E293B; line-height: 1.5;">Contrasts peaceful green rainforests with noisy bulldozers to grab emotion.</p>
        </div>

        <div id="info-context" class="info-card" style="background: #F0FDF4; border-left: 6px solid #16A34A; padding: 18px; margin-bottom: 16px; border-radius: 8px;">
          <h4 style="font-size: 22px; color: #166534; margin-bottom: 6px; font-weight: 700;">2. Background Context (The Crisis)</h4>
          <p style="font-size: 20px; color: #1E293B; line-height: 1.5;">Explains the real issue: palm oil farms knocking down orangutan homes.</p>
        </div>

        <div id="info-thesis" class="info-card" style="background: #FEF2F2; border-left: 6px solid #DC2626; padding: 18px; margin-bottom: 16px; border-radius: 8px;">
          <h4 style="font-size: 22px; color: #991B1B; margin-bottom: 6px; font-weight: 700;">3. Clear Stance (Your Solution)</h4>
          <p style="font-size: 20px; color: #1E293B; line-height: 1.5;">Demands an immediate stop to bad palm oil farming using strong action words.</p>
        </div>
      </div>

      <div style="background: #F1F5F9; padding: 18px; border-radius: 8px; border: 1px solid #CBD5E1;">
        <h4 style="font-size: 20px; color: #1B4D3E; font-weight: 700; margin-bottom: 6px;">✍️ Constructing Your Own Essay:</h4>
        <p style="font-size: 20px; color: #334155; line-height: 1.5;">Start with a sensory contrast, explain the background issue, then give your clear stance!</p>
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

<!-- Slide 3: Body Paragraph 1 (Authoritative Research & Data) -->
<section class="slide theme-light" id="slide-3">
  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
    <h2 style="font-size: 44px; color: #1B4D3E; margin: 0; font-weight: 700;">Slide 3: Body Paragraph 1 (Authoritative Evidence)</h2>
    <span style="background: #FEF3C7; color: #92400E; padding: 8px 20px; border-radius: 20px; font-weight: 700; font-size: 20px;">Part A Focus: Paragraph 2</span>
  </div>

  <div style="display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 30px; height: calc(100% - 100px);">
    <!-- Left Column: Paragraph Text -->
    <div style="background: #F7FAF8; border: 2px solid #A7F3D0; border-radius: 12px; padding: 28px; display: flex; flex-direction: column; justify-content: space-between;">
      <div>
        <h3 style="font-size: 28px; color: #1B4D3E; margin-bottom: 16px; font-weight: 700;">Exemplar Paragraph 2 (Deforestation)</h3>
        
        <!-- Standard Pathway Text -->
        <div class="standard-only">
          <p style="font-size: 25px; line-height: 1.6; color: #1E293B;">
            <strong style="color: #1B4D3E; background: #DBEAFE; padding: 2px 6px; border-radius: 4px;">Firstly, the rapid expansion of industrial palm oil farms is driving unprecedented habitat destruction.</strong> 
            According to research from the World Wildlife Fund (WWF), over 80 per cent of orangutan habitat has been cleared in the past twenty years to make way for vast monoculture palm plantations. 
            Dr Biruté Galdikas, a world-renowned primatologist, warned, 
            <em style="color: #991B1B; background: #FEE2E2; padding: 2px 6px; border-radius: 4px;">“If we do not stop the clearing of Indonesia's ancient canopies immediately, wild orangutans could become extinct within our lifetime.”</em> 
            Without their forest homes, these gentle copper-haired primates are left displaced, vulnerable, and starving.
          </p>
        </div>

        <!-- Support Pathway Text (Year 3 Calibrated) -->
        <div class="lucas-only">
          <p style="font-size: 25px; line-height: 1.6; color: #1E293B;">
            <strong style="color: #1B4D3E; background: #DBEAFE; padding: 2px 6px; border-radius: 4px;">First, cutting down trees for palm oil destroys orangutan homes.</strong> 
            The World Wildlife Fund (WWF) found that 80 per cent of orangutan forests have been cut down in twenty years. 
            Orangutan expert Dr Biruté Galdikas warned, 
            <em style="color: #991B1B; background: #FEE2E2; padding: 2px 6px; border-radius: 4px;">“If we do not stop cutting down trees now, wild orangutans could disappear forever.”</em> 
            Without their forest, orangutans have no food and nowhere to sleep.
          </p>
        </div>

      </div>

      <div style="background: #F0F9FF; border-left: 5px solid #0284C7; padding: 16px; border-radius: 6px; font-size: 20px; color: #0369A1;">
        🔍 <strong>Notice:</strong> Topic Sentence (Blue) ➔ WWF Stat (80% habitat loss) ➔ Named Expert Quote (Dr Galdikas) ➔ Emotive Impact.
      </div>
    </div>

    <!-- Right Column: Interactive Evidence Matching -->
    <div style="background: #FFFFFF; border: 2px solid #1B4D3E; border-radius: 12px; padding: 28px; display: flex; flex-direction: column; justify-content: space-between;">
      <div>
        <h3 style="font-size: 28px; color: #1B4D3E; margin-bottom: 18px; font-weight: 700;">Student Activity: Building Evidence Strength</h3>
        
        <div style="display: flex; flex-direction: column; gap: 14px;">
          <div style="border: 1px solid #CBD5E1; padding: 14px; border-radius: 8px; background: #F8FAFC;">
            <span style="font-weight: 700; color: #1D4ED8; font-size: 18px;">1. WEAK ASSERTION:</span>
            <p style="font-size: 19px; color: #475569; margin: 4px 0 0 0; line-height: 1.4;">"Palm oil farms are bad for monkeys." (No proof, bare claim)</p>
          </div>

          <div style="border: 2px solid #16A34A; padding: 14px; border-radius: 8px; background: #F0FDF4;">
            <span style="font-weight: 700; color: #15803D; font-size: 18px;">2. STRONG EVIDENCE (Exemplar):</span>
            <p style="font-size: 19px; color: #166534; margin: 4px 0 0 0; line-height: 1.4;">"According to the WWF, 80% of habitat has been cleared... Dr Galdikas warned orangutans could become extinct."</p>
          </div>
        </div>

        <div style="margin-top: 18px; background: #EFF6FF; padding: 16px; border-radius: 8px; border-left: 5px solid #2563EB;">
          <h4 style="font-size: 20px; color: #1E40AF; font-weight: 700; margin-bottom: 6px;">💡 Authoritative Source Bank for Students:</h4>
          <ul style="font-size: 19px; color: #1E293B; margin-left: 24px; line-height: 1.5;">
            <li>World Wildlife Fund (WWF)</li>
            <li>Primatologists &amp; Wildlife Scientists</li>
            <li>International Union for Conservation of Nature (IUCN)</li>
          </ul>
        </div>
      </div>

      <div style="background: #F1F5F9; padding: 16px; border-radius: 8px;">
        <h4 style="font-size: 20px; color: #1B4D3E; font-weight: 700; margin-bottom: 4px;">✍️ Construction Rule for Your Essay:</h4>
        <p style="font-size: 19px; color: #334155; line-height: 1.4;">Name real experts and real conservation groups to make your argument strong and believable!</p>
      </div>
    </div>
  </div>

  <div class="teacher-notes" style="display: none;">
    <h3>Teacher Notes — Body Paragraph 1 Analysis</h3>
    <p><strong>DO:</strong> Emphasize the difference between a bare assertion ("Palm oil is bad") and authoritative evidence ("WWF reports 80% habitat loss").</p>
    <p><strong>WORK:</strong> Ask students to identify authoritative sources they can cite for their negotiated persuasive topics.</p>
    <p><strong>RECORD:</strong> Students write down 2 authoritative organisations relevant to their topic.</p>
    <p><strong>CHECK:</strong> Call on 3 students to name their authority sources.</p>
  </div>
</section>

<!-- Slide 4: Body Paragraph 2 (Ecosystem Collapse) -->
<section class="slide theme-light" id="slide-4">
  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
    <h2 style="font-size: 44px; color: #1B4D3E; margin: 0; font-weight: 700;">Slide 4: Body Paragraph 2 (Biodiversity &amp; Ecosystem Collapse)</h2>
    <span style="background: #DCFCE7; color: #15803D; padding: 8px 20px; border-radius: 20px; font-weight: 700; font-size: 20px;">Part A Focus: Paragraph 3</span>
  </div>

  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; height: calc(100% - 100px);">
    <!-- Left Column: Essay Text -->
    <div style="background: #F7FAF8; border: 2px solid #A7F3D0; border-radius: 12px; padding: 28px; display: flex; flex-direction: column; justify-content: space-between;">
      <div>
        <h3 style="font-size: 28px; color: #1B4D3E; margin-bottom: 16px; font-weight: 700;">Exemplar Paragraph 3 (Ecosystem Collapse)</h3>
        
        <!-- Standard Pathway Text -->
        <div class="standard-only">
          <p style="font-size: 25px; line-height: 1.6; color: #1E293B;">
            <strong style="color: #1B4D3E; background: #E0E7FF; padding: 2px 6px; border-radius: 4px;">Secondly, palm oil deforestation inflicts catastrophic damage on broader rainforest ecosystems.</strong> 
            Tropical rainforests in Indonesia are global biodiversity hotspots, supporting thousands of unique plant and animal species. 
            International Union for Conservation of Nature (IUCN) data reveals that orangutan populations have plunged by over 60 per cent in recent decades. 
            <strong style="color: #166534; background: #DCFCE7; padding: 2px 6px; border-radius: 4px;">Can we truly justify wiping out an entire species simply to produce cheap ingredients for chocolate bars, soaps, and cosmetics?</strong>
          </p>
        </div>

        <!-- Support Pathway Text (Year 3 Calibrated) -->
        <div class="lucas-only">
          <p style="font-size: 25px; line-height: 1.6; color: #1E293B;">
            <strong style="color: #1B4D3E; background: #E0E7FF; padding: 2px 6px; border-radius: 4px;">Second, cutting down the forest hurts all the animals living in the jungle.</strong> 
            Rainforests are home to thousands of rare plants and animals. 
            Wildlife groups found that more than half of all wild orangutans have disappeared. 
            <strong style="color: #166534; background: #DCFCE7; padding: 2px 6px; border-radius: 4px;">Is it fair to destroy a whole animal family just to make cheap snacks and soap?</strong>
          </p>
        </div>

      </div>

      <div style="background: #FEF2F2; border-left: 5px solid #EF4444; padding: 16px; border-radius: 6px; font-size: 20px; color: #991B1B;">
        ❓ <strong>Rhetorical Question Impact:</strong> Asking a powerful question challenges the reader to agree with your opinion!
      </div>
    </div>

    <!-- Right Column: Interactive Multi-Perspective Analyzer -->
    <div style="background: #FFFFFF; border: 2px solid #1B4D3E; border-radius: 12px; padding: 28px; display: flex; flex-direction: column; justify-content: space-between;">
      <div>
        <h3 style="font-size: 28px; color: #1B4D3E; margin-bottom: 18px; font-weight: 700;">Student Activity: Persuasive Question Strategy</h3>
        
        <div style="display: flex; flex-direction: column; gap: 16px;">
          <div style="background: #F0FDF4; border: 2px solid #22C55E; padding: 18px; border-radius: 8px;">
            <h4 style="font-size: 22px; color: #15803D; font-weight: 700; margin-bottom: 6px;">Weak Question:</h4>
            <p style="font-size: 19px; color: #166534; margin: 0; line-height: 1.4;">"Do you like orangutans?" (Easy to answer yes/no, not persuasive)</p>
          </div>

          <div style="background: #FFFBEB; border: 2px solid #F59E0B; padding: 18px; border-radius: 8px;">
            <h4 style="font-size: 22px; color: #B45309; font-weight: 700; margin-bottom: 6px;">A-Standard Rhetorical Question (Exemplar):</h4>
            <p style="font-size: 19px; color: #78350F; margin: 0; line-height: 1.4;">"Can we truly justify wiping out an entire species simply to produce cheap ingredients for chocolate bars and soap?"</p>
          </div>
        </div>

        <div style="margin-top: 18px; background: #F8FAFC; padding: 16px; border-radius: 8px; border: 1px dashed #64748B;">
          <span style="font-size: 19px; color: #334155; font-weight: 600;">✨ Vocabulary Spotlight:</span>
          <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-top: 10px;">
            <span style="background: #DBEAFE; color: #1E40AF; padding: 6px 14px; border-radius: 14px; font-size: 17px; font-weight: 600;">Monoculture</span>
            <span style="background: #DBEAFE; color: #1E40AF; padding: 6px 14px; border-radius: 14px; font-size: 17px; font-weight: 600;">Biodiversity Hotspots</span>
            <span style="background: #DBEAFE; color: #1E40AF; padding: 6px 14px; border-radius: 14px; font-size: 17px; font-weight: 600;">Critically Endangered</span>
          </div>
        </div>
      </div>

      <div style="background: #F1F5F9; padding: 16px; border-radius: 8px;">
        <h4 style="font-size: 20px; color: #1B4D3E; font-weight: 700; margin-bottom: 4px;">✍️ Construction Rule for Your Essay:</h4>
        <p style="font-size: 19px; color: #334155; line-height: 1.4;">Use rhetorical questions to challenge your reader and make them think deeply about your topic!</p>
      </div>
    </div>
  </div>

  <div class="teacher-notes" style="display: none;">
    <h3>Teacher Notes — Body Paragraph 2 Analysis</h3>
    <p><strong>DO:</strong> Model how rhetorical questions force the reader to take a moral stance.</p>
    <p><strong>WORK:</strong> Have students write a rhetorical question for their body paragraph 2.</p>
    <p><strong>RECORD:</strong> Students record their rhetorical question in their workbook.</p>
    <p><strong>CHECK:</strong> Listen to 3 rhetorical questions from class.</p>
  </div>
</section>

<!-- Slide 5: Body Paragraph 3 (Counterargument & Rebuttal) -->
<section class="slide theme-light" id="slide-5">
  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
    <h2 style="font-size: 44px; color: #1B4D3E; margin: 0; font-weight: 700;">Slide 5: Body Paragraph 3 (Counterargument &amp; Rebuttal)</h2>
    <span style="background: #FEE2E2; color: #991B1B; padding: 8px 20px; border-radius: 20px; font-weight: 700; font-size: 20px;">Part A Focus: Paragraph 4</span>
  </div>

  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; height: calc(100% - 100px);">
    <!-- Left Column: Essay Text -->
    <div style="background: #F7FAF8; border: 2px solid #A7F3D0; border-radius: 12px; padding: 28px; display: flex; flex-direction: column; justify-content: space-between;">
      <div>
        <h3 style="font-size: 28px; color: #1B4D3E; margin-bottom: 16px; font-weight: 700;">Exemplar Paragraph 4 (Rebutting Farming Claims)</h3>
        
        <!-- Standard Pathway Text -->
        <div class="standard-only">
          <p style="font-size: 25px; line-height: 1.6; color: #1E293B;">
            <span style="background: #FEF3C7; color: #92400E; padding: 2px 6px; border-radius: 4px; font-weight: 600;">Some people may argue that palm oil farming is necessary because it provides vital income for local Indonesian farmers.</span> 
            <span style="background: #E0E7FF; color: #3730A3; padding: 2px 6px; border-radius: 4px;">While economic livelihood is important, continuing to destroy ancient ecosystems is an unsustainable disaster.</span> 
            Transitioning towards eco-tourism, sustainable agroforestry, and RSPO-certified farming creates long-term, stable jobs without devastating the environment. 
            <strong style="color: #991B1B; background: #FEE2E2; padding: 2px 6px; border-radius: 4px;">Protecting jobs and saving orangutans do not have to be mutually exclusive; we can achieve both!</strong>
          </p>
        </div>

        <!-- Support Pathway Text (Year 3 Calibrated) -->
        <div class="lucas-only">
          <p style="font-size: 25px; line-height: 1.6; color: #1E293B;">
            <span style="background: #FEF3C7; color: #92400E; padding: 2px 6px; border-radius: 4px; font-weight: 600;">Some people say that farmers need palm oil to earn money for their families.</span> 
            <span style="background: #E0E7FF; color: #3730A3; padding: 2px 6px; border-radius: 4px;">It is true that earning money for food is important.</span> 
            But farmers can grow other safe crops and guide eco-tours without cutting down wild orangutan forests! 
            <strong style="color: #991B1B; background: #FEE2E2; padding: 2px 6px; border-radius: 4px;">We can protect farmer jobs and save wild orangutans at the same time.</strong>
          </p>
        </div>

      </div>

      <div style="background: #EFF6FF; border-left: 5px solid #3B82F6; padding: 16px; border-radius: 6px; font-size: 20px; color: #1E40AF;">
        🎯 <strong>The 3-Step Rebuttal Formula:</strong> Opposing View (Yellow) ➔ Concession (Blue) ➔ Sharp Rebuttal &amp; Solution (Red).
      </div>
    </div>

    <!-- Right Column: Interactive Rebuttal Masterclass -->
    <div style="background: #FFFFFF; border: 2px solid #1B4D3E; border-radius: 12px; padding: 28px; display: flex; flex-direction: column; justify-content: space-between;">
      <div>
        <h3 style="font-size: 28px; color: #1B4D3E; margin-bottom: 18px; font-weight: 700;">Student Activity: Master the Rebuttal</h3>
        
        <div style="display: flex; flex-direction: column; gap: 14px;">
          <div style="background: #FFFBEB; border-left: 5px solid #F59E0B; padding: 14px; border-radius: 6px;">
            <h4 style="font-size: 20px; color: #92400E; font-weight: 700; margin-bottom: 4px;">Step 1: State Opposing View Fairly</h4>
            <p style="font-size: 18px; color: #78350F; margin: 0; line-height: 1.4;">"Some people say farmers need palm oil for money..."</p>
          </div>

          <div style="background: #EFF6FF; border-left: 5px solid #3B82F6; padding: 14px; border-radius: 6px;">
            <h4 style="font-size: 20px; color: #1E40AF; font-weight: 700; margin-bottom: 4px;">Step 2: Make a Brief Concession</h4>
            <p style="font-size: 18px; color: #1E3A8A; margin: 0; line-height: 1.4;">"It is true that farmer income is important..." (Shows fairness)</p>
          </div>

          <div style="background: #FEF2F2; border-left: 5px solid #EF4444; padding: 14px; border-radius: 6px;">
            <h4 style="font-size: 20px; color: #991B1B; font-weight: 700; margin-bottom: 4px;">Step 3: Deliver Strong Rebuttal &amp; Solution</h4>
            <p style="font-size: 18px; color: #7F1D1D; margin: 0; line-height: 1.4;">"Farmers can grow safe crops and lead eco-tours... we can protect jobs and save orangutans together!"</p>
          </div>
        </div>
      </div>

      <div style="background: #F1F5F9; padding: 16px; border-radius: 8px;">
        <h4 style="font-size: 20px; color: #1B4D3E; font-weight: 700; margin-bottom: 4px;">✍️ Construction Rule for Your Essay:</h4>
        <p style="font-size: 19px; color: #334155; line-height: 1.4;">A great essay NEVER ignores the other side. Acknowledge what critics say, then explain why your solution protects everyone!</p>
      </div>
    </div>
  </div>

  <div class="teacher-notes" style="display: none;">
    <h3>Teacher Notes — Body Paragraph 3 Analysis</h3>
    <p><strong>DO:</strong> Explicitly model the 3-step rebuttal formula.</p>
    <p><strong>WORK:</strong> Have students draft their counterargument sentence starter.</p>
    <p><strong>RECORD:</strong> Students record their rebuttal in their workbooks.</p>
    <p><strong>CHECK:</strong> Check 3 student rebuttals for logical strength.</p>
  </div>
</section>

<!-- Slide 6: Conclusion Analysis -->
<section class="slide theme-light" id="slide-6">
  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
    <h2 style="font-size: 44px; color: #1B4D3E; margin: 0; font-weight: 700;">Slide 6: Deconstructing the Conclusion (Final Call to Action)</h2>
    <span style="background: #F3E8FF; color: #6B21A8; padding: 8px 20px; border-radius: 20px; font-weight: 700; font-size: 20px;">Part A Focus: Paragraph 5</span>
  </div>

  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; height: calc(100% - 100px);">
    <!-- Left Column: Essay Text -->
    <div style="background: #F7FAF8; border: 2px solid #A7F3D0; border-radius: 12px; padding: 28px; display: flex; flex-direction: column; justify-content: space-between;">
      <div>
        <h3 style="font-size: 28px; color: #1B4D3E; margin-bottom: 16px; font-weight: 700;">Exemplar Paragraph 5 (Conclusion)</h3>
        
        <!-- Standard Pathway Text -->
        <div class="standard-only">
          <p style="font-size: 26px; line-height: 1.6; color: #1E293B;">
            <strong style="color: #6B21A8; background: #F3E8FF; padding: 2px 6px; border-radius: 4px;">In conclusion, eradicating destructive palm oil farming in Indonesia is an absolute necessity to prevent the extinction of orangutans.</strong> 
            By preserving ancient forest canopies, supporting eco-certified agriculture, and speaking up for wildlife, we can ensure a safe future for these incredible animals. 
            <em style="color: #991B1B;">We cannot stand silently by while bulldozers tear down the lungs of our planet.</em> 
            <strong style="color: #1B4D3E; background: #FEF08A; padding: 2px 6px; border-radius: 4px;">The time for action is right now—will you choose to protect Indonesia’s ancient rainforests before the last orangutan disappears forever?</strong>
          </p>
        </div>

        <!-- Support Pathway Text (Year 3 Calibrated) -->
        <div class="lucas-only">
          <p style="font-size: 26px; line-height: 1.6; color: #1E293B;">
            <strong style="color: #6B21A8; background: #F3E8FF; padding: 2px 6px; border-radius: 4px;">In conclusion, stopping bad palm oil farming is the most important job to save orangutans.</strong> 
            By saving trees and choosing good products, we can make sure wild orangutans have a safe home. 
            <em style="color: #991B1B;">We cannot watch bulldozers knock down the green trees.</em> 
            <strong style="color: #1B4D3E; background: #FEF08A; padding: 2px 6px; border-radius: 4px;">The time to act is right now—will you help protect wild orangutans before they are gone forever?</strong>
          </p>
        </div>

      </div>

      <div style="background: #FDF4FF; border-left: 5px solid #A855F7; padding: 16px; border-radius: 6px; font-size: 20px; color: #7E22CE;">
        🚀 <strong>Conclusion Formula:</strong> Re-state Stance (Purple) ➔ Summarise Core Solution ➔ Metaphor Warning ➔ Final Call Question (Yellow).
      </div>
    </div>

    <!-- Right Column: Interactive Conclusion Builder -->
    <div style="background: #FFFFFF; border: 2px solid #1B4D3E; border-radius: 12px; padding: 28px; display: flex; flex-direction: column; justify-content: space-between;">
      <div>
        <h3 style="font-size: 28px; color: #1B4D3E; margin-bottom: 18px; font-weight: 700;">Student Activity: Conclusion Checklist</h3>
        
        <div style="display: flex; flex-direction: column; gap: 14px;">
          <div style="display: flex; align-items: center; gap: 14px; background: #F8FAFC; padding: 14px; border-radius: 8px; border: 1px solid #E2E8F0;">
            <span style="background: #22C55E; color: white; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 20px;">✓</span>
            <span style="font-size: 20px; color: #1E293B; font-weight: 600;">Re-state opinion using fresh words</span>
          </div>

          <div style="display: flex; align-items: center; gap: 14px; background: #F8FAFC; padding: 14px; border-radius: 8px; border: 1px solid #E2E8F0;">
            <span style="background: #22C55E; color: white; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 20px;">✓</span>
            <span style="font-size: 20px; color: #1E293B; font-weight: 600;">Summarise core solutions (save trees, choose sustainable)</span>
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
        <h4 style="font-size: 20px; color: #1B4D3E; font-weight: 700; margin-bottom: 4px;">✍️ Construction Rule for Your Essay:</h4>
        <p style="font-size: 19px; color: #334155; line-height: 1.4;">Your final sentence must stay in the reader's mind. Use a strong final question!</p>
      </div>
    </div>
  </div>

  <div class="teacher-notes" style="display: none;">
    <h3>Teacher Notes — Conclusion Analysis</h3>
    <p><strong>DO:</strong> Guide students to contrast a weak conclusion with an A-Standard call to action.</p>
    <p><strong>WORK:</strong> Have students draft their final closing rhetorical question.</p>
    <p><strong>RECORD:</strong> Students write down their final call-to-action sentence.</p>
    <p><strong>CHECK:</strong> Hear 3 closing sentences from the class.</p>
  </div>
</section>

<!-- Slide 7: Part A Student Planning Sheet Blueprint -->
<section class="slide theme-light" id="slide-7">
  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
    <h2 style="font-size: 44px; color: #1B4D3E; margin: 0; font-weight: 700;">Slide 7: Part A Planning Sheet (Organising Your Research)</h2>
    <span style="background: #DBEAFE; color: #1E40AF; padding: 8px 20px; border-radius: 20px; font-weight: 700; font-size: 20px;">Planning Strategy</span>
  </div>

  <div style="height: calc(100% - 90px); overflow-y: auto;">
    <!-- Standard Pathway Table -->
    <div class="standard-only">
      <table style="width: 100%; border-collapse: collapse; background: #FFFFFF; border: 2px solid #1B4D3E; border-radius: 8px; font-size: 22px;">
        <thead>
          <tr style="background: #1B4D3E; color: #ffffff;">
            <th style="padding: 16px; text-align: left; width: 25%; font-size: 24px;">Planning Category</th>
            <th style="padding: 16px; text-align: left; width: 75%; font-size: 24px;">Exemplar Student Details (Orangutans &amp; Palm Oil)</th>
          </tr>
        </thead>
        <tbody>
          <tr style="background: #F7FAF8; border-bottom: 1px solid #E2E8F0;">
            <td style="padding: 14px 16px; font-weight: 700; color: #1B4D3E;">Topic &amp; Stance</td>
            <td style="padding: 14px 16px; color: #1E293B;">Eradicating uncertified palm oil farms in Indonesia to save critically endangered orangutans.</td>
          </tr>
          <tr style="background: #FFFFFF; border-bottom: 1px solid #E2E8F0;">
            <td style="padding: 14px 16px; font-weight: 700; color: #1B4D3E;">Audience &amp; Formality</td>
            <td style="padding: 14px 16px; color: #1E293B;">School community, young consumers, and consumer action groups. Formal, passionate, urgent, and evidence-based tone.</td>
          </tr>
          <tr style="background: #F7FAF8; border-bottom: 1px solid #E2E8F0;">
            <td style="padding: 14px 16px; font-weight: 700; color: #1B4D3E;">Hook Strategy</td>
            <td style="padding: 14px 16px; color: #1E293B;">Sensory contrast: Lush green ancient rainforest vs crushing roar of heavy bulldozers flattening trees.</td>
          </tr>
          <tr style="background: #FFFFFF; border-bottom: 1px solid #E2E8F0;">
            <td style="padding: 14px 16px; font-weight: 700; color: #1B4D3E;">Argument 1 (Habitat Loss)</td>
            <td style="padding: 14px 16px; color: #1E293B;">WWF reports >80% orangutan habitat cleared in 20 years. Quote from primatologist Dr Biruté Galdikas on extinction risk.</td>
          </tr>
          <tr style="background: #F7FAF8; border-bottom: 1px solid #E2E8F0;">
            <td style="padding: 14px 16px; font-weight: 700; color: #1B4D3E;">Argument 2 (Ecosystem Collapse)</td>
            <td style="padding: 14px 16px; color: #1E293B;">IUCN data reveals orangutan populations plunged over 60%. Rainforest biodiversity hotspots destroyed for cheap palm oil.</td>
          </tr>
          <tr style="background: #FFFFFF; border-bottom: 1px solid #E2E8F0;">
            <td style="padding: 14px 16px; font-weight: 700; color: #1B4D3E;">Counterargument &amp; Rebuttal</td>
            <td style="padding: 14px 16px; color: #1B4D3E;">Counter: Palm oil provides farmer income. Rebuttal: Eco-tourism and RSPO-certified farming create jobs without destroying forests.</td>
          </tr>
          <tr style="background: #F7FAF8;">
            <td style="padding: 14px 16px; font-weight: 700; color: #1B4D3E;">Persuasive Devices</td>
            <td style="padding: 14px 16px; color: #1E293B;">Rhetorical questions, rule of three, high-modality verbs (must, urgently, cannot), expanded noun groups, expert quotes.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Support Pathway Table (Calibrated for lower reading complexity) -->
    <div class="lucas-only">
      <table style="width: 100%; border-collapse: collapse; background: #FFFFFF; border: 2px solid #1B4D3E; border-radius: 8px; font-size: 22px;">
        <thead>
          <tr style="background: #1B4D3E; color: #ffffff;">
            <th style="padding: 16px; text-align: left; width: 25%; font-size: 24px;">Planning Step</th>
            <th style="padding: 16px; text-align: left; width: 75%; font-size: 24px;">My Essay Plan Details</th>
          </tr>
        </thead>
        <tbody>
          <tr style="background: #F7FAF8; border-bottom: 1px solid #E2E8F0;">
            <td style="padding: 14px 16px; font-weight: 700; color: #1B4D3E;">Topic &amp; Opinion</td>
            <td style="padding: 14px 16px; color: #1E293B;">Saving orangutans from bad palm oil farms. We must stop cutting down rainforest trees right now.</td>
          </tr>
          <tr style="background: #FFFFFF; border-bottom: 1px solid #E2E8F0;">
            <td style="padding: 14px 16px; font-weight: 700; color: #1B4D3E;">Hook Idea</td>
            <td style="padding: 14px 16px; color: #1E293B;">Picture a green jungle with singing birds, then bulldozers knocking down trees.</td>
          </tr>
          <tr style="background: #F7FAF8; border-bottom: 1px solid #E2E8F0;">
            <td style="padding: 14px 16px; font-weight: 700; color: #1B4D3E;">Reason 1 (Habitat Loss)</td>
            <td style="padding: 14px 16px; color: #1E293B;">WWF found 80% of forests cleared. Dr Galdikas warns orangutans could disappear forever.</td>
          </tr>
          <tr style="background: #FFFFFF; border-bottom: 1px solid #E2E8F0;">
            <td style="padding: 14px 16px; font-weight: 700; color: #1B4D3E;">Reason 2 (Animal Crisis)</td>
            <td style="padding: 14px 16px; color: #1E293B;">IUCN data shows over half of wild orangutans are gone. Rainforests are home to thousands of animals.</td>
          </tr>
          <tr style="background: #F7FAF8; border-bottom: 1px solid #E2E8F0;">
            <td style="padding: 14px 16px; font-weight: 700; color: #1B4D3E;">What Others Say (Rebuttal)</td>
            <td style="padding: 14px 16px; color: #1E293B;">Some say farmers need palm oil for money. But farmers can grow safe crops and lead eco-tours to protect both!</td>
          </tr>
          <tr style="background: #FFFFFF;">
            <td style="padding: 14px 16px; font-weight: 700; color: #1B4D3E;">Ending Question</td>
            <td style="padding: 14px 16px; color: #1E293B;">"Will you help protect wild orangutans before they are gone forever?"</td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>

  <div class="teacher-notes" style="display: none;">
    <h3>Teacher Notes — Planning Sheet Overview</h3>
    <p><strong>DO:</strong> Emphasize completing planning sheet BEFORE drafting.</p>
    <p><strong>WORK:</strong> Hand out blank planning templates for student topics.</p>
    <p><strong>RECORD:</strong> Students fill out Topic, Stance, and 3 Arguments.</p>
    <p><strong>CHECK:</strong> Sign off on student plans.</p>
  </div>
</section>

<!-- Slide 8: Part B Speaking & Listening Delivery Annotations -->
<section class="slide theme-light" id="slide-8">
  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
    <h2 style="font-size: 44px; color: #1B4D3E; margin: 0; font-weight: 700;">Slide 8: Part B Oral Presentation (Voice &amp; Gesture Coach)</h2>
    <span style="background: #FCE7F3; color: #BE185D; padding: 8px 20px; border-radius: 20px; font-weight: 700; font-size: 20px;">Part B Spoken Presentation</span>
  </div>

  <div style="display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 30px; height: calc(100% - 100px);">
    <!-- Left Column: Speech Script -->
    <div style="background: #FFF5F5; border: 2px solid #F43F5E; border-radius: 12px; padding: 28px; overflow-y: auto;">
      <h3 style="font-size: 26px; color: #BE185D; margin-bottom: 14px; font-weight: 700;">Annotated Speech Script Excerpt</h3>
      
      <div style="background: #FFFFFF; padding: 14px; border-radius: 8px; border: 1px solid #FECDD3; margin-bottom: 14px;">
        <span style="color: #D97706; font-weight: 700; font-size: 18px;">[VISUAL CUE: Slide showing orangutan mother &amp; infant in rainforest canopy]</span>
      </div>

      <!-- Standard Pathway Speech Script -->
      <div class="standard-only">
        <p style="font-size: 24px; line-height: 1.5; color: #1E293B; margin-bottom: 14px;">
          <span style="color: #2563EB; font-style: italic; font-weight: 600;">[TONE: Warm, engaging. PACE: Moderate. GESTURE: Direct eye contact, open hands]</span><br>
          Good morning teachers and classmates.
        </p>

        <p style="font-size: 24px; line-height: 1.5; color: #1E293B; margin-bottom: 14px;">
          <span style="color: #DC2626; font-style: italic; font-weight: 600;">[PAUSE - 2 seconds. PITCH: Drops slightly to a serious tone]</span><br>
          Imagine walking through a lush, ancient Indonesian rainforest, surrounded by towering emerald trees, only to hear the crushing roar of a bulldozer flattening everything in its path.
        </p>

        <p style="font-size: 24px; line-height: 1.5; color: #1E293B; margin-bottom: 14px;">
          <span style="color: #16A34A; font-style: italic; font-weight: 600;">[TONE: Urgent, firm. EMPHASIS on 'devastating' and 'right now']</span><br>
          This devastating reality is happening right now across Sumatra and Borneo!
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
          Picture a green rainforest with singing birds. Now imagine noisy bulldozers knocking down all the big trees.
        </p>

        <p style="font-size: 24px; line-height: 1.5; color: #1E293B; margin-bottom: 14px;">
          <span style="color: #16A34A; font-style: italic; font-weight: 600;">[TONE: Strong &amp; clear. EMPHASIS on 'save wild orangutans']</span><br>
          We must stop bad palm oil farming right now to save wild orangutans!
        </p>
      </div>

    </div>

    <!-- Right Column: Voice Features Guide -->
    <div style="background: #FFFFFF; border: 2px solid #1B4D3E; border-radius: 12px; padding: 28px; display: flex; flex-direction: column; justify-content: space-between;">
      <div>
        <h3 style="font-size: 28px; color: #1B4D3E; margin-bottom: 18px; font-weight: 700;">Features of Voice Checklist (Part B Rubric)</h3>
        
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
        <h4 style="font-size: 20px; color: #1B4D3E; font-weight: 700; margin-bottom: 4px;">✍️ Presentation Practice Rule:</h4>
        <p style="font-size: 19px; color: #334155; line-height: 1.4;">Do NOT read your essay like a script! Annotate your notes with voice markers and speak directly to your audience!</p>
      </div>
    </div>
  </div>

  <div class="teacher-notes" style="display: none;">
    <h3>Teacher Notes — Presentation Annotations</h3>
    <p><strong>DO:</strong> Demonstrate reading speech excerpt twice: monotone vs annotated voice features.</p>
    <p><strong>WORK:</strong> Have students annotate 2 sentences of their draft.</p>
    <p><strong>RECORD:</strong> Peers provide feedback.</p>
    <p><strong>CHECK:</strong> Hear 2 student volunteers.</p>
  </div>
</section>

<!-- Slide 9: Student Self-Assessment & Checklist -->
<section class="slide theme-light" id="slide-9">
  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
    <h2 style="font-size: 44px; color: #1B4D3E; margin: 0; font-weight: 700;">Slide 9: Student Self-Assessment &amp; Success Criteria</h2>
    <span style="background: #DCFCE7; color: #15803D; padding: 8px 20px; border-radius: 20px; font-weight: 700; font-size: 20px;">Checklist for Success</span>
  </div>

  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; height: calc(100% - 100px);">
    <!-- Left Column: Part A Checklist -->
    <div style="background: #FFFFFF; border: 2px solid #1B4D3E; border-radius: 12px; padding: 28px; display: flex; flex-direction: column; justify-content: space-between;">
      <div>
        <h3 style="font-size: 28px; color: #1B4D3E; margin-bottom: 18px; font-weight: 700;">📝 Part A: Written Essay Checklist</h3>
        
        <div style="display: flex; flex-direction: column; gap: 14px;">
          <label style="display: flex; align-items: center; gap: 14px; font-size: 22px; color: #1E293B; cursor: pointer;">
            <input type="checkbox" style="width: 26px; height: 26px; accent-color: #1B4D3E;">
            <span>5-paragraph structure with clear opinion in Intro</span>
          </label>

          <label style="display: flex; align-items: center; gap: 14px; font-size: 22px; color: #1E293B; cursor: pointer;">
            <input type="checkbox" style="width: 26px; height: 26px; accent-color: #1B4D3E;">
            <span>Topic sentences for every body paragraph</span>
          </label>

          <label style="display: flex; align-items: center; gap: 14px; font-size: 22px; color: #1E293B; cursor: pointer;">
            <input type="checkbox" style="width: 26px; height: 26px; accent-color: #1B4D3E;">
            <span>At least 2 expert sources or real facts (WWF, Dr Galdikas, stats)</span>
          </label>

          <label style="display: flex; align-items: center; gap: 14px; font-size: 22px; color: #1E293B; cursor: pointer;">
            <input type="checkbox" style="width: 26px; height: 26px; accent-color: #1B4D3E;">
            <span>Addressed opposing view with a strong rebuttal</span>
          </label>

          <label style="display: flex; align-items: center; gap: 14px; font-size: 22px; color: #1E293B; cursor: pointer;">
            <input type="checkbox" style="width: 26px; height: 26px; accent-color: #1B4D3E;">
            <span>Descriptive words &amp; strong action words (must, save)</span>
          </label>

          <label style="display: flex; align-items: center; gap: 14px; font-size: 22px; color: #1E293B; cursor: pointer;">
            <input type="checkbox" style="width: 26px; height: 26px; accent-color: #1B4D3E;">
            <span>Conclusion with restated opinion &amp; final question</span>
          </label>
        </div>
      </div>

      <div style="background: #F0FDF4; padding: 14px; border-radius: 8px; border-left: 5px solid #16A34A; font-size: 19px; color: #166534;">
        Target length: 200–400 words (QCAA/AC guidelines).
      </div>
    </div>

    <!-- Right Column: Part B Checklist -->
    <div style="background: #FFFFFF; border: 2px solid #1B4D3E; border-radius: 12px; padding: 28px; display: flex; flex-direction: column; justify-content: space-between;">
      <div>
        <h3 style="font-size: 28px; color: #1B4D3E; margin-bottom: 18px; font-weight: 700;">🎤 Part B: Spoken Presentation Checklist</h3>
        
        <div style="display: flex; flex-direction: column; gap: 14px;">
          <label style="display: flex; align-items: center; gap: 14px; font-size: 22px; color: #1E293B; cursor: pointer;">
            <input type="checkbox" style="width: 26px; height: 26px; accent-color: #1B4D3E;">
            <span>Annotated speech notes for pitch, tone, pace, and pauses</span>
          </label>

          <label style="display: flex; align-items: center; gap: 14px; font-size: 22px; color: #1E293B; cursor: pointer;">
            <input type="checkbox" style="width: 26px; height: 26px; accent-color: #1B4D3E;">
            <span>Maintained eye contact with audience (not just reading)</span>
          </label>

          <label style="display: flex; align-items: center; gap: 14px; font-size: 22px; color: #1E293B; cursor: pointer;">
            <input type="checkbox" style="width: 26px; height: 26px; accent-color: #1B4D3E;">
            <span>Used clear hand gestures and open body language</span>
          </label>

          <label style="display: flex; align-items: center; gap: 14px; font-size: 22px; color: #1E293B; cursor: pointer;">
            <input type="checkbox" style="width: 26px; height: 26px; accent-color: #1B4D3E;">
            <span>Integrated visual slide cues (images, graphs, quotes)</span>
          </label>

          <label style="display: flex; align-items: center; gap: 14px; font-size: 22px; color: #1E293B; cursor: pointer;">
            <input type="checkbox" style="width: 26px; height: 26px; accent-color: #1B4D3E;">
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
    <p><strong>DO:</strong> Have students review draft essay against checklists.</p>
    <p><strong>WORK:</strong> Students check off items achieved.</p>
    <p><strong>RECORD:</strong> Write down 1 revision goal.</p>
    <p><strong>FINISH:</strong> Collect exit tickets.</p>
  </div>
</section>
`;

const extraHead = `
<style>
  #pathwayToggle {
    position: fixed !important;
    top: 20px !important;
    right: 25px !important;
    z-index: 1100 !important;
    display: flex !important;
    align-items: center !important;
    background: rgba(27, 77, 62, 0.9) !important;
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

const outputPath = path.resolve(__dirname, 'Exemplar_Presentation_Orangutan_Palm_Oil.html');

compilePresentation({
  slidesHtml: slidesHtml,
  outputPath: outputPath,
  title: 'Silent Voices of the Rainforest — Persuasive Writing Presentation',
  extraHead: extraHead,
  extraScripts: extraScripts
});

console.log('Successfully compiled high-visibility dual-pathway interactive presentation to: ' + outputPath);
