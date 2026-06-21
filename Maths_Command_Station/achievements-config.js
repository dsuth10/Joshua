/**
 * Maths Command Station - Achievements & Curriculum Configuration
 * Contains mapping data for AC v9 Content Descriptors and Strand Mastery awards.
 * 
 * Rules:
 * - Uses Australian spelling (e.g., 'colour', 'modelling', 'organise') and metric systems.
 * - Centralizes badge details, requirements (points, contexts), and visual properties.
 */

const STRAND_THEMES = {
    'number': { name: 'Number', colour: '#003ec7', label: 'NUMBER' },
    'algebra': { name: 'Algebra', colour: '#b45309', label: 'ALGEBRA' },
    'measurement': { name: 'Measurement', colour: '#005471', label: 'MEASUREMENT' },
    'space': { name: 'Space', colour: '#ba1a1a', label: 'SPACE' },
    'statistics': { name: 'Statistics', colour: '#585f6a', label: 'STATISTICS' },
    'probability': { name: 'Probability', colour: '#059669', label: 'PROBABILITY' }
};

const GLOBAL_BADGES = {
    'first-step': { badgeName: 'First Step', emoji: '🌱', desc: 'Completed your very first practice task. Every great journey starts with a single step!' },
    'streak-5': { badgeName: 'High Five', emoji: '🖐️', desc: 'Answered 5 questions correctly in a row without a single mistake. Impressive focus!' },
    'streak-10': { badgeName: 'Perfect Ten', emoji: '🏆', desc: 'Achieved a 10-question correct streak. An outstanding display of mathematical accuracy!' },
    'streak-20': { badgeName: 'Unstoppable', emoji: '🔥', desc: 'Powered through 20 consecutive correct answers. You are truly unstoppable!' },
    'all-rounder': { badgeName: 'All Rounder', emoji: '🌟', desc: 'Earned at least 50 points in every single strand. A true all-round mathematician — well done!' }
};

