# Amazon River Dolphin: Interactive Website

A modern, responsive, and interactive website showcasing the Amazon River Dolphin (Boto) - the "Blushing Sentinel of the Flooded Forest."

## 🌟 Features

### Interactive Elements
- **Smooth Scrolling Navigation**: Fixed navigation bar with smooth scrolling to sections
- **Mobile-Responsive Design**: Fully responsive layout that works on all devices
- **Scroll Animations**: Elements animate as they come into view
- **Parallax Effects**: Hero image has subtle parallax scrolling
- **Counter Animations**: Statistics animate when scrolled into view
- **Typing Effect**: Hero title has a typewriter animation
- **Hover Effects**: Interactive cards with hover animations
- **Progress Bar**: Shows scroll progress at the top of the page
- **Back to Top Button**: Appears when scrolling down

### Content Sections
1. **Hero Section**: Stunning full-screen introduction with key statistics
2. **About Section**: Detailed information about the boto's characteristics
3. **Lifestyle Section**: Habitat and behavior information
4. **Diet Section**: Feeding habits and prey information
5. **Adaptations Section**: Specialized features for survival
6. **Threats Section**: Current challenges facing the species
7. **Conservation Section**: Hope and ongoing efforts
8. **Footer**: Links and resources

### Technical Features
- **Modern CSS Grid & Flexbox**: Responsive layouts
- **CSS Animations**: Smooth transitions and effects
- **Intersection Observer API**: Efficient scroll animations
- **Accessibility**: Keyboard navigation and focus management
- **Performance**: Lazy loading images and optimized animations
- **Cross-browser Compatibility**: Works on all modern browsers

## 📁 File Structure

```
amazon-river-dolphin-website/
├── index.html          # Main HTML file
├── styles.css          # CSS styles and animations
├── script.js           # JavaScript functionality
├── README.md           # This documentation
└── images/             # Image directory (if needed)
```

## 🚀 Getting Started

### Option 1: Open Directly
Simply open `index.html` in any modern web browser.

### Option 2: Local Server (Recommended)
For the best experience, serve the files through a local server:

**Using Python:**
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

**Using Node.js:**
```bash
# Install http-server globally
npm install -g http-server

# Run server
http-server
```

**Using PHP:**
```bash
php -S localhost:8000
```

Then visit `http://localhost:8000` in your browser.

## 🎨 Design Features

### Color Scheme
- **Primary Green**: #2c5530 (Amazon forest green)
- **Primary Blue**: #4a90e2 (River blue)
- **Accent Gold**: #ffd700 (Highlight color)
- **Neutral Grays**: Various shades for text and backgrounds

### Typography
- **Font Family**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700
- **Responsive**: Scales appropriately on all devices

### Layout
- **Container Width**: 1200px max-width
- **Grid System**: CSS Grid for complex layouts
- **Flexbox**: For simpler component layouts
- **Responsive Breakpoints**: 768px and 480px

## 📱 Responsive Design

The website is fully responsive with three main breakpoints:

- **Desktop**: 1200px and above
- **Tablet**: 768px - 1199px
- **Mobile**: Below 768px

### Mobile Features
- Hamburger menu for navigation
- Stacked layouts for better mobile viewing
- Touch-friendly button sizes
- Optimized typography scaling

## 🔧 Customization

### Adding New Sections
1. Add HTML structure in `index.html`
2. Add corresponding CSS in `styles.css`
3. Add any JavaScript functionality in `script.js`

### Changing Colors
Update the CSS custom properties in `styles.css`:
```css
:root {
    --primary-green: #2c5530;
    --primary-blue: #4a90e2;
    --accent-gold: #ffd700;
}
```

### Modifying Animations
Adjust animation timing and effects in `styles.css`:
```css
.feature-card {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}
```

## 🖼️ Images

The website uses high-quality images from Unsplash with proper attribution:
- **Hero Image**: Dolphin swimming (Photo by Winston Chen)
- **About Section**: Dolphin close-up (Photo by Олег Мороз)
- **Lifestyle Section**: Amazon River (Photo by Leon Beckert)
- **Conservation Section**: Amazon Rainforest (Photo by Jolame Chirwa)

All images are loaded directly from Unsplash URLs for optimal performance.

## 🌐 Browser Support

- **Chrome**: 60+
- **Firefox**: 55+
- **Safari**: 12+
- **Edge**: 79+
- **Mobile Browsers**: iOS Safari 12+, Chrome Mobile 60+

## 📊 Performance

- **Lazy Loading**: Images load as they come into view
- **Optimized Animations**: Uses CSS transforms and opacity for smooth performance
- **Minimal JavaScript**: Efficient event handling and observers
- **Compressed Images**: Optimized image sizes and formats

## ♿ Accessibility

- **Keyboard Navigation**: Full keyboard support
- **Focus Management**: Clear focus indicators
- **Screen Reader Friendly**: Semantic HTML structure
- **Color Contrast**: WCAG AA compliant color combinations
- **Alt Text**: Descriptive alt attributes for images

## 🔍 SEO Features

- **Semantic HTML**: Proper heading hierarchy and structure
- **Meta Tags**: Optimized title and description
- **Structured Content**: Logical content organization
- **Fast Loading**: Optimized for Core Web Vitals

## 🛠️ Development

### Adding New Features
1. **HTML**: Add semantic markup
2. **CSS**: Style with modern techniques
3. **JavaScript**: Add interactivity as needed
4. **Test**: Ensure cross-browser compatibility

### Best Practices Followed
- Mobile-first responsive design
- Progressive enhancement
- Performance optimization
- Accessibility standards
- Modern CSS techniques

## 📄 License

This project is created for educational and conservation awareness purposes. Images are from Unsplash and used with proper attribution.

## 🤝 Contributing

Feel free to suggest improvements or report issues. This website aims to raise awareness about the Amazon River Dolphin and conservation efforts.

## 📞 Support

For questions or support, please refer to the conservation resources listed in the footer of the website.

---

**Made with ❤️ for Amazon River Dolphin Conservation**
