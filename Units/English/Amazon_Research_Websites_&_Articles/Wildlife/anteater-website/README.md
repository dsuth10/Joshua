# Amazon Anteater Website

An interactive, responsive website showcasing the fascinating world of Amazon anteaters - nature's most specialized pest controllers facing critical conservation challenges.

## 🎯 Features

### **📱 Responsive Design**
- Mobile-first approach with breakpoints at 768px and 480px
- Fluid layouts using CSS Grid and Flexbox
- Optimized for all device sizes

### **🎨 Visual Design**
- **Color Scheme**: Primary green (#2c5530), Primary blue (#4a90e2), Accent gold (#ffd700)
- **Typography**: Inter font family for modern, clean readability
- **Layout**: Card-based design with subtle shadows and gradients
- **Animations**: Smooth transitions, hover effects, and scroll-triggered animations

### **⚡ Interactive Features**
- **Smooth Scrolling Navigation**: Seamless section transitions
- **Mobile Navigation**: Hamburger menu for mobile devices
- **Scroll Animations**: Elements animate as they enter the viewport
- **Parallax Effects**: Hero image creates depth and movement
- **Counter Animations**: Statistics count up when visible
- **Typing Effect**: Hero title types out dynamically
- **Progress Bar**: Shows scroll progress through the page
- **Back-to-Top Button**: Easy navigation to the top
- **Loading Animations**: Smooth page load experience
- **Lazy Loading**: Images load as needed for performance

### **♿ Accessibility**
- **Keyboard Navigation**: Full keyboard support
- **Focus Management**: Clear focus indicators
- **Semantic HTML**: Proper heading hierarchy and landmarks
- **Alt Text**: Descriptive alt text for all images
- **ARIA Labels**: Screen reader friendly

## 📁 File Structure

```
anteater-website/
├── index.html          # Main HTML file with all content
├── styles.css          # Complete CSS styling and animations
├── script.js           # JavaScript for interactivity
└── README.md           # This documentation file
```

## 🚀 Getting Started

### **Option 1: Open Directly**
Simply open `index.html` in any modern web browser.

### **Option 2: Local Server (Recommended)**
For the best experience, serve the files through a local server:

**Using Python:**
```powershell
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

**Using Node.js:**
```powershell
npx serve .
```

Then visit `http://localhost:8000` in your browser.

## 📖 Content Sections

### **Hero Section**
- Striking hero image with overlay
- Animated title and statistics
- Call-to-action button
- Scroll indicator

### **About Section**
- Feature cards highlighting key characteristics
- Size and species information
- Conservation status details
- Lifespan and longevity facts

### **Lifestyle Section**
- Habitat and behavior information
- Thermal regulation challenges
- Maternal care and social behavior
- Habitat specialization details

### **Diet Section**
- Myrmecophagous feeding strategy
- Statistics on daily consumption
- Hunting techniques and adaptations
- Ecological feeding patterns

### **Adaptations Section**
- Specialized physical adaptations
- Knuckle-walking locomotion
- Thermal regulation challenges
- Defensive mechanisms
- Sensory capabilities

### **Ecological Role Section**
- Keystone species importance
- Ecosystem services provided
- Soil aeration and seed dispersal
- Water hole creation benefits

### **Threats Section**
- Highway mortality statistics
- Fire catastrophe impacts
- Habitat fragmentation effects
- Pesticide poisoning risks
- Climate change amplification

### **Conservation Section**
- Current conservation initiatives
- Success stories and statistics
- Rehabilitation programs
- Rewilding efforts
- Future conservation plans

## 🎨 Design Features

### **Color Palette**
- **Primary Green**: #2c5530 (Nature, growth, Amazon)
- **Primary Blue**: #4a90e2 (Water, trust, conservation)
- **Accent Gold**: #ffd700 (Energy, importance, highlights)
- **Neutral Grays**: Various shades for text and backgrounds

### **Typography**
- **Font Family**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700
- **Hierarchy**: Clear heading levels with appropriate sizing

### **Layout System**
- **CSS Grid**: For complex layouts and card arrangements
- **Flexbox**: For navigation, stats, and flexible content
- **Container**: Max-width containers for content centering
- **Spacing**: Consistent padding and margins throughout

## 📱 Responsive Breakpoints

### **Desktop (1200px+)**
- Full layout with all features
- Multi-column grids
- Hover effects and animations

### **Tablet (768px - 1199px)**
- Adjusted grid layouts
- Maintained functionality
- Optimized touch interactions

### **Mobile (480px - 767px)**
- Single-column layouts
- Hamburger navigation
- Simplified animations
- Touch-friendly buttons

### **Small Mobile (<480px)**
- Minimal animations
- Optimized for small screens
- Essential functionality only

## 🔧 Customization

### **Colors**
Modify the CSS custom properties in `styles.css`:
```css
:root {
    --primary-green: #2c5530;
    --primary-blue: #4a90e2;
    --accent-gold: #ffd700;
}
```

### **Content**
Update the HTML content in `index.html` to reflect different animals or topics while maintaining the same structure.

### **Images**
Replace Unsplash URLs with your own images or different stock photos.

## 🌐 Browser Support

- **Chrome**: 60+
- **Firefox**: 55+
- **Safari**: 12+
- **Edge**: 79+
- **Mobile Browsers**: iOS Safari 12+, Chrome Mobile 60+

## ⚡ Performance

- **Optimized Images**: Compressed and properly sized
- **Lazy Loading**: Images load as needed
- **Minimal Dependencies**: Only essential external resources
- **Efficient CSS**: Optimized selectors and properties
- **Smooth Animations**: Hardware-accelerated transforms

## 🔍 SEO Features

- **Semantic HTML**: Proper heading hierarchy
- **Meta Tags**: Title, description, and viewport
- **Alt Text**: Descriptive image alt attributes
- **Structured Content**: Logical content organization
- **Fast Loading**: Optimized for search engine ranking

## 🛠️ Development

### **Adding New Sections**
1. Copy existing section structure
2. Update content and images
3. Add navigation links
4. Test responsive behavior

### **Modifying Styles**
1. Use CSS custom properties for colors
2. Maintain consistent spacing
3. Test across all breakpoints
4. Ensure accessibility compliance

### **JavaScript Enhancements**
1. Follow existing patterns
2. Maintain performance
3. Add error handling
4. Test cross-browser compatibility

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For questions or issues, please refer to the documentation or create an issue in the repository.

---

**Built with ❤️ for Amazon wildlife conservation awareness**