const DESCRIPTOR_BADGES = {
    // =========================================================================
    // FOUNDATION / PREP (R-07 verified against AC v9.0, 2026-06-16)
    // =========================================================================
    'ac9mfn01': {
        code: 'AC9MFN01', year: 0, strand: 'number', badgeName: 'Docking Cadet', emoji: '🛸',
        desc: 'Mastered naming and counting collections up to 20 using physical materials.',
        requirements: { points: 50, contexts: ['free-count-docking'] }
    },
    'ac9mfn02': {
        code: 'AC9MFN02', year: 0, strand: 'number', badgeName: 'Flash Counter', emoji: '⚡',
        desc: 'Mastered subitising small collections up to five at a glance.',
        requirements: { points: 50, contexts: ['ten-frame-subitise'] }
    },
    'ac9mfn03': {
        code: 'AC9MFN03', year: 0, strand: 'number', badgeName: 'More or Fewer Scout', emoji: '⚖️',
        desc: 'Mastered comparing two collections to decide which has more or fewer.',
        requirements: { points: 50, contexts: ['compare-zones-more-fewer'] }
    },
    'ac9mfn04': {
        code: 'AC9MFN04', year: 0, strand: 'number', badgeName: 'Ten-Frame Builder', emoji: '🔟',
        desc: 'Mastered partitioning and combining collections to make five and ten.',
        requirements: { points: 50, contexts: ['ten-frame-fill-five', 'ten-frame-fill-ten', 'ten-frame-make-ten'] }
    },
    'ac9mfn06': {
        code: 'AC9MFN06', year: 0, strand: 'number', badgeName: 'Fair Share Pilot', emoji: '🤝',
        desc: 'Mastered equal sharing and grouping collections fairly between rovers.',
        requirements: { points: 50, contexts: ['make-equal-groups-share'] }
    },
    'ac9mfa01': {
        code: 'AC9MFA01', year: 0, strand: 'algebra', badgeName: 'Pattern Starter', emoji: '🔁',
        desc: 'Mastered recognising, copying and continuing repeating patterns.',
        requirements: { points: 50, contexts: ['continue-pattern-ab-blocks'] }
    },
    'ac9mfm01': {
        code: 'AC9MFM01', year: 0, strand: 'measurement', badgeName: 'Compare Captain', emoji: '📏',
        desc: 'Mastered direct comparison of length, mass and capacity using informal reasoning.',
        requirements: { points: 50, contexts: ['ruler-informal-compare-longer', 'balance-scale-compare-heavier', 'capacity-jug-compare-more'] }
    },
    'ac9mfm02': {
        code: 'AC9MFM02', year: 0, strand: 'measurement', badgeName: 'Mission Scheduler', emoji: '🌅',
        desc: 'Mastered sequencing daily events from morning through to night.',
        requirements: { points: 50, contexts: ['sequence-lane-mission-day'] }
    },
    'ac9mfsp01': {
        code: 'AC9MFSP01', year: 0, strand: 'space', badgeName: 'Shape Sorter', emoji: '🔷',
        desc: 'Mastered sorting and classifying familiar shapes into matching hangars.',
        requirements: { points: 50, contexts: ['shape-hangars-sort-shapes'] }
    },
    'ac9mfsp02': {
        code: 'AC9MFSP02', year: 0, strand: 'space', badgeName: 'Rover Navigator', emoji: '🗺️',
        desc: 'Mastered positional language — in front, behind and next to — on a grid map.',
        requirements: { points: 50, contexts: ['alpha-grid-positional-in-front', 'alpha-grid-positional-behind', 'alpha-grid-positional-next-to'] }
    },
    'ac9mfst01': {
        code: 'AC9MFST01', year: 0, strand: 'statistics', badgeName: 'Crew Poll Taker', emoji: '📋',
        desc: 'Mastered collecting and sorting yes/no data into a picture graph.',
        requirements: { points: 50, contexts: ['picture-graph-crew-yes-no'] }
    },

    // =========================================================================
    // YEAR 1 (R-07 verified against AC v9.0, 2026-06-16)
    // =========================================================================
    'ac9m1n01': {
        code: 'AC9M1N01', year: 1, strand: 'number', badgeName: 'Track Navigator', emoji: '🛤️',
        desc: 'Mastered recognising, representing and ordering numbers to 120 on a number track.',
        requirements: { points: 50, contexts: ['number-track-missing-next'] }
    },
    'ac9m1n02': {
        code: 'AC9M1N02', year: 1, strand: 'number', badgeName: 'Teen Partitioner', emoji: '🧱',
        desc: 'Mastered partitioning teen numbers into tens and ones using double frames.',
        requirements: { points: 50, contexts: ['teen-partition-double-frame'] }
    },
    'ac9m1n04': {
        code: 'AC9M1N04', year: 1, strand: 'number', badgeName: 'Jump Captain', emoji: '🦘',
        desc: 'Mastered addition and subtraction within 20 using number-line jumps.',
        requirements: { points: 50, contexts: ['number-line-jump-within-twenty'] }
    },
    'ac9m1a01': {
        code: 'AC9M1A01', year: 1, strand: 'algebra', badgeName: 'Skip-Count Cadet', emoji: '2️⃣',
        desc: 'Mastered skip counting by twos, fives and tens on the number track.',
        requirements: { points: 50, contexts: ['number-track-count-by-steps'] }
    },
    'ac9m1m01': {
        code: 'AC9M1M01', year: 1, strand: 'measurement', badgeName: 'Paperclip Measurer', emoji: '📎',
        desc: 'Mastered measuring length with uniform informal units.',
        requirements: { points: 50, contexts: ['ruler-informal-units-paperclips'] }
    },
    'ac9m1m03': {
        code: 'AC9M1M03', year: 1, strand: 'measurement', badgeName: 'Half-Hour Hand', emoji: '🕐',
        desc: 'Mastered setting o\'clock and half-past times on an analog clock.',
        requirements: { points: 50, contexts: ['clock-set-oclock-half-past'] }
    },
    'ac9m1sp01': {
        code: 'AC9M1SP01', year: 1, strand: 'space', badgeName: 'Pegboard Builder', emoji: '📌',
        desc: 'Mastered copying and making familiar 2-D shapes on a pegboard.',
        requirements: { points: 50, contexts: ['shape-builder-copy-pegboard'] }
    },
    'ac9m1st01': {
        code: 'AC9M1ST01', year: 1, strand: 'statistics', badgeName: 'Favourites Graph Maker', emoji: '⭐',
        desc: 'Mastered collecting categorical data and building one-to-one picture graphs.',
        requirements: { points: 50, contexts: ['picture-graph-favourites-one-to-one'] }
    },

    // =========================================================================
    // YEAR 2 (R-07 verified against AC v9.0, 2026-06-16)
    // =========================================================================
    'ac9m2n01': {
        code: 'AC9M2N01', year: 2, strand: 'number', badgeName: 'Three-Digit Builder', emoji: '🏗️',
        desc: 'Mastered building and ordering numbers to 1000 with place-value blocks.',
        requirements: { points: 50, contexts: ['place-value-blocks-build-three-digit'] }
    },
    'ac9m2n02': {
        code: 'AC9M2N02', year: 2, strand: 'number', badgeName: 'Regrouping Trader', emoji: '🔄',
        desc: 'Mastered trading tens and hundreds when regrouping three-digit numbers.',
        requirements: { points: 50, contexts: ['place-value-blocks-trade-regroup'] }
    },
    'ac9m2n03': {
        code: 'AC9M2N03', year: 2, strand: 'number', badgeName: 'Fraction Shading Pro', emoji: '🍰',
        desc: 'Mastered shading halves, quarters and eighths of shapes and collections.',
        requirements: { points: 50, contexts: ['fraction-bars-shade-halves-quarters-eighths'] }
    },
    'ac9m2n05': {
        code: 'AC9M2N05', year: 2, strand: 'number', badgeName: 'Array Architect', emoji: '▦',
        desc: 'Mastered representing multiplication as arrays and equal groups.',
        requirements: { points: 50, contexts: ['array-builder-set-multiplication'] }
    },
    'ac9m2n06': {
        code: 'AC9M2N06', year: 2, strand: 'number', badgeName: 'Coin Counter', emoji: '🪙',
        desc: 'Mastered making money amounts with Australian coins.',
        requirements: { points: 50, contexts: ['counters-money-make-amount'] }
    },
    'ac9m2m01': {
        code: 'AC9M2M01', year: 2, strand: 'measurement', badgeName: 'Centimetre Reader', emoji: '📐',
        desc: 'Mastered measuring objects in uniform centimetre units.',
        requirements: { points: 50, contexts: ['ruler-measure-object-centimetres'] }
    },
    'ac9m2m04': {
        code: 'AC9M2M04', year: 2, strand: 'measurement', badgeName: 'Quarter-Hour Pilot', emoji: '🕒',
        desc: 'Mastered setting quarter-past and quarter-to times on an analog clock.',
        requirements: { points: 50, contexts: ['clock-set-quarter-past-to'] }
    },
    'ac9m2sp01': {
        code: 'AC9M2SP01', year: 2, strand: 'space', badgeName: 'Flip Slide Turner', emoji: '🔃',
        desc: 'Mastered informal transformations — flip, slide and turn — on a shape board.',
        requirements: { points: 50, contexts: ['transform-board-single-step-flip-slide-turn'] }
    },
    'ac9m2p01': {
        code: 'AC9M2P01', year: 2, strand: 'probability', badgeName: 'Chance Word Reader', emoji: '🎲',
        desc: 'Mastered describing events as likely, unlikely or impossible using chance words.',
        requirements: { points: 50, contexts: ['marble-bag-chance-words-read', 'spinner-predict-chance-words'] }
    },
    'ac9m2st01': {
        code: 'AC9M2ST01', year: 2, strand: 'statistics', badgeName: 'Data Collector', emoji: '📝',
        desc: 'Mastered collecting categorical data with one-to-one picture graphs.',
        requirements: { points: 50, contexts: ['column-graph-picture-collect-one-to-one'] }
    },
    'ac9m2st02': {
        code: 'AC9M2ST02', year: 2, strand: 'statistics', badgeName: 'Graph Builder', emoji: '📊',
        desc: 'Mastered building column graphs with many-to-one scaling.',
        requirements: { points: 50, contexts: ['column-graph-build-many-to-one'] }
    },

    // =========================================================================
    // YEAR 3
    // =========================================================================
    // Number
    'ac9m3n01': {
        code: 'AC9M3N01', year: 3, strand: 'number', badgeName: 'Five-Digit Scout', emoji: '🪖',
        desc: 'Mastered naming and writing numbers beyond 10,000, place value partitioning, and ordering.',
        requirements: { points: 50, contexts: ['numeral-ordering-value', 'numeral-partitioning'] }
    },
    'ac9m3n02': {
        code: 'AC9M3N02', year: 3, strand: 'number', badgeName: 'Fraction Assembler', emoji: '🧩',
        desc: 'Mastered unit fractions and partitioning lines/bars for halves, thirds, quarters, fifths, and tenths.',
        requirements: { points: 50, contexts: ['unit-fraction-lines', 'unit-fraction-bars'] }
    },
    'ac9m3n03': {
        code: 'AC9M3N03', year: 3, strand: 'number', badgeName: 'Regrouping Champion', emoji: '🛡️',
        desc: 'Mastered vertical addition and subtraction of 2 and 3-digit numbers with regrouping.',
        requirements: { points: 50, contexts: ['addition-regroup', 'subtraction-regroup'] }
    },
    'ac9m3n04': {
        code: 'AC9M3N04', year: 3, strand: 'number', badgeName: 'Grid Array Explorer', emoji: '📐',
        desc: 'Mastered multiplication and division using arrays, grid drawings, and grouping collections.',
        requirements: { points: 50, contexts: ['grid-array-multiplication', 'grid-array-division'] }
    },
    'ac9m3n05': {
        code: 'AC9M3N05', year: 3, strand: 'number', badgeName: 'Reasonable Guesser', emoji: '🎯',
        desc: 'Mastered estimating quantities and checking calculation reasonableness.',
        requirements: { points: 50, contexts: ['quantity-estimation', 'reasonableness-check'] }
    },
    'ac9m3n06': {
        code: 'AC9M3N06', year: 3, strand: 'number', badgeName: 'Real-World Modeller', emoji: '🏦',
        desc: 'Mastered additive and multiplicative modelling for financial and shopping scenarios.',
        requirements: { points: 50, contexts: ['financial-additive', 'financial-multiplicative'] }
    },
    'ac9m3n07': {
        code: 'AC9M3N07', year: 3, strand: 'number', badgeName: 'Number Path Tracer', emoji: '🕸️',
        desc: 'Mastered algorithms and sequence patterns using flowcharts and path inputs.',
        requirements: { points: 50, contexts: ['algorithm-flowchart', 'sequence-pattern'] }
    },
    // Algebra
    'ac9m3a01': {
        code: 'AC9M3A01', year: 3, strand: 'algebra', badgeName: 'Inverse Investigator', emoji: '🔍',
        desc: 'Mastered addition and subtraction inverse relationships and fact families.',
        requirements: { points: 50, contexts: ['fact-families-add', 'fact-families-sub'] }
    },
    'ac9m3a02': {
        code: 'AC9M3A02', year: 3, strand: 'algebra', badgeName: 'Mental Tactician', emoji: '🧠',
        desc: 'Mastered efficient mental strategies and partitioning numbers up to 20.',
        requirements: { points: 50, contexts: ['mental-recall-grid', 'mental-partitioning'] }
    },
    'ac9m3a03': {
        code: 'AC9M3A03', year: 3, strand: 'algebra', badgeName: 'Fact Recall Cadet', emoji: '🎖️',
        desc: 'Mastered multiplication facts for 3, 4, 5, and 10 and their division links.',
        requirements: { points: 50, contexts: ['multiplication-recall-3-4', 'multiplication-recall-5-10'] }
    },
    // Measurement
    'ac9m3m01': {
        code: 'AC9M3M01', year: 3, strand: 'measurement', badgeName: 'Unit Scout', emoji: '🛰️',
        desc: 'Mastered metric unit selection and estimating length, mass, and capacity.',
        requirements: { points: 50, contexts: ['unit-selection-length', 'unit-selection-capacity'] }
    },
    'ac9m3m02': {
        code: 'AC9M3M02', year: 3, strand: 'measurement', badgeName: 'Scale Reader', emoji: '⚖️',
        desc: 'Mastered measuring instruments including rulers, scales, and cylinders.',
        requirements: { points: 50, contexts: ['ruler-measurement', 'scale-cylinder-reading'] }
    },
    'ac9m3m03': {
        code: 'AC9M3M03', year: 3, strand: 'measurement', badgeName: 'Time Keeper', emoji: '⏱️',
        desc: 'Mastered units of time and duration conversions (seconds, minutes, hours, days).',
        requirements: { points: 50, contexts: ['time-conversion-seconds', 'time-conversion-hours'] }
    },
    'ac9m3m04': {
        code: 'AC9M3M04', year: 3, strand: 'measurement', badgeName: 'Chronos Apprentice', emoji: '⏰',
        desc: 'Mastered reading analog and digital clocks to the nearest minute.',
        requirements: { points: 50, contexts: ['read-clock-hour', 'read-clock-minute', 'set-clock-time'] }
    },
    'ac9m3m05': {
        code: 'AC9M3M05', year: 3, strand: 'measurement', badgeName: 'Turn Director', emoji: '🔄',
        desc: 'Mastered angles as measures of turn and right-angle comparisons.',
        requirements: { points: 50, contexts: ['angle-turn-direction', 'angle-right-compare'] }
    },
    'ac9m3m06': {
        code: 'AC9M3M06', year: 3, strand: 'measurement', badgeName: 'Change Maker', emoji: '🪙',
        desc: 'Mastered dollar and cent representations and calculating change.',
        requirements: { points: 50, contexts: ['money-addition', 'money-subtraction'] }
    },
    // Space
    'ac9m3sp01': {
        code: 'AC9M3SP01', year: 3, strand: 'space', badgeName: '3D Explorer', emoji: '📦',
        desc: 'Mastered identifying, comparing, and classifying 3D objects.',
        requirements: { points: 50, contexts: ['shape-classify-3d', 'shape-properties-3d'] }
    },
    'ac9m3sp02': {
        code: 'AC9M3SP02', year: 3, strand: 'space', badgeName: 'Map Maker', emoji: '🗺️',
        desc: 'Mastered reading and completing top-view maps of familiar places, locating landmarks and objects relative to each other.',
        requirements: { points: 50, contexts: ['familiar-map-interpret', 'familiar-map-create'] }
    },
    // Statistics & Probability
    'ac9m3st01': {
        code: 'AC9M3ST01', year: 3, strand: 'statistics', badgeName: 'Data Recorder', emoji: '📝',
        desc: 'Mastered acquiring and recording data using tally marks and frequency tables.',
        requirements: { points: 50, contexts: ['tally-marks-build', 'frequency-table-build'] }
    },
    'ac9m3st02': {
        code: 'AC9M3ST02', year: 3, strand: 'statistics', badgeName: 'Graph Sketcher', emoji: '📊',
        desc: 'Mastered interpreting and reading column graphs.',
        requirements: { points: 50, contexts: ['read-column-chart-3', 'column-chart-difference-3'] }
    },
    'ac9m3st03': {
        code: 'AC9M3ST03', year: 3, strand: 'statistics', badgeName: 'Investigation Cadet', emoji: '🎙️',
        desc: 'Mastered statistical questions and organising gathered data sets.',
        requirements: { points: 50, contexts: ['question-formulation', 'data-organisation'] }
    },
    'ac9m3p01': {
        code: 'AC9M3P01', year: 3, strand: 'probability', badgeName: 'Chance Explorer', emoji: '🎰',
        desc: 'Mastered classifying event outcomes as certain, likely, unlikely, or impossible.',
        requirements: { points: 50, contexts: ['chance-likelihood-3'] }
    },
    'ac9m3p02': {
        code: 'AC9M3P02', year: 3, strand: 'probability', badgeName: 'Spinner Spinner', emoji: '🎡',
        desc: 'Mastered repeated chance experiments and spinner trial tallies.',
        requirements: { points: 50, contexts: ['spinner-trial-record', 'spinner-trial-compare'] }
    },

    // =========================================================================
    // YEAR 4
    // =========================================================================
    // Number
    'ac9m4n01': {
        code: 'AC9M4N01', year: 4, strand: 'number', badgeName: 'Decimal Detective', emoji: '🕵️',
        desc: 'Mastered ordering decimals and shifting place values (tenths and hundredths).',
        requirements: { points: 50, contexts: ['decimal-ordering', 'decimal-place-value'] }
    },
    'ac9m4n02': {
        code: 'AC9M4N02', year: 4, strand: 'number', badgeName: 'Parity Patrol', emoji: '⚖️',
        desc: 'Mastered properties of odd and even numbers.',
        requirements: { points: 50, contexts: ['odd-even-classification'] }
    },
    'ac9m4n03': {
        code: 'AC9M4N03', year: 4, strand: 'number', badgeName: 'Equivalent Navigator', emoji: '🧭',
        desc: 'Mastered fraction-decimal equivalence mapping and comparisons.',
        requirements: { points: 50, contexts: ['equivalent-fractions', 'equivalent-decimals'] }
    },
    'ac9m4n04': {
        code: 'AC9M4N04', year: 4, strand: 'number', badgeName: 'Fraction Hopper', emoji: '🐸',
        desc: 'Mastered mixed numeral number lines and counting fractional increments.',
        requirements: { points: 50, contexts: ['mixed-numeral-lines'] }
    },
    'ac9m4n05': {
        code: 'AC9M4N05', year: 4, strand: 'number', badgeName: 'Power Shifter', emoji: '⚡',
        desc: 'Mastered multiplying and dividing numbers by 10 and 100.',
        requirements: { points: 50, contexts: ['multiply-by-10', 'divide-by-10'] }
    },
    'ac9m4n06': {
        code: 'AC9M4N06', year: 4, strand: 'number', badgeName: 'Calculation Captain', emoji: '👨‍✈️',
        desc: 'Mastered grid multiplication and division steps without remainders.',
        requirements: { points: 50, contexts: ['grid-multiplication', 'division-step-no-rem'] }
    },
    'ac9m4n07': {
        code: 'AC9M4N07', year: 4, strand: 'number', badgeName: 'Budget Estimator', emoji: '💰',
        desc: 'Mastered rounding checks, cash registers, and financial estimation.',
        requirements: { points: 50, contexts: ['rounding-check', 'financial-estimation'] }
    },
    'ac9m4n08': {
        code: 'AC9M4N08', year: 4, strand: 'number', badgeName: 'Problem Modeller', emoji: '🏗️',
        desc: 'Mastered creating algebraic number sentences and modelling scenarios.',
        requirements: { points: 50, contexts: ['algebraic-sentence', 'scenario-modelling'] }
    },
    'ac9m4n09': {
        code: 'AC9M4N09', year: 4, strand: 'number', badgeName: 'Sequence Hacker', emoji: '🌐',
        desc: 'Mastered step-by-step pathways and sequencing algorithms.',
        requirements: { points: 50, contexts: ['pathway-algorithm', 'sequencing-check'] }
    },
    // Algebra
    'ac9m4a01': {
        code: 'AC9M4A01', year: 4, strand: 'algebra', badgeName: 'Equation Cracker', emoji: '🔓',
        desc: 'Mastered balance scales and solving equations with unknown values.',
        requirements: { points: 50, contexts: ['inverse-equations-addition', 'inverse-equations-subtraction'] }
    },
    'ac9m4a02': {
        code: 'AC9M4A02', year: 4, strand: 'algebra', badgeName: 'Fact Recall Commando', emoji: '⚔️',
        desc: 'Mastered multiplication and related division facts, including remainders.',
        requirements: { points: 50, contexts: ['recall-facts-multiplication', 'recall-facts-division', 'division-remainder'] }
    },
    // Measurement
    'ac9m4m01': {
        code: 'AC9M4M01', year: 4, strand: 'measurement', badgeName: 'Precision Reader', emoji: '🌡️',
        desc: 'Mastered gauge reading with unmarked intervals and gauges.',
        requirements: { points: 50, contexts: ['gauge-reading'] }
    },
    'ac9m4m02': {
        code: 'AC9M4M02', year: 4, strand: 'measurement', badgeName: 'Area Surveyor', emoji: '🚜',
        desc: 'Mastered square grids and calculating perimeter and area.',
        requirements: { points: 50, contexts: ['perimeter-shapes', 'area-grids'] }
    },
    'ac9m4m03': {
        code: 'AC9M4M03', year: 4, strand: 'measurement', badgeName: 'Schedule Planner', emoji: '📅',
        desc: 'Mastered schedule calculations, AM/PM, and elapsed time.',
        requirements: { points: 50, contexts: ['time-duration', 'schedule-planning'] }
    },
    'ac9m4m04': {
        code: 'AC9M4M04', year: 4, strand: 'measurement', badgeName: 'Angle Classifier', emoji: '📐',
        desc: 'Mastered angle classifications (acute, obtuse, reflex, right).',
        requirements: { points: 50, contexts: ['angle-classification', 'protractor-reading'] }
    },
    // Space
    'ac9m4sp01': {
        code: 'AC9M4SP01', year: 4, strand: 'space', badgeName: 'Shape Joiner', emoji: '🧱',
        desc: 'Mastered combining composite shapes and spatial structures.',
        requirements: { points: 50, contexts: ['shape-combination', 'composite-structures'] }
    },
    'ac9m4sp02': {
        code: 'AC9M4SP02', year: 4, strand: 'space', badgeName: 'Grid Navigator', emoji: '🏁',
        desc: 'Mastered grid references, directional pathways, route tracing and pathway descriptions.',
        requirements: {
            points: 60,
            contexts: [
                'grid-reference-locate',
                'pathway-follow-trace',
                'pathway-describe-route',
            ],
        },
    },
    'ac9m4sp03': {
        code: 'AC9M4SP03', year: 4, strand: 'space', badgeName: 'Symmetry Designer', emoji: '🦋',
        desc: 'Mastered mirroring grids and painting symmetrical grids.',
        requirements: { points: 50, contexts: ['symmetry-paint-mirror', 'symmetry-rotational'] }
    },
    // Statistics & Probability
    'ac9m4st01': {
        code: 'AC9M4ST01', year: 4, strand: 'statistics', badgeName: 'Visual Analyst', emoji: '📉',
        desc: 'Mastered scaled column graphs and identifying chart differences.',
        requirements: { points: 50, contexts: ['read-column-chart', 'column-chart-difference'] }
    },
    'ac9m4st02': {
        code: 'AC9M4ST02', year: 4, strand: 'statistics', badgeName: 'Data Critic', emoji: '⚖️',
        desc: 'Mastered distribution shape analyses and comparing chart methods.',
        requirements: { points: 50, contexts: ['distribution-shape', 'chart-comparison'] }
    },
    'ac9m4st03': {
        code: 'AC9M4ST03', year: 4, strand: 'statistics', badgeName: 'Poll Analyst', emoji: '🗳️',
        desc: 'Mastered survey results tables and compiling column charts.',
        requirements: { points: 50, contexts: ['survey-compiling', 'survey-reading'] }
    },
    'ac9m4p01': {
        code: 'AC9M4P01', year: 4, strand: 'probability', badgeName: 'Probability Ranger', emoji: '🎯',
        desc: 'Mastered ordering daily chance events on a probability spectrum.',
        requirements: { points: 50, contexts: ['likelihood-scale-eval', 'likelihood-scale-order'] }
    },
    'ac9m4p02': {
        code: 'AC9M4P02', year: 4, strand: 'probability', badgeName: 'Experiment Tracker', emoji: '🔬',
        desc: 'Mastered repeated coin toss experiments and frequency variations.',
        requirements: { points: 50, contexts: ['coin-toss-record', 'coin-toss-variation'] }
    },

    // =========================================================================
    // YEAR 5
    // =========================================================================
    // Number
    'ac9m5n01': {
        code: 'AC9M5N01', year: 5, strand: 'number', badgeName: 'Decimal Precisionist', emoji: '🔢',
        desc: 'Mastered decimal value comparing and sorting up to three decimal places.',
        requirements: { points: 50, contexts: ['decimal-sorting', 'number-line-plots'] }
    },
    'ac9m5n02': {
        code: 'AC9M5N02', year: 5, strand: 'number', badgeName: 'Factor Finder', emoji: '🔍',
        desc: 'Mastered listing complete factors, multiples, and prime numbers.',
        requirements: { points: 50, contexts: ['factor-checking', 'factor-listing'] }
    },
    'ac9m5n03': {
        code: 'AC9M5N03', year: 5, strand: 'number', badgeName: 'Fraction Alignment', emoji: '💈',
        desc: 'Mastered mixed numeral comparisons and ordering on number lines.',
        requirements: { points: 50, contexts: ['mixed-numeral-lines', 'common-denominators'] }
    },
    'ac9m5n04': {
        code: 'AC9M5N04', year: 5, strand: 'number', badgeName: 'Percentage Converter', emoji: '🏷️',
        desc: 'Mastered fraction-to-percentage and decimal-to-percentage transformations.',
        requirements: { points: 50, contexts: ['fraction-to-percent', 'decimal-to-percent', 'percent-to-fraction'] }
    },
    'ac9m5n05': {
        code: 'AC9M5N05', year: 5, strand: 'number', badgeName: 'Fraction Operator', emoji: '⚖️',
        desc: 'Mastered visual fraction bar addition and related denominator sums.',
        requirements: { points: 50, contexts: ['fraction-bar-addition', 'fractional-sums'] }
    },
    'ac9m5n06': {
        code: 'AC9M5N06', year: 5, strand: 'number', badgeName: 'Multiplication Master', emoji: '👑',
        desc: 'Mastered multi-digit algorithm check grids and multiplication sums.',
        requirements: { points: 50, contexts: ['multiplication-grid', 'multiplication-algorithm'] }
    },
    'ac9m5n07': {
        code: 'AC9M5N07', year: 5, strand: 'number', badgeName: 'Remainder Ruler', emoji: '📏',
        desc: 'Mastered division remainder algorithms and decimal forms.',
        requirements: { points: 50, contexts: ['remainder-algorithms', 'remainder-decimal-forms'] }
    },
    'ac9m5n08': {
        code: 'AC9M5N08', year: 5, strand: 'number', badgeName: 'Reasonableness Referee', emoji: '🛡️',
        desc: 'Mastered calculation check reasonableness and financial estimation.',
        requirements: { points: 50, contexts: ['rounding-checks', 'budget-estimation'] }
    },
    'ac9m5n09': {
        code: 'AC9M5N09', year: 5, strand: 'number', badgeName: 'Scenario Modeller', emoji: '🧱',
        desc: 'Mastered multi-step word problems involving additive and multiplicative models.',
        requirements: { points: 50, contexts: ['additive-word-scenarios', 'multiplicative-word-scenarios'] }
    },
    'ac9m5n10': {
        code: 'AC9M5N10', year: 5, strand: 'number', badgeName: 'Divisibility Programmer', emoji: '💻',
        desc: 'Mastered flowchart loops and divisor checking algorithms.',
        requirements: { points: 50, contexts: ['flowchart-loops', 'divisor-checkers'] }
    },
    // Algebra
    'ac9m5a01': {
        code: 'AC9M5A01', year: 5, strand: 'algebra', badgeName: 'Fact Family Finder', emoji: '🤝',
        desc: 'Mastered fact families grid verification and related division facts.',
        requirements: { points: 50, contexts: ['fact-families-multiplication', 'fact-families-division'] }
    },
    'ac9m5a02': {
        code: 'AC9M5A02', year: 5, strand: 'algebra', badgeName: 'Equation Architect', emoji: '⚖️',
        desc: 'Mastered solving unknown equations using inverse operations.',
        requirements: { points: 50, contexts: ['unknown-multiplication', 'unknown-division'] }
    },
    // Measurement
    'ac9m5m01': {
        code: 'AC9M5M01', year: 5, strand: 'measurement', badgeName: 'Unit Specialist', emoji: '🛰️',
        desc: 'Mastered selecting appropriate metric units for precise measurements.',
        requirements: { points: 50, contexts: ['unit-matching', 'unit-comparison'] }
    },
    'ac9m5m02': {
        code: 'AC9M5M02', year: 5, strand: 'measurement', badgeName: 'Precision Builder', emoji: '📐',
        desc: 'Mastered calculating perimeter and area of compound irregular L-shapes.',
        requirements: { points: 50, contexts: ['irregular-perimeter', 'irregular-area'] }
    },
    'ac9m5m03': {
        code: 'AC9M5M03', year: 5, strand: 'measurement', badgeName: 'Time Navigator', emoji: '🧭',
        desc: 'Mastered converting 12-hour clock times to 24-hour systems.',
        requirements: { points: 50, contexts: ['time-conversion-12-to-24', 'time-conversion-24-to-12'] }
    },
    'ac9m5m04': {
        code: 'AC9M5M04', year: 5, strand: 'measurement', badgeName: 'Degree Inspector', emoji: '👁️',
        desc: 'Mastered estimating and measuring angles in degrees using protractors.',
        requirements: { points: 50, contexts: ['angle-estimation', 'angle-protractor-reads'] }
    },
    // Space
    'ac9m5sp01': {
        code: 'AC9M5SP01', year: 5, strand: 'space', badgeName: 'Net Folding Expert', emoji: '📦',
        desc: 'Mastered connecting 3D objects to their foldable flat nets.',
        requirements: { points: 50, contexts: ['net-folding', '3d-structure-maps'] }
    },
    'ac9m5sp02': {
        code: 'AC9M5SP02', year: 5, strand: 'space', badgeName: 'Coordinate Officer', emoji: '🗺️',
        desc: 'Mastered reading coordinates and calculating Manhattan grid distances.',
        requirements: { points: 50, contexts: ['read-coordinate', 'distance-manhattan'] }
    },
    'ac9m5sp03': {
        code: 'AC9M5SP03', year: 5, strand: 'space', badgeName: 'Vector Driver', emoji: '🚗',
        desc: 'Mastered translations, reflections, and rotation transformations.',
        requirements: { points: 50, contexts: ['vector-transformations', 'vector-reflection'] }
    },
    // Statistics & Probability
    'ac9m5st01': {
        code: 'AC9M5ST01', year: 5, strand: 'statistics', badgeName: 'Spreadsheet Auditor', emoji: '💻',
        desc: 'Mastered spreadsheet data tables, modes, and highest frequency charts.',
        requirements: { points: 50, contexts: ['mode-highlight', 'highest-frequency-charts'] }
    },
    'ac9m5st02': {
        code: 'AC9M5ST02', year: 5, strand: 'statistics', badgeName: 'Line Graph Analyst', emoji: '📈',
        desc: 'Mastered reading line graphs, peaks, valleys, and growth slopes.',
        requirements: { points: 50, contexts: ['read-value', 'max-min', 'biggest-increase'] }
    },
    'ac9m5st03': {
        code: 'AC9M5ST03', year: 5, strand: 'statistics', badgeName: 'Research Director', emoji: '💼',
        desc: 'Mastered planning statistics surveys and compiling chart displays.',
        requirements: { points: 50, contexts: ['data-display', 'investigation-planner'] }
    },
    'ac9m5p01': {
        code: 'AC9M5P01', year: 5, strand: 'probability', badgeName: 'Sample Space Cadet', emoji: '🎲',
        desc: 'Mastered identifying marble bag sample spaces and chance fractions.',
        requirements: { points: 50, contexts: ['die-outcomes', 'marble-likelihood', 'chance-fraction'] }
    },
    'ac9m5p02': {
        code: 'AC9M5P02', year: 5, strand: 'probability', badgeName: 'Predictive Planner', emoji: '🧬',
        desc: 'Mastered repeated spinner experiments and predicted frequencies.',
        requirements: { points: 50, contexts: ['chance-experiment', 'predicted-frequency'] }
    },

    // =========================================================================
    // YEAR 6 (Scaffolded for future expansion)
    // =========================================================================
    // Number
    'ac9m6n01': {
        code: 'AC9M6N01', year: 6, strand: 'number', badgeName: 'Integer Voyager', emoji: '🌌',
        desc: 'Mastered integers, negative number lines, and coordinate plotting.',
        requirements: { points: 50, contexts: ['negative-number-line', 'cartesian-four-quadrants'] }
    },
    'ac9m6n02': {
        code: 'AC9M6N02', year: 6, strand: 'number', badgeName: 'Prime Investigator', emoji: '🕵️',
        desc: 'Mastered factor tree checking and identifying primes, composites, and squares.',
        requirements: { points: 50, contexts: ['factor-tree-check', 'prime-composite-sort'] }
    },
    'ac9m6n03': {
        code: 'AC9M6N03', year: 6, strand: 'number', badgeName: 'Fraction Defender', emoji: '🛡️',
        desc: 'Mastered equivalences between halves, thirds, and quarters on number lines.',
        requirements: { points: 50, contexts: ['equivalence-fraction-check', 'number-line-position'] }
    },
    'ac9m6n04': {
        code: 'AC9M6N04', year: 6, strand: 'number', badgeName: 'Decimal Adder', emoji: '➕',
        desc: 'Mastered adding and subtracting decimals with vertical grids.',
        requirements: { points: 50, contexts: ['vertical-decimal-addition', 'vertical-decimal-subtraction'] }
    },
    'ac9m6n05': {
        code: 'AC9M6N05', year: 6, strand: 'number', badgeName: 'Fraction Summoner', emoji: '🧙‍♂️',
        desc: 'Mastered common denominators and adding/subtracting fractions.',
        requirements: { points: 50, contexts: ['common-denominator-lcd', 'fraction-add-sub-sums'] }
    },
    'ac9m6n06': {
        code: 'AC9M6N06', year: 6, strand: 'number', badgeName: 'Decimal Power Shifter', emoji: '🎛️',
        desc: 'Mastered multiplying and dividing decimals by powers of 10.',
        requirements: { points: 50, contexts: ['decimal-shift-multiply', 'decimal-shift-divide'] }
    },
    'ac9m6n07': {
        code: 'AC9M6N07', year: 6, strand: 'number', badgeName: 'Discount Detective', emoji: '🏷️',
        desc: 'Mastered calculating discounts and percentage of quantities.',
        requirements: { points: 50, contexts: ['percentage-discount', 'quantity-percentage'] }
    },
    'ac9m6n08': {
        code: 'AC9M6N08', year: 6, strand: 'number', badgeName: 'Rational Referee', emoji: '🤝',
        desc: 'Mastered calculation check reasonableness with rational numbers.',
        requirements: { points: 50, contexts: ['rational-rounding', 'rational-estimation'] }
    },
    'ac9m6n09': {
        code: 'AC9M6N09', year: 6, strand: 'number', badgeName: 'Rational Modeller', emoji: '👔',
        desc: 'Mastered financial scenarios and multi-step modelling with rational values.',
        requirements: { points: 50, contexts: ['rational-word-scenarios', 'rational-step-models'] }
    },
    // Algebra
    'ac9m6a01': {
        code: 'AC9M6A01', year: 6, strand: 'algebra', badgeName: 'Pattern Weaver', emoji: '🕸️',
        desc: 'Mastered growing sequences and patterns with rational values.',
        requirements: { points: 50, contexts: ['sequence-growth', 'pattern-visualisation'] }
    },
    'ac9m6a02': {
        code: 'AC9M6A02', year: 6, strand: 'algebra', badgeName: 'BODMAS Master', emoji: '⚡',
        desc: 'Mastered order of operations involving brackets and arithmetic.',
        requirements: { points: 50, contexts: ['order-operations-brackets', 'bodmas-flowchart'] }
    },
    'ac9m6a03': {
        code: 'AC9M6A03', year: 6, strand: 'algebra', badgeName: 'Rule Generator', emoji: '🛠️',
        desc: 'Mastered creating rules to generate number sequence sets.',
        requirements: { points: 50, contexts: ['rule-generation-formula', 'custom-pattern-run'] }
    },
    // Measurement
    'ac9m6m01': {
        code: 'AC9M6M01', year: 6, strand: 'measurement', badgeName: 'Metric Converter', emoji: '🔄',
        desc: 'Mastered metric unit conversions (length, mass, and capacity).',
        requirements: { points: 50, contexts: ['metric-slider-length', 'metric-slider-mass'] }
    },
    'ac9m6m02': {
        code: 'AC9M6M02', year: 6, strand: 'measurement', badgeName: 'Area Engineer', emoji: '📐',
        desc: 'Mastered area formulas for rectangles and solving composite area problems.',
        requirements: { points: 50, contexts: ['area-formula-rect', 'composite-area-solver'] }
    },
    'ac9m6m03': {
        code: 'AC9M6M03', year: 6, strand: 'measurement', badgeName: 'Journey Planner', emoji: '🚌',
        desc: 'Mastered reading timetables and travel itineraries.',
        requirements: { points: 50, contexts: ['timetable-bus-schedule', 'itinerary-calculations'] }
    },
    'ac9m6m04': {
        code: 'AC9M6M04', year: 6, strand: 'measurement', badgeName: 'Angle Solver', emoji: '⚙️',
        desc: 'Mastered finding missing angles on straight lines and points.',
        requirements: { points: 50, contexts: ['opposite-angle-solver', 'straight-line-angle'] }
    },
    // Space
    'ac9m6sp01': {
        code: 'AC9M6SP01', year: 6, strand: 'space', badgeName: 'Dimension Slicer', emoji: '🔪',
        desc: 'Mastered identifying cross-sections of prisms and pyramids.',
        requirements: { points: 50, contexts: ['prism-cross-section', 'pyramid-slice-visual'] }
    },
    'ac9m6sp02': {
        code: 'AC9M6SP02', year: 6, strand: 'space', badgeName: 'Cartesian Cartographer', emoji: '🗺️',
        desc: 'Mastered plotting coordinates across all four quadrants.',
        requirements: { points: 50, contexts: ['four-quadrant-plotter', 'four-quadrant-reads'] }
    },
    'ac9m6sp03': {
        code: 'AC9M6SP03', year: 6, strand: 'space', badgeName: 'Pattern Architect', emoji: '🏛️',
        desc: 'Mastered tessellations, tile rotations, and geometric patterns.',
        requirements: { points: 50, contexts: ['tessellation-rotations', 'tile-matching-puzzles'] }
    },
    // Statistics & Probability
    'ac9m6st01': {
        code: 'AC9M6ST01', year: 6, strand: 'statistics', badgeName: 'Distribution Detective', emoji: '🕵️‍♂️',
        desc: 'Mastered comparing modes, ranges, and data distributions.',
        requirements: { points: 50, contexts: ['range-comparisons', 'distribution-match'] }
    },
    'ac9m6st02': {
        code: 'AC9M6ST02', year: 6, strand: 'statistics', badgeName: 'Media Analyst', emoji: '📰',
        desc: 'Mastered critiquing misleading media arguments and graph scaling errors.',
        requirements: { points: 50, contexts: ['media-graph-errors', 'bias-checks'] }
    },
    'ac9m6st03': {
        code: 'AC9M6ST03', year: 6, strand: 'statistics', badgeName: 'Lead Investigator', emoji: '👑',
        desc: 'Mastered planning investigations and drawing logical conclusions from data.',
        requirements: { points: 50, contexts: ['investigation-conclusion', 'data-set-analysis'] }
    },
    'ac9m6p01': {
        code: 'AC9M6P01', year: 6, strand: 'probability', badgeName: 'Chance Strategist', emoji: '♟️',
        desc: 'Mastered converting probabilities between percentages, fractions, and decimals.',
        requirements: { points: 50, contexts: ['chance-percentage-slider', 'fraction-decimal-probability'] }
    },
    'ac9m6p02': {
        code: 'AC9M6P02', year: 6, strand: 'probability', badgeName: 'Simulation Commander', emoji: '💻',
        desc: 'Mastered large trial spinner simulators and comparing frequencies.',
        requirements: { points: 50, contexts: ['large-trial-spinner', 'frequency-comparison'] }
    }
};

