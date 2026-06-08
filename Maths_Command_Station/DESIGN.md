---
name: Luminous Math Desktop
colors:
  surface: '#f9f9fc'
  surface-dim: '#dadadc'
  surface-bright: '#f9f9fc'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f6'
  surface-container: '#eeeef0'
  surface-container-high: '#e8e8ea'
  surface-container-highest: '#e2e2e5'
  on-surface: '#1a1c1e'
  on-surface-variant: '#434656'
  inverse-surface: '#2f3133'
  inverse-on-surface: '#f0f0f3'
  outline: '#737688'
  outline-variant: '#c3c5d9'
  surface-tint: '#004ced'
  primary: '#003ec7'
  on-primary: '#ffffff'
  primary-container: '#0052ff'
  on-primary-container: '#dfe3ff'
  inverse-primary: '#b7c4ff'
  secondary: '#585f6a'
  on-secondary: '#ffffff'
  secondary-container: '#dce3f0'
  on-secondary-container: '#5e6570'
  tertiary: '#005471'
  on-tertiary: '#ffffff'
  tertiary-container: '#006e92'
  on-tertiary-container: '#c6eaff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dde1ff'
  primary-fixed-dim: '#b7c4ff'
  on-primary-fixed: '#001452'
  on-primary-fixed-variant: '#0038b6'
  secondary-fixed: '#dce3f0'
  secondary-fixed-dim: '#c0c7d3'
  on-secondary-fixed: '#151c25'
  on-secondary-fixed-variant: '#404751'
  tertiary-fixed: '#c2e8ff'
  tertiary-fixed-dim: '#75d1ff'
  on-tertiary-fixed: '#001e2b'
  on-tertiary-fixed-variant: '#004d67'
  background: '#f9f9fc'
  on-background: '#1a1c1e'
  surface-variant: '#e2e2e5'
typography:
  display-lg:
    fontFamily: Space Grotesk
    fontSize: 64px
    fontWeight: '700'
    lineHeight: 72px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 40px
    fontWeight: '600'
    lineHeight: 48px
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-sm:
    fontFamily: Space Grotesk
    fontSize: 24px
    fontWeight: '500'
    lineHeight: 32px
  body-lg:
    fontFamily: Work Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Work Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  container-max-width: 1440px
  gutter: 32px
  margin: 64px
  stack-sm: 16px
  stack-md: 32px
  stack-lg: 48px
  card-padding: 32px
---

## Brand & Style

The design system is engineered for high-performance educational environments, focusing on clarity, intellectual energy, and mathematical precision. It targets a desktop-first audience of educators and students who require an expansive workspace for complex problem-solving. 

The aesthetic is **Corporate / Modern** with a lean toward **Minimalism**. It prioritizes a high-contrast interface to reduce cognitive load while maintaining an energetic "luminous" quality through vibrant blue accents. The UI should evoke a sense of professional reliability and scientific momentum, ensuring that the interface never distracts from the mathematical content.

## Colors

The palette is anchored by an energetic "Luminous Blue" primary color, designed to draw attention to interactive elements and progress indicators. 

- **Primary**: A high-vibrancy blue used for primary actions, selected states, and branding.
- **Secondary**: A soft, tinted wash used for large surface areas or background alternates to prevent eye strain.
- **Tertiary**: A cyan-leaning blue used for secondary data visualizations or success states.
- **Neutral**: A deep charcoal for typography to ensure maximum legibility against the stark white backgrounds.

Backgrounds should remain predominantly white (#FFFFFF) to maintain the "luminous" feel, utilizing subtle grey-blue borders for structural definition.

## Typography

This design system employs a sophisticated typographic hierarchy optimized for large-format displays. 

- **Headlines**: **Space Grotesk** provides a technical, geometric foundation that complements mathematical symbols and formulas.
- **Body**: **Work Sans** is used for its exceptional readability at scale, providing a neutral and grounded reading experience.
- **Labels & Data**: **JetBrains Mono** is utilized for mathematical notations, coordinates, and technical labels to differentiate data from prose.

The scale is intentionally oversized for desktop to take advantage of increased screen real estate, ensuring that headers remain prominent even when surrounded by dense numerical information.

## Layout & Spacing

The layout follows a **Fixed Grid** philosophy for content-heavy pages, centering a 1440px max-width container to maintain readable line lengths for mathematical proofs and exercises.

- **Grid**: A 12-column grid system with generous 32px gutters to provide significant "air" between UI components.
- **Desktop Margins**: Page-level margins are set to 64px to frame the content comfortably.
- **Padding**: Component internal padding has been increased for the desktop adaptation; cards and containers use 32px padding as a baseline to feel substantial and premium.
- **Vertical Rhythm**: A strict 8px base unit drives all spacing, with larger jumps (48px+) used to separate distinct conceptual sections.

## Elevation & Depth

This design system uses **Tonal Layers** combined with **Low-contrast outlines** to create a structured sense of depth without the clutter of heavy shadows.

- **Surface Levels**: The base canvas is white. Primary containers (cards) use a 1px border (#E2E8F0) with a very soft, diffused ambient shadow (0px 4px 20px rgba(0, 0, 0, 0.04)).
- **Hover States**: Interactive elements lift slightly using a tinted shadow that incorporates the primary blue (e.g., 0px 8px 24px rgba(0, 82, 255, 0.1)).
- **Modal Depth**: High-level overlays use a backdrop blur (12px) to maintain a sense of the "luminous" environment while focusing the user on the task at hand.

## Shapes

The design system utilizes a **Rounded** shape language (Level 2). This softens the technical nature of the content, making the math feel approachable rather than intimidating.

- **Standard Elements**: Buttons and input fields use a 0.5rem (8px) corner radius.
- **Containers**: Large cards and content modules use 1rem (16px) to clearly define them as distinct blocks of information.
- **Status Indicators**: Pills and tags use a fully rounded (32px+) radius to contrast against the more structural rectangular containers.

## Components

### Buttons
Primary buttons are solid Luminous Blue with white text, utilizing a bold weight for the label. Secondary buttons use a ghost style with a 1px primary border. On desktop, buttons have a minimum width of 120px and a height of 48px to provide a generous click target.

### Cards
Cards are the primary vehicle for mathematical exercises. They feature 32px padding, a subtle border, and a white background. When grouped, they should follow the 32px gutter spacing.

### Input Fields
Inputs for numerical entry use the monospaced label font. They feature a 2px bottom border that turns Luminous Blue on focus, providing a clear "active" signal during data entry.

### Chips & Tags
Used for categorizing math topics (e.g., "Calculus", "Geometry"). These are small, low-contrast elements with a 0.5rem radius, using the secondary blue color for the background to keep them subtle.

### Progress Containers
Given the educational nature, progress bars are highly visible, using a gradient from Tertiary Cyan to Primary Blue to indicate momentum and completion.