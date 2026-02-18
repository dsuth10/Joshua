# Joshua Project Templates

This directory serves as the central repository for all reusable templates and design assets within the Joshua Project.

## Directory Structure

- **`Web/`**: Contains HTML/CSS/JS layouts for digital learning resources.
    - `Web_Lesson_Starter/`: The primary "RADICAL RIVER" premium lesson template.
    - `History_Magazine_Starter/`: Vintage editorial layout for historical events.
        - `index-classic.html`: Classic, high-contrast, blue/paper aesthetic (Tailwind + Noto Serif).
        - `index-vibrant.html`: Modern, colorful aesthetic with 'Playfair Display' and 'Outfit' fonts.
        - `index-pop.html`: High-energy infographic style with vibrant colors and bold typography.
- **`Lessons/`**: Templates for offline/printable documents (Lesson Plans, Worksheets).
- **`Design/`**: Shared design tokens, colour palettes, and brand assets.

## How to Use Templates

### For Web Lessons
1. Copy the contents of [`Templates/Web/Web_Lesson_Starter`](file:///c:/Users/dsuth/Documents/Joshua/Templates/Web/Web_Lesson_Starter/) to your new lesson directory.
2. Update the `index.html` with your content.
3. Replace placeholder images in its `assets/img/` folder.

### AI Integration
The AI (Antigravity Assistant) is configured to check this folder before creating new content. You can prompt:
> "Create a new web page about [Topic] using the RADICAL RIVER template."

## Template Guidelines
- **Sharpness**: Avoid rounded corners unless necessary for specific UI elements.
- **High Contrast**: Maintain accessibility and visual impact using the defined palette.
- **Micro-animations**: Use the built-in `reveal` classes for a premium feel.
- **Australian Standards**: Follow Australian spelling (e.g., 'colour') and metric measurements.