const GRAND_BADGES = {
    // Foundation / Prep
    'y0-number-master': {
        year: 0, strand: 'number', name: 'Prep Number Pioneer', emoji: '🌟',
        desc: 'Mastered all Foundation Number descriptors — counting, comparing, partitioning and sharing.',
        borderClass: 'gold-glow-border'
    },
    'y0-algebra-master': {
        year: 0, strand: 'algebra', name: 'Prep Pattern Pilot', emoji: '🔁',
        desc: 'Mastered all Foundation Algebra descriptors covering repeating patterns.',
        borderClass: 'gold-glow-border'
    },
    'y0-measurement-master': {
        year: 0, strand: 'measurement', name: 'Prep Measure Mate', emoji: '📏',
        desc: 'Mastered all Foundation Measurement descriptors — compare, sequence and order.',
        borderClass: 'gold-glow-border'
    },
    'y0-space-master': {
        year: 0, strand: 'space', name: 'Prep Space Scout', emoji: '🚀',
        desc: 'Mastered all Foundation Space descriptors — shape sorting and positional language.',
        borderClass: 'gold-glow-border'
    },
    'y0-statistics-master': {
        year: 0, strand: 'statistics', name: 'Prep Data Detective', emoji: '📋',
        desc: 'Mastered all Foundation Statistics descriptors covering picture-graph data sorts.',
        borderClass: 'gold-glow-border'
    },

    // Year 1
    'y1-number-master': {
        year: 1, strand: 'number', name: 'Year 1 Number Navigator', emoji: '🛤️',
        desc: 'Mastered all Year 1 Number descriptors — tracks, teens, and jumps within twenty.',
        borderClass: 'gold-glow-border'
    },
    'y1-algebra-master': {
        year: 1, strand: 'algebra', name: 'Year 1 Skip-Count Star', emoji: '2️⃣',
        desc: 'Mastered all Year 1 Algebra descriptors covering skip-count patterns.',
        borderClass: 'gold-glow-border'
    },
    'y1-measurement-master': {
        year: 1, strand: 'measurement', name: 'Year 1 Time & Measure Ace', emoji: '🕐',
        desc: 'Mastered all Year 1 Measurement descriptors — informal units and half-hour clocks.',
        borderClass: 'gold-glow-border'
    },
    'y1-space-master': {
        year: 1, strand: 'space', name: 'Year 1 Shape Crafter', emoji: '📌',
        desc: 'Mastered all Year 1 Space descriptors covering pegboard shape building.',
        borderClass: 'gold-glow-border'
    },
    'y1-statistics-master': {
        year: 1, strand: 'statistics', name: 'Year 1 Graph Starter', emoji: '⭐',
        desc: 'Mastered all Year 1 Statistics descriptors covering one-to-one picture graphs.',
        borderClass: 'gold-glow-border'
    },

    // Year 2
    'y2-number-master': {
        year: 2, strand: 'number', name: 'Year 2 Number Engineer', emoji: '🏗️',
        desc: 'Mastered all Year 2 Number descriptors — place value, fractions, arrays and money.',
        borderClass: 'gold-glow-border'
    },
    'y2-measurement-master': {
        year: 2, strand: 'measurement', name: 'Year 2 Measure Master', emoji: '📐',
        desc: 'Mastered all Year 2 Measurement descriptors — centimetres and quarter-hour clocks.',
        borderClass: 'gold-glow-border'
    },
    'y2-space-master': {
        year: 2, strand: 'space', name: 'Year 2 Transform Pilot', emoji: '🔃',
        desc: 'Mastered all Year 2 Space descriptors covering flip, slide and turn.',
        borderClass: 'gold-glow-border'
    },
    'y2-probability-master': {
        year: 2, strand: 'probability', name: 'Year 2 Chance Cadet', emoji: '🎲',
        desc: 'Mastered all Year 2 Probability descriptors — likely, unlikely and impossible events.',
        borderClass: 'gold-glow-border'
    },
    'y2-statistics-master': {
        year: 2, strand: 'statistics', name: 'Year 2 Data Analyst', emoji: '📊',
        desc: 'Mastered all Year 2 Statistics descriptors — collect, build and compare graphs.',
        borderClass: 'gold-glow-border'
    },

    // Year 3
    'y3-number-master': {
        year: 3, strand: 'number', name: 'Year 3 Number Overlord', emoji: '👑',
        desc: 'Mastered all Year 3 Number descriptors including five-digit place value, fractions, and algorithms.',
        borderClass: 'gold-glow-border'
    },
    'y3-algebra-master': {
        year: 3, strand: 'algebra', name: 'Year 3 Logic Master', emoji: '⚡',
        desc: 'Mastered all Year 3 Algebra descriptors, inverse calculations, and fact recall.',
        borderClass: 'gold-glow-border'
    },
    'y3-measurement-master': {
        year: 3, strand: 'measurement', name: 'Year 3 Time & Money Ace', emoji: '⏳',
        desc: 'Mastered all Year 3 Measurement descriptors covering time, money, and scales.',
        borderClass: 'gold-glow-border'
    },
    'y3-space-master': {
        year: 3, strand: 'space', name: 'Year 3 Space Scout', emoji: '🌍',
        desc: 'Mastered all Year 3 Space descriptors covering 3D solids and environmental navigation.',
        borderClass: 'gold-glow-border'
    },
    'y3-statistics-master': {
        year: 3, strand: 'statistics', name: 'Year 3 Data Reporter', emoji: '📈',
        desc: 'Mastered all Year 3 Statistics descriptors, frequency tables, and column charts.',
        borderClass: 'gold-glow-border'
    },
    'y3-probability-master': {
        year: 3, strand: 'probability', name: 'Year 3 Spinner Champion', emoji: '🎲',
        desc: 'Mastered all Year 3 Probability descriptors covering spinner trials and chance spectrums.',
        borderClass: 'gold-glow-border'
    },

    // Year 4
    'y4-number-master': {
        year: 4, strand: 'number', name: 'Year 4 Decimal Officer', emoji: '🎖️',
        desc: 'Mastered all Year 4 Number descriptors, decimal comparisons, equivalence, and algorithms.',
        borderClass: 'gold-glow-border'
    },
    'y4-algebra-master': {
        year: 4, strand: 'algebra', name: 'Year 4 Equation Captain', emoji: '⚔️',
        desc: 'Mastered all Year 4 Algebra descriptors, balance scales, and timed recall.',
        borderClass: 'gold-glow-border'
    },
    'y4-measurement-master': {
        year: 4, strand: 'measurement', name: 'Year 4 Area Architect', emoji: '📐',
        desc: 'Mastered all Year 4 Measurement descriptors covering unmarked scales, area, and schedules.',
        borderClass: 'gold-glow-border'
    },
    'y4-space-master': {
        year: 4, strand: 'space', name: 'Year 4 Symmetry Artist', emoji: '🦋',
        desc: 'Mastered all Year 4 Space descriptors covering composite shapes, routing, and symmetry.',
        borderClass: 'gold-glow-border'
    },
    'y4-statistics-master': {
        year: 4, strand: 'statistics', name: 'Year 4 Chart Analyst', emoji: '📉',
        desc: 'Mastered all Year 4 Statistics descriptors, data distributions, and surveys.',
        borderClass: 'gold-glow-border'
    },
    'y4-probability-master': {
        year: 4, strand: 'probability', name: 'Year 4 Chance Commander', emoji: '🔬',
        desc: 'Mastered all Year 4 Probability descriptors covering probability scales and trial records.',
        borderClass: 'gold-glow-border'
    },

    // Year 5
    'y5-number-master': {
        year: 5, strand: 'number', name: 'Year 5 Number Overlord', emoji: '👑',
        desc: 'Mastered all Year 5 Number content descriptors including factors, decimals, percentages, and operations.',
        borderClass: 'gold-glow-border'
    },
    'y5-algebra-master': {
        year: 5, strand: 'algebra', name: 'Year 5 Logic Architect', emoji: '⚡',
        desc: 'Mastered all Year 5 Algebra descriptors, fact family grids, and unknown variables.',
        borderClass: 'gold-glow-border'
    },
    'y5-measurement-master': {
        year: 5, strand: 'measurement', name: 'Year 5 Grand Surveyor', emoji: '🌍',
        desc: 'Mastered all Year 5 Measurement descriptors covering irregular area, time navigation, and degree angles.',
        borderClass: 'gold-glow-border'
    },
    'y5-space-master': {
        year: 5, strand: 'space', name: 'Year 5 Net Folder Pro', emoji: '📦',
        desc: 'Mastered all Year 5 Space descriptors covering prism folding, coordinate grids, and vectors.',
        borderClass: 'gold-glow-border'
    },
    'y5-statistics-master': {
        year: 5, strand: 'statistics', name: 'Year 5 Line Analyst', emoji: '📊',
        desc: 'Mastered all Year 5 Statistics descriptors covering spreadsheets, line graphs, and surveys.',
        borderClass: 'gold-glow-border'
    },
    'y5-probability-master': {
        year: 5, strand: 'probability', name: 'Year 5 sample Space Ranger', emoji: '🎲',
        desc: 'Mastered all Year 5 Probability descriptors covering sample spaces and frequency predictions.',
        borderClass: 'gold-glow-border'
    },

    // Year 6
    'y6-number-master': {
        year: 6, strand: 'number', name: 'Year 6 Integer Admiral', emoji: '👑',
        desc: 'Mastered all Year 6 Number content descriptors including negative numbers, fractions LCD, and discounts.',
        borderClass: 'gold-glow-border'
    },
    'y6-algebra-master': {
        year: 6, strand: 'algebra', name: 'Year 6 BODMAS Overlord', emoji: '⚡',
        desc: 'Mastered all Year 6 Algebra descriptors covering sequence patterns and BODMAS equations.',
        borderClass: 'gold-glow-border'
    },
    'y6-measurement-master': {
        year: 6, strand: 'measurement', name: 'Year 6 Area Engineer', emoji: '📐',
        desc: 'Mastered all Year 6 Measurement descriptors covering metric conversions, timetables, and angle relationships.',
        borderClass: 'gold-glow-border'
    },
    'y6-space-master': {
        year: 6, strand: 'space', name: 'Year 6 Cartesian Cartographer', emoji: '🗺️',
        desc: 'Mastered all Year 6 Space descriptors covering prism slices, Cartesian plane, and tessellations.',
        borderClass: 'gold-glow-border'
    },
    'y6-statistics-master': {
        year: 6, strand: 'statistics', name: 'Year 6 Lead Investigator', emoji: '📊',
        desc: 'Mastered all Year 6 Statistics descriptors covering modes, media biases, and research findings.',
        borderClass: 'gold-glow-border'
    },
    'y6-probability-master': {
        year: 6, strand: 'probability', name: 'Year 6 Simulation Commander', emoji: '🎲',
        desc: 'Mastered all Year 6 Probability descriptors covering rational probability scales and spinner simulations.',
        borderClass: 'gold-glow-border'
    }
};

