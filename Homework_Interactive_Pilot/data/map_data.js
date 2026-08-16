/**
 * Map and spatial dataset for Term 3 Week 6 Interactive Homework
 * Regions: Borneo (Kalimantan & Northern Borneo), Indonesia Archipelago, and Australian comparison
 */
window.MAP_DATA = {
  // Color scales for different thematic layers
  layers: {
    density: {
      name: "Population Density",
      unit: "people / km²",
      description: "Measure of how crowded an area is (population divided by land area).",
      bins: [
        { min: 0, max: 20, color: "#E0F2FE", label: "Under 20 (Sparse / Remote)", textDark: true },
        { min: 20, max: 50, color: "#7DD3FC", label: "20 – 50 (Low Density)", textDark: true },
        { min: 50, max: 100, color: "#38BDF8", label: "50 – 100 (Moderate)", textDark: true },
        { min: 100, max: 500, color: "#0284C7", label: "100 – 500 (High Density)", textDark: false },
        { min: 500, max: 99999, color: "#0C4A6E", label: "Over 500 (Extreme Urban / Java)", textDark: false }
      ]
    },
    dayak: {
      name: "Dayak Population Share",
      unit: "% of regional population",
      description: "Proportion of Indigenous Dayak peoples living in each province/state of Borneo.",
      bins: [
        { min: 0, max: 20, color: "#FEF3C7", label: "Under 20% (Coastal / Urban majority)", textDark: true },
        { min: 20, max: 40, color: "#FBBF24", label: "20% – 40% (Mixed demographics)", textDark: true },
        { min: 40, max: 55, color: "#F59E0B", label: "40% – 55% (High Dayak concentration)", textDark: false },
        { min: 55, max: 100, color: "#B45309", label: "Over 55% (Predominantly Dayak heartland)", textDark: false }
      ]
    },
    forest: {
      name: "Rainforest Canopy Cover",
      unit: "% remaining forest cover",
      description: "Percentage of land area currently covered by primary and protected rainforest.",
      bins: [
        { min: 0, max: 35, color: "#FEE2E2", label: "Under 35% (Heavy agriculture/urban)", textDark: true },
        { min: 35, max: 50, color: "#86EFAC", label: "35% – 50% (Mixed timber & regrowth)", textDark: true },
        { min: 50, max: 65, color: "#22C55E", label: "50% – 65% (Substantial intact forest)", textDark: false },
        { min: 65, max: 100, color: "#15803D", label: "Over 65% (Dense primary heartland)", textDark: false }
      ]
    }
  },

  // Borneo Provinces & States (SVG Polygons / Paths coordinates in a 800x600 viewBox)
  borneoRegions: [
    {
      id: "kalbar",
      name: "West Kalimantan (Kalimantan Barat)",
      shortName: "West Kalimantan",
      capital: "Pontianak",
      nation: "Indonesia",
      population: 5500000,
      areaKm2: 147307,
      density: 37.3,
      dayakPct: 50,
      forestPct: 48,
      keyFeatures: "Kapuas River network (longest in Indonesia), strong Iban and Bidayuh cultural heritage.",
      // SVG path coordinates approximating province shape on Borneo
      path: "M 160,260 L 220,200 L 280,210 L 320,270 L 310,340 L 260,390 L 190,380 L 140,320 Z",
      labelPos: { x: 220, y: 300 }
    },
    {
      id: "kalteng",
      name: "Central Kalimantan (Kalimantan Tengah)",
      shortName: "Central Kalimantan",
      capital: "Palangka Raya",
      nation: "Indonesia",
      population: 2750000,
      areaKm2: 153564,
      density: 17.9,
      dayakPct: 53,
      forestPct: 56,
      keyFeatures: "Largest land area of Kalimantan provinces; extensive peatland forests and Ngaju Dayak culture.",
      path: "M 320,270 L 400,270 L 430,340 L 420,440 L 330,470 L 260,390 L 310,340 Z",
      labelPos: { x: 340, y: 370 }
    },
    {
      id: "kalsel",
      name: "South Kalimantan (Kalimantan Selatan)",
      shortName: "South Kalimantan",
      capital: "Banjarmasin",
      nation: "Indonesia",
      population: 4200000,
      areaKm2: 38744,
      density: 108.4,
      dayakPct: 15,
      forestPct: 28,
      keyFeatures: "Most densely populated province in Borneo; coastal trading hub and Meratus Mountains.",
      path: "M 430,340 L 490,360 L 510,430 L 470,480 L 420,440 Z",
      labelPos: { x: 460, y: 410 }
    },
    {
      id: "kaltim",
      name: "East Kalimantan (Kalimantan Timur)",
      shortName: "East Kalimantan",
      capital: "Samarinda / Balikpapan (IKN Nusantara)",
      nation: "Indonesia",
      population: 3900000,
      areaKm2: 127346,
      density: 30.6,
      dayakPct: 30,
      forestPct: 52,
      keyFeatures: "Mahakam River basin; site of Indonesia's new capital city Nusantara; Kenyah and Kayan traditions.",
      path: "M 400,270 L 450,170 L 530,190 L 590,260 L 540,350 L 490,360 L 430,340 Z",
      labelPos: { x: 490, y: 270 }
    },
    {
      id: "kaltara",
      name: "North Kalimantan (Kalimantan Utara)",
      shortName: "North Kalimantan",
      capital: "Tanjung Selor",
      nation: "Indonesia",
      population: 720000,
      areaKm2: 75468,
      density: 9.5,
      dayakPct: 45,
      forestPct: 74,
      keyFeatures: "Most forested and least densely populated province; rugged highland rainforests bordering Malaysia.",
      path: "M 450,170 L 480,90 L 560,90 L 590,180 L 530,190 Z",
      labelPos: { x: 515, y: 135 }
    },
    {
      id: "sarawak",
      name: "Sarawak",
      shortName: "Sarawak",
      capital: "Kuching",
      nation: "Malaysia",
      population: 2900000,
      areaKm2: 124450,
      density: 23.3,
      dayakPct: 40,
      forestPct: 58,
      keyFeatures: "Longest coastline along the South China Sea; celebrated Gawai Dayak harvest festival.",
      path: "M 160,260 L 220,200 L 280,210 L 320,270 L 400,270 L 450,170 L 480,90 L 400,100 L 320,130 L 230,170 Z",
      labelPos: { x: 290, y: 160 }
    },
    {
      id: "sabah",
      name: "Sabah",
      shortName: "Sabah",
      capital: "Kota Kinabalu",
      nation: "Malaysia",
      population: 3900000,
      areaKm2: 73631,
      density: 53.0,
      dayakPct: 35,
      forestPct: 62,
      keyFeatures: "Home to Mount Kinabalu (Borneo's highest peak); rich Kadazan-Dusun and Murut cultures.",
      path: "M 480,90 L 530,30 L 610,50 L 640,110 L 560,90 Z",
      labelPos: { x: 560, y: 65 }
    },
    {
      id: "brunei",
      name: "Brunei Darussalam",
      shortName: "Brunei",
      capital: "Bandar Seri Begawan",
      nation: "Brunei",
      population: 450000,
      areaKm2: 5765,
      density: 78.1,
      dayakPct: 8,
      forestPct: 72,
      keyFeatures: "Sultanate enclave surrounded by Sarawak; renowned for untouched Ulu Temburong National Park.",
      path: "M 410,95 L 430,90 L 440,110 L 420,115 Z",
      labelPos: { x: 425, y: 100 }
    }
  ],

  // Island Comparison Data (Indonesia)
  indonesiaIslands: [
    { name: "Java", population: 156000000, areaKm2: 128297, density: 1216, color: "#0C4A6E" },
    { name: "Sumatra", population: 60000000, areaKm2: 473481, density: 127, color: "#0284C7" },
    { name: "Sulawesi", population: 20500000, areaKm2: 180681, density: 113, color: "#38BDF8" },
    { name: "Kalimantan (Borneo)", population: 17100000, areaKm2: 544150, density: 31, color: "#7DD3FC" },
    { name: "Bali & Nusa Tenggara", population: 15200000, areaKm2: 73070, density: 208, color: "#0284C7" },
    { name: "Papua (Indonesian)", population: 5600000, areaKm2: 421981, density: 13, color: "#E0F2FE" },
    { name: "Maluku", population: 3200000, areaKm2: 78896, density: 41, color: "#7DD3FC" }
  ],

  // Australian States & Territories Comparison
  australianStates: [
    { name: "New South Wales (NSW)", population: 8400000, areaKm2: 800642, density: 10.5, color: "#0284C7" },
    { name: "Victoria (VIC)", population: 6800000, areaKm2: 227416, density: 29.9, color: "#0284C7" },
    { name: "Queensland (QLD)", population: 5500000, areaKm2: 1730648, density: 3.2, color: "#7DD3FC" },
    { name: "Western Australia (WA)", population: 2900000, areaKm2: 2529875, density: 1.1, color: "#E0F2FE" },
    { name: "South Australia (SA)", population: 1850000, areaKm2: 983482, density: 1.9, color: "#E0F2FE" },
    { name: "Tasmania (TAS)", population: 570000, areaKm2: 68401, density: 8.3, color: "#7DD3FC" },
    { name: "ACT (Canberra)", population: 460000, areaKm2: 2358, density: 195.1, color: "#0C4A6E" },
    { name: "Northern Territory (NT)", population: 250000, areaKm2: 1349129, density: 0.19, color: "#E0F2FE" }
  ],

  // Deforestation Timeline (Borneo 1970–2025)
  forestTimeline: [
    { year: 1970, forestPct: 75, clearedPct: 25, label: "Mostly undisturbed primary canopy" },
    { year: 1985, forestPct: 70, clearedPct: 30, label: "Initial selective commercial logging" },
    { year: 2000, forestPct: 57, clearedPct: 43, label: "Expansion of oil palm plantations & mining" },
    { year: 2010, forestPct: 49, clearedPct: 51, label: "Forest threshold: under 50% canopy" },
    { year: 2025, forestPct: 53, clearedPct: 47, label: "Conservation zones & Indigenous customary protection" }
  ]
};
