/**
 * Bushfire Archive - Educational Terminology Tooltips
 * 
 * Provides interactive pop-ups for difficult vocabulary and technical terms.
 * Targeting a 12-year-old audience.
 */

const GLOSSARY = {
    'radiant-heat': "Invisible heat energy that travels through the air. It can melt plastic or start fires before flames even touch them.",
    'relative-humidity': "The amount of moisture in the air. Low humidity means very dry air, which helps fire spread faster.",
    'topography': "The shape of the land (hills and valleys). Fire travels much faster up steep slopes.",
    'royal-commission': "A high-level government investigation into a major disaster to figure out how to prevent it from happening again.",
    'indian-ocean-dipole': "A climate pattern in the Indian Ocean. A 'positive' one causes severe droughts and heatwaves in Australia.",
    'positive-indian-ocean-dipole': "A climate pattern where waters near Africa are warmer than waters near Australia. This often reduces rain over Australia and increases heat and bushfire danger.",
    'cold-front': "A sudden block of cold air that replaces hot air. It causes violent wind shifts that can make a fire front suddenly much wider.",
    'combustion-zone': "The heart of the fire where fuel, heat, and oxygen react to create flames.",
    'ambient-temperature': "The temperature of the surrounding air, before the fire's own heat starts cooking things.",
    'kw-m': "Kilowatts per metre. It measures the intensity of fire by how much energy it puts out along the fire front.",
    'kilowatts-per-metre': "Kilowatts per metre. It measures the intensity of fire by how much energy it puts out along the fire front.",
    'ffdi': "Forest Fire Danger Index. A score that combines heat, wind, humidity, and drought to show how dangerous fire conditions are.",
    'go-bag': "A pre-packed emergency bag with essentials like water, food, and a radio, ready to grab if you have to leave quickly.",
    'mains-water': "Town water from pipes under the street. It often fails during big fires because too many people are using it at once.",
    'bal': "Bushfire Attack Level. A rating that shows how likely a building is to be damaged by embers or heat.",
    'containment-line': "A wide strip of land cleared of all plants and fuel to stop a fire from crossing.",
    'nomex': "A special fire-resistant material that won't melt or burn, keeping firefighters safe.",
    'sector-assignment': "A specific area of the fire that a particular group of firefighters is ordered to protect.",
    'wires': "Wildlife Information, Rescue and Education Service. They save and care for animals hurt in bushfires.",
    'catastrophic': "The worst level of fire danger. It means fires will be so fast and hot that they cannot be controlled.",
    'firms': "Fire Information for Resource Management System. A NASA service providing global fire location data using satellite sensors.",
    'modis': "Moderate Resolution Imaging Spectroradiometer. A key instrument on NASA satellites that monitors fire hotspots twice daily.",
    'viirs': "Visible Infrared Imaging Radiometer Suite. A high-resolution instrument used to detect thermal anomalies and fire growth patterns.",
    'thermal-anomalies': "Heat variations on the Earth's surface detected by satellites, often indicating active fires or hotspots.",
    'blacking-out': "The process of extinguishing or removing burning material near control lines to prevent re-ignition.",
    'lats': "Large Air Tankers. Heavily modified aircraft capable of dropping thousands of litres of retardant to control fire spread.",
    'fire-retardant': "A chemical mixture that inhibits combustion. When applied to vegetation, it reduces the probability of ignition.",
    'convection': "The upward movement of heated air and smoke. During extreme fires, convection can create its own thunderstorm systems.",
    'crown-fire': "The most intense type of bushfire, where flames move rapidly through the treetops (canopy) rather than just on the ground.",
    'dozer-line': "A containment line created by a bulldozer stripping all fuel and vegetation down to mineral soil.",
    'fuel-loads': "The volume of flammable vegetation, such as dry leaves and twigs, available to feed a fire in a specific area.",
    'tonnes-per-hectare': "A way to measure fuel load: how many tonnes of burnable vegetation are spread across one hectare of land.",
    'spotting': "When wind-blown embers and firebrands start new fires ahead of the main fire front, bypassing containment lines.",
    'regional-surveillance': "Broad-area monitoring used to track fire activity across entire states or nations.",
    'tactical-reconnaissance': "Direct, local-level data gathering used to support immediate firefighting decisions on the ground.",
    'prioritise': "To decide what is most urgent and should be handled first, based on risk to people, homes, and critical infrastructure.",
    'adf': "Australian Defence Force. The military organisation responsible for the defence of Australia and its national interests.",
    'rfs': "Rural Fire Service. The world's largest volunteer firefighting organisation, primarily operating in New South Wales.",
    'cfa': "Country Fire Authority. A volunteer and community-based fire and emergency services organisation in Victoria.",
    'nsw-rfs': "New South Wales Rural Fire Service. The world's largest volunteer fire service, specifically trained for landscape-scale bushfire suppression and prevention.",
    'escape-contingencies': "Pre-planned emergency procedures and exit routes for firefighters if a backburn or fire front behaves unexpectedly and threatens their safety.",
    'contingency-arrangements': "Alternative plans and resource reserves kept ready in case the primary firefighting strategy fails or conditions change rapidly.",
    'disciplined-coordination': "The precise, synchronised timing and communication between ground crews, air support, and commanding officers during high-risk operations.",
    'topography': "The study of the land's surface shape and features, such as hills and valleys, which directly influence how local winds move and how fast fire spreads.",
    'arson': "The criminal act of deliberately setting fire to property, vegetation, or structures. In a bushfire context, it is a significant cause of suspicious ignitions and is punishable by severe legal penalties.",
    'combustion-zone': "The active area of a fire where fuel, heat, and oxygen react chemically to produce flames. This zone generates the intense light and thermal energy that drives the fire's forward progress."
};