/** Canonical uppercase AC descriptor code for profile keys. */
function normalizeDescriptorCode(code) {
    return code ? String(code).toUpperCase() : '';
}

/** Merge legacy mixed-case descriptor keys into canonical uppercase keys. */
function migrateDescriptorProfileKeys(profile) {
    if (!profile) return;
    ['scoresByDescriptor', 'solvedContexts', 'consecutiveCorrect'].forEach((field) => {
        const bag = profile[field];
        if (!bag) return;
        Object.keys(bag).forEach((key) => {
            const upper = normalizeDescriptorCode(key);
            if (upper === key) return;
            if (field === 'solvedContexts') {
                const merged = Array.isArray(bag[upper]) ? bag[upper].slice() : [];
                const arr = Array.isArray(bag[key]) ? bag[key] : [];
                arr.forEach((c) => {
                    if (merged.indexOf(c) === -1) merged.push(c);
                });
                bag[upper] = merged;
            } else if (field === 'consecutiveCorrect') {
                bag[upper] = Math.max(bag[upper] || 0, bag[key] || 0);
            } else {
                bag[upper] = (bag[upper] || 0) + (bag[key] || 0);
            }
            delete bag[key];
        });
    });
}

function getBadgeProgress(profile, badgeKey) {
    const badge = DESCRIPTOR_BADGES[badgeKey];
    if (!badge || !profile) return null;
    const code = normalizeDescriptorCode(badge.code);
    const pointsReq = badge.requirements.points;
    const contextsReq = badge.requirements.contexts;
    const points = profile.scoresByDescriptor?.[code] || 0;
    const solved = profile.solvedContexts?.[code] || [];
    const missingContexts = contextsReq.filter((c) => solved.indexOf(c) === -1);
    return {
        code,
        points,
        pointsReq,
        solved,
        contextsReq,
        missingContexts,
        contextsMet: missingContexts.length === 0,
        pointsMet: points >= pointsReq,
    };
}

