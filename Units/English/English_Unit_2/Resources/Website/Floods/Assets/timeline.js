document.addEventListener('DOMContentLoaded', () => {
    const timelineNodes = document.querySelectorAll('.timeline-node');
    const sections = document.querySelectorAll('.event-section');
    
    if (timelineNodes.length === 0 || sections.length === 0) return;

    // Create a mapping from section ID to timeline node
    const nodeMap = new Map();
    timelineNodes.forEach(node => {
        const sectionId = node.getAttribute('data-section');
        if (sectionId) {
            nodeMap.set(sectionId, node);
        }
    });

    // Options for the IntersectionObserver
    const observerOptions = {
        root: null,
        // We trigger when the section crosses roughly the middle of the viewport
        rootMargin: '-30% 0px -60% 0px',
        threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Remove active class from all nodes
                timelineNodes.forEach(node => node.classList.remove('active'));
                
                // Add active class to intersecting node
                const activeNode = nodeMap.get(entry.target.id);
                if (activeNode) {
                    activeNode.classList.add('active');
                }
            }
        });
    }, observerOptions);

    // Observe each section
    sections.forEach(section => {
        sectionObserver.observe(section);
    });
    
    // Add click functionality for the timeline nodes to scroll smoothly
    timelineNodes.forEach(node => {
        node.addEventListener('click', () => {
            const sectionId = node.getAttribute('data-section');
            if (sectionId) {
                const section = document.getElementById(sectionId);
                if (section) {
                    const yOffset = -120; // Offset for the fixed header
                    const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset;
                    window.scrollTo({top: y, behavior: 'smooth'});
                }
            }
        });
        
        // Add cursor pointer style for clickable nodes
        node.style.cursor = 'pointer';
    });
});
