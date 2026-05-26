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
  secondary: '#9e4300'
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

The design system is engineered for high-engagement educational environments, specifically tailored for Year 5 learners and beyond. The brand personality is **Professional yet Kinetic**, balancing the authoritative tone of a scientific or emergency services presentation with the energetic responsiveness required in modern digital learning. 

The aesthetic is a hybrid of **Modern Corporate** and **Neo-Brutalism**. It utilises structured grids, high-contrast typography, and functional "glassmorphism" for utility layers (like toolbars), while employing heavy "hard shadows" and thick borders for interactive elements. This approach, "Visual Weight as Feedback," ensures that every interactable component feels tactile and physically present, reducing cognitive load for students by clearly signalling clickability and state changes.

## Colours

The colour strategy uses a deep Navy (`primary`) to establish authority and trust, paired with a vibrant Orange (`secondary`) used exclusively for calls-to-action, highlights, and interactive accents.

- **Primary & Secondary**: Used for structural elements and focus. The orange is a high-energy accent that draws the eye to titles and active states.
- **Surface & Background**: A near-white (`neutral`) is the default canvas to reduce eye strain, while pure white is reserved for interactive cards and quiz components to make them "pop" against the background.
- **Functional Feedback**: Success (Green) and Error (Red) are high-saturation tokens used for immediate feedback in quizzes and logic-based interactions.
- **Thematic Variants**: Soft blue and soft orange tints are used for background categorisation (e.g., differentiating 12-hour and 24-hour formats).

## Typography

This design system differentiates between the **Presentation Layer** and the **Information Layer**:
- **Outfit (Headlines)**: Used for high-impact titles. It is geometric and modern, providing a bold entry point for each slide.
- **Inter (Content)**: Chosen for its extreme legibility in complex layouts. It handles all body text, quiz questions, and card data.

For large-screen visibility, base font sizes are significantly larger than standard web sizes. When scaling to mobile, headers should downscale to the `mobile` variants to ensure content remains readable without excessive scrolling.

## Layout & Spacing

The layout uses a **Fixed Grid** philosophy optimised for landscape presentation screens (16:9 aspect ratio). 

- **Slide Margins**: Generous padding ensures content is never obscured by bezels or floating toolbars. The bottom padding is specifically enlarged to accommodate the navigation bar.
- **Grid Systems**: Interactive tasks (sorting, matching, quizzes) typically utilise a `repeat(2, 1fr)` or `repeat(3, 1fr)` grid with consistent 24px gaps.
- **Responsive Reflow**: On smaller breakpoints, 2-column grids collapse into a single vertical column. Content margins reduce from 70px to 24px to maximise screen real estate.

## Elevation & Depth

Depth is used functionally to separate the "Stage" from the "Tools":

1.  **Glassmorphism (Control Layer)**: The floating presentation toolbar uses a backdrop blur (12px) and 85% opacity navy fill. This keeps the controls accessible but visually distinct from the learning content.
2.  **Hard Shadows (Interactive Layer)**: Interactive components like quiz boxes and buttons do not use soft blurs. Instead, they use offset "hard" shadows (6px for secondary, 4px for primary) to create a neo-brutalistic "pressed button" feel.
3.  **Tonal Overlays**: Lightboxes and teacher notes use semi-transparent overlays to dim the main stage, focusing the user's attention on the modal content.

## Shapes

The shape language is primarily **Soft (0.25rem - 0.75rem)**, moving away from sharp edges to feel more approachable for students while maintaining a clean, structured appearance.

- **Standard Elements**: 6px - 8px radius (Buttons, Quiz strips).
- **Large Cards**: 12px radius (Time comparison cards).
- **Utility Elements**: Full pill-shaped (50%) for the main toolbar and navigation dots.
- **Borders**: All primary interaction boxes feature a 3px solid border to match the weight of the typography.

## Components

### Quiz Boxes & Buttons
The core interaction unit. 
- **Default**: White surface, 3px Navy border, 6px Navy hard shadow.
- **Success State**: Background shifts to Green-Success, border stays Navy or shifts to dark green, shadow persists.
- **Error State**: Background shifts to Red-Error, triggers a horizontal "shake" animation.
- **Active State**: On click, the box should translate (move) 2px down and right to simulate the "pressing" of the shadow.

### Sort Zones & Sequencing Strips
- **Sort Zones**: 8px rounded corners with a dashed 3px border in Navy or Orange to indicate a "drop" area.
- **Sequencing Strips**: Thin horizontal cards (6px radius) with 4px hard shadows. These use high-contrast Inter (Medium) font for clarity.

### Callout Boxes (Remember / Scenario)
- **Visuals**: Soft grey background with a thick (6px) vertical accent border on the left side. The colour of the accent border indicates the type of content (e.g., Orange for "Remember," Blue for "Scenario").

### Presentation Toolbar
- **Style**: Floating capsule, blurred navy background.
- **Icons**: 24px SVGs in `text-muted` colour, shifting to `secondary` (Orange) when active.