function formatBadgeLockedTooltip(profile, badgeKey) {
    const badge = DESCRIPTOR_BADGES[badgeKey];
    const progress = getBadgeProgress(profile, badgeKey);
    if (!badge || !progress) return '';
    const ctxSummary = `${progress.solved.length}/${progress.contextsReq.length} contexts`;
    let missing = '';
    if (progress.missingContexts.length) {
        missing = ` Missing contexts: ${progress.missingContexts.join(', ')}.`;
    }
    return `${badge.badgeName} (Locked: ${progress.points}/${progress.pointsReq} points, ${ctxSummary}.${missing})`;
}

function formatBadgeContextTicks(profile, badgeKey) {
    const progress = getBadgeProgress(profile, badgeKey);
    if (!progress) return '';
    return progress.contextsReq.map((ctx) => {
        const done = progress.solved.indexOf(ctx) !== -1;
        return done ? '✓' : '○';
    }).join('');
}

function formatContextLabel(ctx) {
    return String(ctx)
        .split('-')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
}

function getGrandBadgeProgress(profile, grandKey) {
    const gb = GRAND_BADGES[grandKey];
    if (!gb || !profile) return null;
    const strandDescriptors = Object.keys(DESCRIPTOR_BADGES).filter(
        (k) => DESCRIPTOR_BADGES[k].year === gb.year && DESCRIPTOR_BADGES[k].strand === gb.strand
    );
    const unlockedKeys = strandDescriptors.filter((k) => profile.badges.includes(k));
    const missingKeys = strandDescriptors.filter((k) => !profile.badges.includes(k));
    return {
        total: strandDescriptors.length,
        unlocked: unlockedKeys.length,
        missingKeys,
        missingNames: missingKeys.map((k) => DESCRIPTOR_BADGES[k].badgeName),
    };
}

