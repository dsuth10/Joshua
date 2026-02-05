<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Elemental Magic: Fire & Life | Magic Magazine</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;900&family=Inter:ital,wght@0,400;0,700;1,400&display=swap');

        :root {
            --ochre: #B12E21;
            --charcoal: #2B2B2B;
            --amber-glow: #FFBF00;
            --eucalyptus: #A6B0A3;
            --off-white: #F9F9F9;
            --8-point: 8px;
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            background-color: var(--charcoal);
            color: var(--off-white);
            font-family: 'Inter', sans-serif;
            line-height: 1.6;
            overflow-x: hidden;
        }

        .magazine-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: calc(var(--8-point) * 6);
            background-color: var(--charcoal);
            position: relative;
            box-shadow: 0 0 100px rgba(0, 0, 0, 0.5);
        }

        /* Typography */
        h1,
        h2,
        h3 {
            font-family: 'Outfit', sans-serif;
            text-transform: uppercase;
            letter-spacing: -0.02em;
        }

        h1 {
            font-size: clamp(3rem, 10vw, 6rem);
            font-weight: 900;
            line-height: 0.9;
            color: var(--ochre);
            margin-bottom: calc(var(--8-point) * 2);
        }

        h2 {
            font-size: clamp(1.5rem, 5vw, 2.5rem);
            color: var(--amber-glow);
            margin-bottom: calc(var(--8-point) * 4);
            border-bottom: 2px solid var(--ochre);
            display: inline-block;
        }

        h3 {
            font-size: 1.25rem;
            color: var(--eucalyptus);
            margin-bottom: var(--8-point);
        }

        p {
            margin-bottom: calc(var(--8-point) * 3);
            font-size: 1.1rem;
            color: rgba(249, 249, 249, 0.9);
        }

        /* Layout Elements */
        .hero-section {
            position: relative;
            height: 80vh;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            margin-bottom: calc(var(--8-point) * 10);
            overflow: hidden;
        }

        .hero-img {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            z-index: 1;
            filter: brightness(0.6);
        }

        .hero-content {
            position: relative;
            z-index: 2;
            padding: calc(var(--8-point) * 4);
            background: linear-gradient(transparent, var(--charcoal));
        }

        .editorial-grid {
            display: grid;
            grid-template-columns: repeat(12, 1fr);
            gap: calc(var(--8-point) * 4);
            margin-bottom: calc(var(--8-point) * 10);
        }

        .article-section {
            grid-column: span 12;
        }

        @media (min-width: 768px) {
            .article-section.split {
                grid-column: span 6;
            }

            .article-section.main {
                grid-column: span 8;
            }

            .article-section.side {
                grid-column: span 4;
            }
        }

        .animal-feature {
            background: rgba(43, 43, 43, 0.5);
            border: 1px solid rgba(166, 176, 163, 0.2);
            padding: calc(var(--8-point) * 4);
            margin-bottom: calc(var(--8-point) * 6);
            position: relative;
            transition: all 0.5s ease;
        }

        .animal-feature:hover {
            border-color: var(--amber-glow);
            transform: translateY(-5px);
            box-shadow: 0 10px 30px rgba(255, 191, 0, 0.1);
        }

        .animal-img {
            width: 100%;
            aspect-ratio: 16/9;
            object-fit: cover;
            margin-bottom: calc(var(--8-point) * 3);
            border: 1px solid var(--ochre);
        }

        /* Specific UI Elements */
        .fact-box {
            background: var(--ochre);
            padding: calc(var(--8-point) * 3);
            color: white;
            font-size: 0.9rem;
            border-left: 10px solid var(--amber-glow);
            margin: calc(var(--8-point) * 4) 0;
        }

        .comparison-table {
            width: 100%;
            border-collapse: collapse;
            margin: calc(var(--8-point) * 4) 0;
            background: rgba(255, 255, 255, 0.05);
        }

        .comparison-table th,
        .comparison-table td {
            padding: calc(var(--8-point) * 2);
            border: 1px solid rgba(166, 176, 163, 0.1);
            text-align: left;
        }

        .comparison-table th {
            background: var(--ochre);
            color: white;
            text-transform: uppercase;
            font-size: 0.8rem;
            letter-spacing: 0.1em;
        }

        .glossary-list {
            list-style: none;
        }

        .glossary-term {
            color: var(--amber-glow);
            font-weight: bold;
            display: block;
            margin-top: var(--8-point);
        }

        /* Animations */
        @keyframes fadeInReveal {
            from {
                opacity: 0;
                transform: translateY(20px);
            }

            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .reveal {
            animation: fadeInReveal 1s ease-out forwards;
        }

        /* PDF Specific (Print) */
        @media print {
            body {
                background: white;
                color: black;
            }

            .magazine-container {
                box-shadow: none;
                padding: 0;
            }

            .hero-section {
                height: 50vh;
            }

            .reveal {
                animation: none;
                opacity: 1;
                transform: none;
            }

            h1 {
                color: #B12E21;
            }

            h2 {
                color: #8B0000;
                border-bottom-color: #B12E21;
            }

            .fact-box {
                border-left-color: #8B0000;
            }
        }
    </style>
</head>

<body>
    <div class="magazine-container">
        <!-- Hero Section -->
        <header class="hero-section reveal">
            <img src="img/hero.png" alt="Elemental Resilience" class="hero-img">
            <div class="hero-content">
                <h3>The Survivors of the Scorched Earth</h3>
                <h1>Elemental<br>Magic</h1>
                <p>How Australia’s unique wildlife uses instinct and adaptation to outsmart the most powerful force of
                    nature: The Bushfire.</p>
            </div>
        </header>

        <!-- The Big Idea -->
        <section class="editorial-grid">
            <div class="article-section main reveal">
                <h2>1) The Science of Survival</h2>
                <p>Bushfires are a fundamental, albeit terrifying, part of the Australian landscape. They move with
                    incredible speed, reaching temperatures that can melt steel and filling the atmosphere with
                    suffocating smoke. Yet, for the animals that call the bush home, fire is not a new enemy. Over
                    millions of years, creatures from kangaroos to tiny echidnas have developed a sophisticated toolkit
                    of "survival magic"—behaviours and biological features that allow them to endure where others
                    cannot.</p>
                <p>Success in a fire zone isn't about one single trick; it's a dynamic calculation of timing and
                    location. Animals must decide in a split second whether to flee the approaching front, seek shelter
                    in the deep earth, or wait for the precise moment when the heat passes. This "Elemental Magic" is
                    what keeps the Australian outback breathing, even when the world seems to be turning to ash.</p>
            </div>
            <div class="article-section side reveal">
                <div class="fact-box">
                    <h3>The Survival Toolkit</h3>
                    <p><strong>Fleeing:</strong> Moving ahead of the front.</p>
                    <p><strong>Sheltering:</strong> Using natural shields like soil and stone.</p>
                    <p><strong>Timing:</strong> Sensing smoke and heat changes hours before arrival.</p>
                </div>
            </div>
        </section>

        <!-- Animal Features -->
        <section class="editorial-grid">
            <div class="article-section main animal-feature reveal">
                <h2>Kangaroos: The Tactical Runners</h2>
                <img src="img/kangaroo.png" alt="Kangaroo on the move" class="animal-img">
                <p>Kangaroos are the masters of the "Early Exit." Using their powerful hind legs and incredible
                    endurance, they can sense the subtle chemical shifts in the air—the scent of distant smoke or the
                    unnatural warmth of a northerly wind—and begin their evacuation long before the first flame is
                    visible. Their survival strategy is built on kinetic energy; they move fast and they move early.</p>
                <p>When the fire is near, kangaroos seek out "Tactical Sanctuaries"—large, open spaces like rocky
                    outcrops, cleared paddocks, or waterholes. By staying away from the dense "fuel" of dry leaves and
                    tall grass, they effectively remove themselves from the fire's path. While the bush burns around
                    them, the kangaroo remains in the clearing, safe from the intense radiant heat that would otherwise
                    be fatal. This ability to navigate the landscape's topography is their greatest asset in a crisis.
                </p>
            </div>

            <div class="article-section main animal-feature reveal" style="grid-column: span 8; margin-left: auto;">
                <h2>Echidnas: The Earth Shields</h2>
                <img src="img/echidna.png" alt="Burrowing Echidna" class="animal-img">
                <p>Where the kangaroo runs, the echidna digs. These short-beaked monotremes are not built for speed, but
                    they possess a remarkable "Thermal Shield." When they sense an approaching fire, they use their
                    powerful, shovel-like claws to burrow deep into the soil or leaf litter. They don't just hide; they
                    effectively disappear into the cooling embrace of the earth.</p>
                <p>The magic of the echidna's strategy lies in the insulation properties of the soil. Even a few
                    centimetres of earth can protect an animal from the scorching temperatures on the surface. By
                    curling into a tight ball and exposing only their sharp, protective spines, they wait out the fire
                    in a state of suspended animation. While the world above is a furnace, the echidna stays cool,
                    breathing thin pockets of air until the fire front has passed safely over their heads.</p>
            </div>

            <div class="article-section split animal-feature reveal">
                <h2>Goannas: Master Squatters</h2>
                <img src="img/goanna.png" alt="Goanna in crevice" class="animal-img">
                <p>Goannas are the ultimate survivors of the canopy and the crevice. As cold-blooded reptiles, they are
                    acutely sensitive to temperature changes, which gives them a head start in detecting an approaching
                    fire. Their strategy is one of "Shelter Real Estate." They possess an intimate knowledge of their
                    territory, knowing exactly where the deepest tree hollows and the thickest rock crevices are
                    located.</p>
                <p>In a fire, a goanna will retreat into these prehistoric bunkers, squeezing their bodies into tight
                    spaces where the flames simply cannot reach. After the fire has passed, they emerge as the first
                    predators on the scene. Their "Magic" is their patient resilience; they can wait for hours in a dark
                    crevice, surviving on slow breaths until the landscape is safe enough to reclaim.</p>
            </div>

            <div class="article-section split animal-feature reveal">
                <h2>Birds: The Sky Guardians</h2>
                <img src="img/birds.png" alt="Kites in smoke" class="animal-img">
                <p>Birds possess the most obvious advantage—flight—but fire presents unique challenges in the air.
                    Strong convection currents and thick smoke make flying dangerous for many small species. Larger
                    birds, such as Whistling Kites and Hawks, often use the fire to their advantage. They are known as
                    "Smoke Hunters," circling the edges of the fire to catch fleeing insects and small mammals exposed
                    by the disappearing ground cover.</p>
                <p>For most birds, however, survival means finding an "Elemental Sanctuary" such as a wetland or a
                    coastal gully where the fire cannot follow. By moving into these damp, protected zones, they wait
                    for the winds to shift. Once the embers are cool, they return to the burnt areas, where the lack of
                    vegetation makes it exceptionally easy to spot seeds and food on the black ground.</p>
            </div>
        </section>

        <!-- Aftermath -->
        <section class="editorial-grid">
            <div class="article-section main reveal">
                <h2>The New Menu: Life After Fire</h2>
                <p>In the wake of a bushfire, the landscape is transformed into a "Black Mirror" of its former self.
                    While the devastation is significant, the aftermath provides a unique set of opportunities for those
                    who stayed behind. Fresh green shoots, rich in nutrients, begin to sprout from the ash-enriched soil
                    almost immediately after the first rain. This "Post-Fire Menu" is a lifeline for herbivores like
                    kangaroos.</p>
                <p>For predators, the lack of hiding places makes the burnt bush a high-stakes hunting ground. While
                    insects are easier to spot, the survivors themselves are also more visible to cars and larger
                    predators. It is a time of extreme caution but also of rapid rebirth, as the cycle of life resets
                    itself in the heart of the Australian bush.</p>
            </div>
            <div class="article-section side reveal">
                <table class="comparison-table">
                    <thead>
                        <tr>
                            <th>Animal</th>
                            <th>Strategy</th>
                            <th>Shelter</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Kangaroo</td>
                            <td>Run Early</td>
                            <td>Open Ground</td>
                        </tr>
                        <tr>
                            <td>Echidna</td>
                            <td>Dig & Hide</td>
                            <td>Burrows</td>
                        </tr>
                        <tr>
                            <td>Goanna</td>
                            <td>Retreat</td>
                            <td>Crevices</td>
                        </tr>
                        <tr>
                            <td>Birds</td>
                            <td>Fly/Wait</td>
                            <td>Wetlands</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>

        <!-- Glossary -->
        <footer class="editorial-grid reveal">
            <div class="article-section main">
                <h2>Field Glossary</h2>
                <ul class="glossary-list">
                    <li><span class="glossary-term">Adaptation:</span> A biological "magic trick" that helps a species
                        survive.</li>
                    <li><span class="glossary-term">Fuel:</span> The dry leaves and bark that the fire "eats" to grow.
                    </li>
                    <li><span class="glossary-term">Insulation:</span> The protective layer of soil or stone that blocks
                        heat.</li>
                    <li><span class="glossary-term">Topography:</span> The "map" of the land that animals use for
                        escape.</li>
                </ul>
            </div>
        </footer>
    </div>

    <script>
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    </script>
</body>

</html>