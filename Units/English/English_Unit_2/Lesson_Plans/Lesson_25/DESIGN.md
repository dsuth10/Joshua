---
name: Joshua Academy
colors:
  surface: '#fbf9f9'
  surface-dim: '#dbdada'
  surface-bright: '#fbf9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3f3'
  surface-container: '#efeded'
  surface-container-high: '#e9e8e8'
  surface-container-highest: '#e4e2e2'
  on-surface: '#1b1c1c'
  on-surface-variant: '#43474e'
  inverse-surface: '#303031'
  inverse-on-surface: '#f2f0f0'
  outline: '#74777f'
  outline-variant: '#c4c6cf'
  surface-tint: '#476083'
  primary: '#001833'
  on-primary: '#ffffff'
  primary-container: '#112d4e'
  on-primary-container: '#7c95bc'
  inverse-primary: '#afc8f1'
  secondary: '#fe7107'
  on-secondary: '#ffffff'
  secondary-container: '#fe7107'
  on-secondary-container: '#592200'
  tertiary: '#001832'
  on-tertiary: '#ffffff'
  tertiary-container: '#002d55'
  on-tertiary-container: '#6596d5'
  error: '#c62828'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d4e3ff'
  primary-fixed-dim: '#afc8f1'
  on-primary-fixed: '#001c3a'
  on-primary-fixed-variant: '#2f486a'
  secondary-fixed: '#ffdbcb'
  secondary-fixed-dim: '#ffb691'
  on-secondary-fixed: '#341100'
  on-secondary-fixed-variant: '#793100'
  tertiary-fixed: '#d3e3ff'
  tertiary-fixed-dim: '#a3c9ff'
  on-tertiary-fixed: '#001c39'
  on-tertiary-fixed-variant: '#004882'
  background: '#fbf9f9'
  on-background: '#1b1c1c'
  surface-variant: '#e4e2e2'
  success: '#2e7d32'
  surface-pure: '#ffffff'
  text-main: '#333333'
  text-muted: '#e0e0e0'
  thematic-blue: '#e3f2fd'
  thematic-orange: '#fff3e0'
typography:
  display-h1:
    fontFamily: Outfit
    fontSize: 72px
    fontWeight: '700'
    lineHeight: '1.1'
  slide-title:
    fontFamily: Outfit
    fontSize: 46px
    fontWeight: '700'
    lineHeight: '1.2'
  quiz-question:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
  intro-text:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '500'
    lineHeight: '1.5'
  body-main:
    fontFamily: Inter
    fontSize: 26px
    fontWeight: '400'
    lineHeight: '1.5'
  card-text:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '500'
    lineHeight: '1.4'
  caption:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  slide-title-mobile:
    fontFamily: Outfit
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  body-mobile:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.5'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  slide-padding-top: 40px
  slide-padding-x: 70px
  slide-padding-bottom: 80px
  container-gap: 28px
  grid-gap: 24px
  vertical-flow: 20px
  component-padding: 28px
---

## Brand & Style

The design system for **Lesson 25** is built to establish an immersive and tactile learning environment for Year 5 students preparing for their **Part A Reading and Viewing Assessment**. The design maintains Joshua Academy's **Professional yet Kinetic** brand personality, blending a clean, corporate structure with high-impact Neo-Brutalist elements to maximize focus and visual engagement.

For Lesson 25, this visual style is applied specifically to support text comprehension, structural decoding, and tectonic simulation:
*   **Standard Pathway:** Deep structural annotation layers, interactive diagram controls, and a gamified Comprehension Quiz Show.
*   **Lucas Pathway:** Differentiated Year 2 identification widgets using clear visual indicators, larger fonts, and interactive heading-finding cards.

## Colours

Our colour strategy uses a deep Navy (`primary`) to establish authority and trust, paired with a high-contrast Orange (`secondary`) for focus indicators, interactive triggers, and callouts.
*   **Primary & Secondary:** Navy handles structural framing and dark slide states, while Orange signals active states, highlighted text segments, and scoring rewards.
*   **Tonal Accents:** A thematic soft blue (`#e3f2fd`) is used for tectonic plate layers and structural annotation wrappers, contrasting with soft orange tints used to group terminology.
*   **Feedback System:** Saturation-rich Success Green (`#2e7d32`) and Error Red (`#c62828`) provide instant validation during quiz events and map interactions.

## Typography

The typography reinforces the distinction between the presentation outline and the content core:
*   **Outfit (Headlines):** Geometric and authoritative, providing a modern entry point for slide headers.
*   **Inter (Content):** Extremely legible at scale. Standard slides use high base sizes (24px to 28px) for classroom readability, while Lucas slides are scaled to 32px to match Year 2 visual standards.

## Spacing & Elevation

The layout maintains a **16:9 Landscape Slide Ratio** utilizing snap-scrolling. 
*   **Padding Limits:** Consistent 60px vertical and 100px horizontal padding guarantees that all slide content is clearly legible without risk of bezel overlay.
*   **Tactile Shadows:** Buttons and interactive cards feature offset hard shadows (6px for secondary elements, 4px for primary) rather than soft blurs. This "visual weight" makes the clickable boundaries feel physical and responsive.

## Components (Lesson 25 Specific)

### 1. Clickable Plate Tectonics Diagram
*   An SVG diagram displaying a realistic cross-section of tectonic boundaries (Convergent, Divergent, Transform).
*   Interactive clickable glowing hotspots placed along boundary lines.
*   Clicking a boundary highlights the plate boundary, triggers a key visual vector animation showing plate movement directions, and opens a secondary info box showing:
    - *Boundary Type*
    - *Plate Movement Vector*
    - *Geological Stress Type*
    - *Seismic Result (e.g., Earthquakes, Trench formation, Volcanic arcs)*

### 2. Interactive Annotation Text Decoders
*   A premium presentation card containing the Earthquakes classification and plate tectonics description paragraphs.
*   Key phrases and clauses are highlighted with a soft orange outline and underline.
*   Clicking on a highlighted text block toggles a stylized Neo-Brutalist sidebar or pop-in badge detailing:
    - *Text Structure Stage (General Statement / Description / Elaboration)*
    - *Target Language Feature (e.g., Expanded noun group, Complex sentence, Circunstantial starting point)*
    - *Pedagogical Breakdown (explaining HOW this feature contributes to precise informative meaning)*

### 3. Comprehension Quiz Show Game
*   A full-screen interactive game designed to simulate the skimming and scanning challenges of Part A.
*   **Visual Interface:** Large, centered cards for questions, with a 4-column horizontal or 2x2 grid for answer cards.
*   **Countdown Clock:** A thick pill-shaped progress bar that shrinks over 30 seconds.
*   **Live Score:** A digital points dashboard (+100 points for correct answer, -50 points for incorrect answer) with visual popups showing `+100` in green or `-50` in red on submission.
*   **Avatars:** Small peer avatar cards (e.g., Mia, Liam, Charlotte) on a mini "High Score Board" to create high engagement.

### 4. Lucas "Heading & Image Finder" Click Game
*   A mock-up layout of an online informative page about Earthquakes.
*   Lucas is guided to find and click on the main title, the section heading, and the secondary explanatory image.
*   Clicking the correct elements places a thick green dashed circle around them with a cheerful star icon and shows a voice-bubble message from the teacher mascot confirming: *"Awesome! That is the Heading!"* or *"Excellent! That image helps us understand the text!"*