function closeBadgeProgressModal() {
    const root = document.getElementById('badge-progress-root');
    if (!root) return;
    const overlay = document.getElementById('badge-progress-overlay');
    if (overlay) {
        overlay.classList.add('closing');
        overlay.addEventListener('animationend', () => root.remove(), { once: true });
    } else {
        root.remove();
    }
}

function wireBadgeProgressModalClose(root, options) {
    const overlay = root.querySelector('#badge-progress-overlay');
    const onClose = () => {
        if (options.onClose) options.onClose();
        closeBadgeProgressModal();
    };

    root.querySelector('.badge-progress-btn-close').addEventListener('click', onClose);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) onClose();
    });
    document.addEventListener('keydown', function escHandler(e) {
        if (e.key === 'Escape') {
            onClose();
            document.removeEventListener('keydown', escHandler);
        }
    });

    const certBtn = root.querySelector('.badge-progress-btn-cert');
    if (certBtn && options.onViewCertificate) {
        certBtn.addEventListener('click', () => {
            if (options.onBeforeCertificate) options.onBeforeCertificate();
            closeBadgeProgressModal();
            options.onViewCertificate();
        });
    }
}

function showDescriptorBadgeProgressModal(profile, badgeKey, options) {
    const badge = DESCRIPTOR_BADGES[badgeKey];
    const progress = getBadgeProgress(profile, badgeKey);
    if (!badge || !progress) return;

    const isUnlocked = profile.badges.includes(badgeKey);
    const strandTheme = STRAND_THEMES[badge.strand] || { colour: 'var(--primary)', name: badge.strand };
    const pointsPct = progress.pointsReq > 0
        ? Math.min(100, Math.round((progress.points / progress.pointsReq) * 100))
        : 0;

    const contextRows = progress.contextsReq.map((ctx) => {
        const done = progress.solved.indexOf(ctx) !== -1;
        const rowClass = done ? 'done' : 'missing';
        const icon = done ? '✓' : '○';
        return `<div class="badge-progress-context-row ${rowClass}"><span class="badge-progress-context-icon">${icon}</span><span>${formatContextLabel(ctx)}</span></div>`;
    }).join('');

    const certBtnHtml = isUnlocked && options.onViewCertificate
        ? '<button type="button" class="badge-progress-btn badge-progress-btn-cert">View Certificate</button>'
        : '';

    const existing = document.getElementById('badge-progress-root');
    if (existing) existing.remove();

    const root = document.createElement('div');
    root.id = 'badge-progress-root';
    root.innerHTML = `
        <div class="badge-progress-overlay" id="badge-progress-overlay">
            <div class="badge-progress-card strand-border-${badge.strand}" role="dialog" aria-modal="true" aria-label="${badge.badgeName} progress" style="border-top-color: ${strandTheme.colour}; --badge-strand-colour: ${strandTheme.colour};">
                <div class="badge-progress-header" style="background-color: ${strandTheme.colour};">
                    <span class="badge-progress-emoji" aria-hidden="true">${badge.emoji}</span>
                    <div class="badge-progress-title-block">
                        <div class="badge-progress-title">${badge.badgeName}</div>
                        <div class="badge-progress-code">${badge.code}</div>
                    </div>
                    <span class="badge-progress-status ${isUnlocked ? 'unlocked' : 'locked'}">${isUnlocked ? 'UNLOCKED' : 'LOCKED'}</span>
                </div>
                <div class="badge-progress-body">
                    <p class="badge-progress-desc">${badge.desc}</p>
                    <div class="badge-progress-section">
                        <div class="badge-progress-section-label">Points</div>
                        <div class="badge-progress-points-row">
                            <span class="badge-progress-points-val">${progress.points} / ${progress.pointsReq}</span>
                            <div class="badge-progress-bar">
                                <div class="badge-progress-bar-fill" style="width: ${pointsPct}%; background-color: ${strandTheme.colour};"></div>
                            </div>
                        </div>
                    </div>
                    <div class="badge-progress-section">
                        <div class="badge-progress-section-label">Required Contexts</div>
                        <div class="badge-progress-context-list">${contextRows}</div>
                    </div>
                </div>
                <div class="badge-progress-footer">
                    <button type="button" class="badge-progress-btn badge-progress-btn-close">Close</button>
                    ${certBtnHtml}
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(root);
    wireBadgeProgressModalClose(root, options);
}

function showGrandBadgeProgressModal(profile, grandKey, options) {
    const gb = GRAND_BADGES[grandKey];
    const progress = getGrandBadgeProgress(profile, grandKey);
    if (!gb || !progress) return;

    const isUnlocked = profile.badges.includes(grandKey);
    const strandTheme = STRAND_THEMES[gb.strand] || { colour: 'var(--primary)', name: gb.strand };
    const strandPct = progress.total > 0
        ? Math.min(100, Math.round((progress.unlocked / progress.total) * 100))
        : 0;

    const missingListHtml = progress.missingNames.length
        ? `<div class="badge-progress-section">
                <div class="badge-progress-section-label">Still Needed</div>
                <ul class="badge-progress-missing-list">${progress.missingNames.map((n) => `<li>${n}</li>`).join('')}</ul>
           </div>`
        : '<p class="badge-progress-complete-msg">All strand badges unlocked — mastery award earned!</p>';

    const certBtnHtml = isUnlocked && options.onViewCertificate
        ? '<button type="button" class="badge-progress-btn badge-progress-btn-cert">View Certificate</button>'
        : '';

    const existing = document.getElementById('badge-progress-root');
    if (existing) existing.remove();

    const root = document.createElement('div');
    root.id = 'badge-progress-root';
    root.innerHTML = `
        <div class="badge-progress-overlay" id="badge-progress-overlay">
            <div class="badge-progress-card strand-border-${gb.strand}" role="dialog" aria-modal="true" aria-label="${gb.name} progress" style="border-top-color: ${strandTheme.colour}; --badge-strand-colour: ${strandTheme.colour};">
                <div class="badge-progress-header" style="background-color: ${strandTheme.colour};">
                    <span class="badge-progress-emoji" aria-hidden="true">${gb.emoji}</span>
                    <div class="badge-progress-title-block">
                        <div class="badge-progress-title">${gb.name}</div>
                        <div class="badge-progress-code">${strandTheme.name.toUpperCase()} STRAND MASTERY</div>
                    </div>
                    <span class="badge-progress-status ${isUnlocked ? 'unlocked' : 'locked'}">${isUnlocked ? 'UNLOCKED' : 'LOCKED'}</span>
                </div>
                <div class="badge-progress-body">
                    <p class="badge-progress-desc">${gb.desc}</p>
                    <div class="badge-progress-section">
                        <div class="badge-progress-section-label">Strand Badges</div>
                        <div class="badge-progress-points-row">
                            <span class="badge-progress-points-val">${progress.unlocked} / ${progress.total}</span>
                            <div class="badge-progress-bar">
                                <div class="badge-progress-bar-fill" style="width: ${strandPct}%; background-color: ${strandTheme.colour};"></div>
                            </div>
                        </div>
                    </div>
                    ${missingListHtml}
                </div>
                <div class="badge-progress-footer">
                    <button type="button" class="badge-progress-btn badge-progress-btn-close">Close</button>
                    ${certBtnHtml}
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(root);
    wireBadgeProgressModalClose(root, options);
}

