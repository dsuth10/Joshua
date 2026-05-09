// floods-glossary.js

const glossaryTerms = {
    "catchment": "The entire area of land from which rainfall drains into a single river system",
    "hydrological": "The scientific study of the movement, distribution, and management of water",
    "inundation": "The act of flooding or covering land with water",
    "meteorological": "Relating to weather and atmospheric conditions",
    "topography": "The physical features of an area of land, including hills, valleys, and rivers",
    "barometric pressure": "The pressure of the atmosphere; low pressure systems often bring severe storms",
    "estuary": "The wide part of a river where it nears the sea and fresh water mixes with salty ocean tides",
    "estuarine": "Relating to an estuary",
    "bisects": "Cuts perfectly into two separate halves",
    "insidious": "A danger that develops gradually and stealthily, rather than suddenly",
    "paradox": "A situation or statement that seems completely contradictory or impossible",
    "atmospheric block": "A weather pattern that temporarily stalls and prevents other weather systems from moving across the map",
    "monsoonal trough": "A wide band of low-pressure clouds and rain that develops during the tropical wet season",
    "post-traumatic stress disorder (PTSD)": "A psychological condition that can occur after experiencing a terrifying or life-threatening event",
    "capital stock": "The factories, machinery, buildings, and infrastructure that a society relies on for economic production",
    "macroeconomic": "The branch of economics dealing with the performance and behavior of an entire country's economy",
    "paradigm": "A fundamental change in how people think about or approach a problem",
    "resilience": "The ability to withstand or recover quickly from difficult conditions",
    "democratisation": "Making something (like data or technology) accessible to everyone, not just experts",
    "permeable surfaces": "Materials that allow water to soak through them into the ground, like soil or grass, rather than concrete",
    "bioswales": "Sloped landscape features designed to capture, filter, and slowly drain surface water runoff",
    "floodplain": "The low-lying area alongside a river that is naturally prone to flooding",
    "hydrograph": "A graph showing how a river's water level or flow rate changes over time",
    "runoff": "Water from rain or snowmelt that flows across the surface of the land rather than soaking into the ground",
    "overland flow": "Water that flows across the surface of the land, often overwhelming stormwater drains",
    "storm surge": "An abnormal rise in sea level above normal tide levels, caused by the strong onshore winds and low air pressure of a storm",
    "storm tide": "The combined height of the normal astronomical tide PLUS a storm surge",
    "astronomical tide": "The regular rise and fall of sea level caused by the gravitational pull of the Moon and Sun",
    "ENSO": "El Niño–Southern Oscillation — a natural climate pattern that alternates between warmer (El Niño) and cooler (La Niña) sea surface temperatures in the Pacific Ocean",
    "La Niña": "A phase of ENSO when cooler Pacific sea temperatures bring above-average rainfall to eastern Australia",
    "compound flood": "A flood event caused by multiple simultaneous or successive flooding mechanisms, such as heavy rain, high tides, and saturated soils occurring together",
    "antecedent conditions": "The state of the catchment (especially soil moisture) before a flood-causing rain event; saturated soils dramatically increase runoff",
    "tidal backing": "The phenomenon where an incoming tide slows or reverses the downstream flow of a flooding river, causing water levels to rise higher than rainfall alone would produce",
    "fluvial geomorphology": "The study of how rivers change and shape the physical landscape over time",
    "impervious surface": "Hard surfaces (roads, rooftops, car parks) from which water cannot soak in, dramatically increasing runoff in urban areas",
    "riverine flooding": "Flooding caused by a river or creek overflowing its banks due to sustained heavy rainfall across its catchment",
    "flash flood": "A sudden and rapid flood, typically occurring within six hours of a heavy rainfall event and offering little warning time",
    "ex-tropical cyclone": "A tropical cyclone that has weakened and moved out of the tropics, but can still bring intense rainfall far inland"
};

document.addEventListener('DOMContentLoaded', () => {
    // Check if the global TooltipSystem is available (from tooltip.js)
    if (typeof TooltipSystem !== 'undefined') {
        const tooltipSystem = new TooltipSystem();

        // Find all span[data-tooltip] currently on the page
        const terms = document.querySelectorAll('span[data-tooltip]');
        
        terms.forEach(term => {
            // The tooltip string is stored directly in the data-tooltip attribute.
            // But if we want to dynamically attach from our central glossary based on the inner text:
            const textContent = term.innerText.toLowerCase();
            
            // If the HTML doesn't explicitly have the text in data-tooltip, inject it from the dictionary.
            // If the dictionary lacks the term, it falls back to whatever was provided in the HTML.
            for (const [key, definition] of Object.entries(glossaryTerms)) {
                if (textContent.includes(key.toLowerCase()) || key.toLowerCase().includes(textContent)) {
                    if (!term.getAttribute('data-tooltip') || term.getAttribute('data-tooltip') === "true" || term.getAttribute('data-tooltip') === "") {
                        term.setAttribute('data-tooltip', definition);
                    }
                    term.setAttribute('tabindex', '0');
                    tooltipSystem.attachEventHandlers(term);
                    break;
                }
            }
            
            // If it already had a valid data-tooltip string from the HTML
            if (term.getAttribute('data-tooltip') && term.getAttribute('data-tooltip').length > 5) {
                term.setAttribute('tabindex', '0');
                tooltipSystem.attachEventHandlers(term);
            }
        });
    } else {
        console.error("TooltipSystem global object is missing. Ensure tooltip.js is loaded before floods-glossary.js.");
    }
});