// Inject Tooltip Styles
const style = document.createElement('style');
style.textContent = `
    .archive-tooltip {
        position: fixed;
        background-color: rgba(10, 8, 6, 0.95);
        color: white;
        padding: 0.75rem 1rem;
        border-radius: 0.5rem;
        border: 1px solid #f97316;
        font-size: 0.875rem;
        line-height: 1.4;
        max-width: 280px;
        z-index: 10000;
        pointer-events: none;
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.4);
        transition: opacity 0.2s ease, transform 0.2s ease;
        opacity: 0;
        transform: translateY(10px);
        font-family: 'Outfit', sans-serif;
    }
    
    .archive-tooltip.visible {
        opacity: 1;
        transform: translateY(0);
    }
    
    [data-tooltip] {
        cursor: help;
        border-bottom: 2px dashed #f97316;
        padding-bottom: 2px;
        transition: background-color 0.2s ease;
    }
    
    [data-tooltip]:hover {
        background-color: rgba(249, 115, 22, 0.1);
    }
`;
document.head.appendChild(style);

let tooltipElement = null;

function createTooltip() {
    if (tooltipElement) return tooltipElement;
    tooltipElement = document.createElement('div');
    tooltipElement.className = 'archive-tooltip';
    document.body.appendChild(tooltipElement);
    return tooltipElement;
}

function showTooltip(target, event) {
    const key = target.getAttribute('data-tooltip');
    const content = GLOSSARY[key];
    
    if (!content) return;
    
    const tooltip = createTooltip();
    tooltip.textContent = content;
    
    // Position calculation
    const rect = target.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    
    let top = rect.top - tooltip.offsetHeight - 12;
    let left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2);
    
    // Boundary checks
    if (top < 10) {
        top = rect.bottom + 12; // Flip to bottom
    }
    
    if (left < 10) left = 10;
    if (left + tooltip.offsetWidth > window.innerWidth - 10) {
        left = window.innerWidth - tooltip.offsetWidth - 10;
    }
    
    tooltip.style.top = `${top}px`;
    tooltip.style.left = `${left}px`;
    tooltip.classList.add('visible');
}

function hideTooltip() {
    if (tooltipElement) {
        tooltipElement.classList.remove('visible');
    }
}

// Event Delegation
document.addEventListener('mouseover', (e) => {
    const target = e.target.closest('[data-tooltip]');
    if (target) {
        showTooltip(target, e);
    }
});

document.addEventListener('mouseout', (e) => {
    const target = e.target.closest('[data-tooltip]');
    if (target) {
        hideTooltip();
    }
});

// Mobile Touch Support
document.addEventListener('touchstart', (e) => {
    const target = e.target.closest('[data-tooltip]');
    if (target) {
        // If already visible, hide first or just update
        showTooltip(target, e);
        
        // Hide after 4 seconds on mobile
        setTimeout(() => hideTooltip(), 4000);
    } else {
        hideTooltip();
    }
}, { passive: true });

console.log('Bushfire Archive Tooltips Initialized');