function showBadgeProgressModal(profile, badgeKey, options) {
    if (DESCRIPTOR_BADGES[badgeKey]) {
        showDescriptorBadgeProgressModal(profile, badgeKey, options || {});
    } else if (GRAND_BADGES[badgeKey]) {
        showGrandBadgeProgressModal(profile, badgeKey, options || {});
    }
}

/** Node audit: simulate crediting all required contexts at point threshold. */
function simulateDescriptorCredit(badge, pointsPerContext) {
    const code = normalizeDescriptorCode(badge.code);
    const profile = {
        badges: [],
        scoresByDescriptor: {},
        solvedContexts: {},
        streak: 0,
        score: 0,
    };
    badge.requirements.contexts.forEach((ctx) => {
        profile.scoresByDescriptor[code] = (profile.scoresByDescriptor[code] || 0) + pointsPerContext;
        if (!profile.solvedContexts[code]) profile.solvedContexts[code] = [];
        profile.solvedContexts[code].push(ctx);
    });
    const points = profile.scoresByDescriptor[code] || 0;
    const solved = profile.solvedContexts[code] || [];
    const unlocked =
        points >= badge.requirements.points &&
        badge.requirements.contexts.every((c) => solved.indexOf(c) !== -1);
    return { unlocked, points, solved: solved.slice() };
}

// Make config globally accessible
if (typeof window !== 'undefined') {
    window.STRAND_THEMES = STRAND_THEMES;
    window.DESCRIPTOR_BADGES = DESCRIPTOR_BADGES;
    window.GRAND_BADGES = GRAND_BADGES;
    window.GLOBAL_BADGES = GLOBAL_BADGES;
    window.normalizeDescriptorCode = normalizeDescriptorCode;
    window.migrateDescriptorProfileKeys = migrateDescriptorProfileKeys;
    window.getBadgeProgress = getBadgeProgress;
    window.formatBadgeLockedTooltip = formatBadgeLockedTooltip;
    window.formatBadgeContextTicks = formatBadgeContextTicks;
    window.formatContextLabel = formatContextLabel;
    window.getGrandBadgeProgress = getGrandBadgeProgress;
    window.showBadgeProgressModal = showBadgeProgressModal;
    window.closeBadgeProgressModal = closeBadgeProgressModal;
}
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        STRAND_THEMES,
        DESCRIPTOR_BADGES,
        GRAND_BADGES,
        GLOBAL_BADGES,
        normalizeDescriptorCode,
        migrateDescriptorProfileKeys,
        getBadgeProgress,
        formatBadgeLockedTooltip,
        formatBadgeContextTicks,
        formatContextLabel,
        getGrandBadgeProgress,
        showBadgeProgressModal,
        closeBadgeProgressModal,
        simulateDescriptorCredit,
    };
}
