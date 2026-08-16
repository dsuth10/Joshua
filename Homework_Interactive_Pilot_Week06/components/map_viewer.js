/**
 * Real Cartographic Map Viewer using Leaflet.js and Authentic GeoJSON Administrative Boundaries
 * Features:
 * - Real basemaps (CartoDB Positron, Esri Satellite, OpenStreetMap)
 * - Exact geographic boundary polygons for Borneo provinces/states & Indonesia
 * - Thematic Choropleth styling (Density, Dayak %, Forest Cover)
 * - Dynamic legend filtering, interactive tooltips, and region inspector
 * - Zoom & Pan with view-extent presets (Borneo, Indonesia Archipelago, Australia)
 */
class MapViewer {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    this.data = window.MAP_DATA;
    this.currentLayer = options.defaultLayer || "density";
    this.currentBasemap = "positron"; // "positron" | "satellite" | "osm" | "dark"
    this.selectedRegion = null;
    this.activeBinFilter = null;
    this.activeViewPreset = "borneo"; // "borneo" | "indonesia" | "australia"
    this.map = null;
    this.geoJsonLayer = null;
    this.tileLayers = {};

    this.init();
  }

  init() {
    if (!this.container) return;
    this.renderShell();
    this.initLeafletMap();
  }

  renderShell() {
    const layer = this.data.layers[this.currentLayer];
    this.container.innerHTML = `
      <div class="map-wrapper card glass">
        <div class="map-header">
          <div class="map-title-area">
            <h3 class="map-title"><span class="icon-geo">🗺️</span> Real Geographic Map Explorer</h3>
            <p class="map-subtitle">${layer.name} (${layer.unit}) — <em>${layer.description}</em></p>
          </div>
          <div class="map-layer-tabs" role="tablist">
            <button class="layer-tab-btn ${this.currentLayer === 'density' ? 'active' : ''}" data-layer="density" id="tab-density">
              📊 Population Density
            </button>
            <button class="layer-tab-btn ${this.currentLayer === 'dayak' ? 'active' : ''}" data-layer="dayak" id="tab-dayak">
              🌿 Dayak Distribution
            </button>
            <button class="layer-tab-btn ${this.currentLayer === 'forest' ? 'active' : ''}" data-layer="forest" id="tab-forest">
              🌳 Rainforest Canopy
            </button>
          </div>
        </div>

        <div class="map-workspace-grid">
          <!-- Main Map Stage -->
          <div class="map-canvas-card">
            <div class="map-toolbar">
              <div class="map-preset-group">
                <span class="toolbar-label">Focus View:</span>
                <button class="btn btn-xs btn-outline ${this.activeViewPreset === 'borneo' ? 'active-preset' : ''}" id="preset-borneo">🏝️ Borneo Island</button>
                <button class="btn btn-xs btn-outline ${this.activeViewPreset === 'indonesia' ? 'active-preset' : ''}" id="preset-indonesia">🇮🇩 Indonesia Archipelago</button>
                <button class="btn btn-xs btn-outline ${this.activeViewPreset === 'australia' ? 'active-preset' : ''}" id="preset-australia">🇦🇺 Australia</button>
              </div>

              <div class="map-basemap-group">
                <span class="toolbar-label">Basemap:</span>
                <select id="basemap-select" class="map-select-input">
                  <option value="positron">Clean Educational (CartoDB)</option>
                  <option value="satellite">True Satellite Imagery (Esri)</option>
                  <option value="osm">Standard Topographic (OSM)</option>
                  <option value="dark">Dark Matter Night</option>
                </select>
                <button class="btn btn-xs btn-ghost" id="map-reset-view-btn" title="Reset View">↺ Reset</button>
              </div>
            </div>

            <!-- Leaflet Container -->
            <div class="leaflet-map-container" id="real-leaflet-map" style="width: 100%; height: 520px; border-radius: var(--radius-lg); overflow: hidden; border: 1.5px solid var(--border-color); box-shadow: inset 0 2px 8px rgba(0,0,0,0.05);">
              <!-- Leaflet Map Injected Here -->
            </div>

            <!-- Dynamic Legend Component -->
            <div class="map-legend-card" id="map-legend">
              <!-- Injected via renderLegend() -->
            </div>
          </div>

          <!-- Region Detail Inspector Card -->
          <div class="region-inspector-card" id="map-region-inspector">
            <!-- Injected via updateRegionDetailCard() -->
          </div>
        </div>
      </div>
    `;

    this.bindHeaderControls();
    this.renderLegend();
    this.updateRegionDetailCard();
  }

  initLeafletMap() {
    const mapEl = document.getElementById("real-leaflet-map");
    if (!mapEl || !window.L) {
      console.warn("Leaflet library not found yet, retrying...");
      setTimeout(() => this.initLeafletMap(), 200);
      return;
    }

    // Coordinates for center of Borneo [0.5, 114.5]
    this.map = L.map('real-leaflet-map', {
      center: [0.9619, 114.5548],
      zoom: 6,
      minZoom: 3,
      maxZoom: 14,
      zoomControl: true
    });

    // Define Cartographic Basemap Tile Layers
    this.tileLayers = {
      positron: L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap contributors',
        subdomains: 'abcd',
        maxZoom: 19
      }),
      satellite: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{z}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
      }),
      osm: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }),
      dark: L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; CARTO &copy; OpenStreetMap contributors',
        subdomains: 'abcd',
        maxZoom: 19
      })
    };

    // Add default basemap
    this.tileLayers.positron.addTo(this.map);

    // Render the authentic GeoJSON data layer
    this.renderGeoJsonLayer();
  }

  setBasemap(basemapKey) {
    if (!this.map || !this.tileLayers[basemapKey]) return;
    Object.values(this.tileLayers).forEach(layer => {
      if (this.map.hasLayer(layer)) {
        this.map.removeLayer(layer);
      }
    });
    this.tileLayers[basemapKey].addTo(this.map);
    this.currentBasemap = basemapKey;
  }

  setLayer(layerKey) {
    if (this.data.layers[layerKey]) {
      this.currentLayer = layerKey;
      this.activeBinFilter = null;
      const subtitle = this.container.querySelector(".map-subtitle");
      const layer = this.data.layers[layerKey];
      if (subtitle) {
        subtitle.innerHTML = `${layer.name} (${layer.unit}) — <em>${layer.description}</em>`;
      }
      this.renderLegend();
      this.renderGeoJsonLayer();
      this.updateRegionDetailCard();
    }
  }

  setViewPreset(preset) {
    this.activeViewPreset = preset;
    document.querySelectorAll(".map-preset-group button").forEach(btn => btn.classList.remove("active-preset"));
    const activeBtn = document.getElementById(`preset-${preset}`);
    if (activeBtn) activeBtn.classList.add("active-preset");

    if (preset === "borneo") {
      this.map.flyTo([0.9619, 114.5548], 6, { duration: 1 });
      this.renderGeoJsonLayer("borneo");
    } else if (preset === "indonesia") {
      this.map.flyTo([-0.7893, 117.9213], 5, { duration: 1 });
      this.renderGeoJsonLayer("indonesia");
    } else if (preset === "australia") {
      this.map.flyTo([-25.2744, 133.7751], 4, { duration: 1 });
      this.renderGeoJsonLayer("australia");
    }
  }

  getFeatureColor(feature) {
    const p = feature.properties || {};
    const layer = this.data.layers[this.currentLayer];
    let val = 0;
    if (this.currentLayer === "density") val = p.density !== undefined ? p.density : 30;
    else if (this.currentLayer === "dayak") val = p.dayakPct !== undefined ? p.dayakPct : 0;
    else if (this.currentLayer === "forest") val = p.forestPct !== undefined ? p.forestPct : 40;

    for (const bin of layer.bins) {
      if (val >= bin.min && val <= bin.max) {
        return bin.color;
      }
    }
    return "#CBD5E1";
  }

  renderGeoJsonLayer(dataset = "borneo") {
    if (!this.map) return;
    if (this.geoJsonLayer) {
      this.map.removeLayer(this.geoJsonLayer);
    }

    let geoData = window.BORNEO_GEOJSON;
    if (dataset === "indonesia" && window.INDONESIA_ALL_GEOJSON) {
      geoData = window.INDONESIA_ALL_GEOJSON;
    } else if (dataset === "australia" && window.AUSTRALIA_GEOJSON) {
      geoData = window.AUSTRALIA_GEOJSON;
    }

    if (!geoData) return;

    this.geoJsonLayer = L.geoJSON(geoData, {
      style: (feature) => {
        const color = this.getFeatureColor(feature);
        const p = feature.properties || {};
        let fillOpacity = 0.75;

        if (this.activeBinFilter) {
          let val = this.currentLayer === "density" ? p.density :
                    this.currentLayer === "dayak" ? p.dayakPct : p.forestPct;
          const inBin = val !== undefined && val >= this.activeBinFilter.min && val <= this.activeBinFilter.max;
          fillOpacity = inBin ? 0.85 : 0.15;
        }

        const isSelected = this.selectedRegion && this.selectedRegion.id === p.id;
        return {
          fillColor: color,
          weight: isSelected ? 3.5 : 1.8,
          opacity: 1,
          color: isSelected ? '#F59E0B' : '#0F172A',
          fillOpacity: fillOpacity
        };
      },
      onEachFeature: (feature, layer) => {
        const p = feature.properties || {};
        const name = p.name || p.Propinsi || p.STATE_NAME || 'Region';
        const density = p.density !== undefined ? `${p.density} people/km²` : 'N/A';
        const dayak = p.dayakPct !== undefined ? `${p.dayakPct}%` : 'N/A';
        const forest = p.forestPct !== undefined ? `${p.forestPct}%` : 'N/A';

        // Rich Tooltip
        layer.bindTooltip(`
          <div class="leaflet-geo-tooltip">
            <strong>${name}</strong><br>
            <span>Density: <b>${density}</b></span> | <span>Dayak: <b>${dayak}</b></span><br>
            <span>Rainforest: <b>${forest}</b></span>
          </div>
        `, { sticky: true, className: 'geo-custom-tooltip' });

        layer.on({
          mouseover: (e) => {
            const l = e.target;
            l.setStyle({
              weight: 3.5,
              color: '#F59E0B',
              fillOpacity: 0.9
            });
            l.bringToFront();
          },
          mouseout: (e) => {
            this.geoJsonLayer.resetStyle(e.target);
            if (this.selectedRegion && this.selectedRegion.id === p.id) {
              e.target.setStyle({
                weight: 3.5,
                color: '#F59E0B'
              });
            }
          },
          click: (e) => {
            this.selectRegion(p);
            this.map.fitBounds(e.target.getBounds(), { maxZoom: 8, padding: [20, 20] });
          }
        });
      }
    }).addTo(this.map);
  }

  highlightRegion(regionId) {
    if (!this.geoJsonLayer) return;
    this.geoJsonLayer.eachLayer(layer => {
      const p = layer.feature.properties || {};
      if (p.id === regionId) {
        this.selectRegion(p);
        this.map.fitBounds(layer.getBounds(), { maxZoom: 8, padding: [30, 30] });
        layer.setStyle({
          weight: 4,
          color: '#F59E0B',
          fillOpacity: 0.9
        });
        layer.bringToFront();
      }
    });
  }

  selectRegion(regionProps) {
    this.selectedRegion = regionProps;
    this.updateRegionDetailCard();
  }

  filterByBin(bin) {
    if (this.activeBinFilter === bin) {
      this.activeBinFilter = null;
    } else {
      this.activeBinFilter = bin;
    }
    this.renderGeoJsonLayer(this.activeViewPreset);
    this.renderLegend();
  }

  renderLegend() {
    const legendBox = document.getElementById("map-legend");
    if (!legendBox) return;
    const layer = this.data.layers[this.currentLayer];

    let itemsHtml = layer.bins.map((bin, idx) => {
      const isFiltered = this.activeBinFilter === bin;
      return `
        <div class="legend-item ${isFiltered ? 'active-filter' : ''}" data-bin-idx="${idx}">
          <span class="legend-swatch" style="background-color: ${bin.color}; border: 1.5px solid ${isFiltered ? '#F59E0B' : '#0F172A'};"></span>
          <span class="legend-label">${bin.label}</span>
          ${isFiltered ? '<span class="filter-tag">Filtered</span>' : ''}
        </div>
      `;
    }).join("");

    legendBox.innerHTML = `
      <div class="legend-header">
        <span class="legend-title"><strong>MAP KEY / LEGEND:</strong> ${layer.name} (${layer.unit})</span>
        <small class="legend-help">Click any category below to isolate regions on the real map</small>
      </div>
      <div class="legend-items-row">
        ${itemsHtml}
      </div>
    `;

    legendBox.querySelectorAll(".legend-item").forEach(el => {
      el.addEventListener("click", () => {
        const idx = parseInt(el.getAttribute("data-bin-idx"), 10);
        this.filterByBin(layer.bins[idx]);
      });
    });
  }

  updateRegionDetailCard() {
    const card = document.getElementById("map-region-inspector");
    if (!card) return;

    if (!this.selectedRegion || !this.selectedRegion.population) {
      card.innerHTML = `
        <div class="inspector-empty glass">
          <div class="empty-icon">🗺️</div>
          <h4>Inspect Real Geographic Features</h4>
          <p>Click on any province or state on the map to inspect its authentic geographic boundaries, population metrics, Dayak cultural proportion, and forest coverage.</p>
          <div class="quick-facts-box">
            <h5>Cartographic Fact:</h5>
            <p>Borneo contains the world's oldest tropical rainforest (over 140 million years old), with 15,000 plant species, 3,000 tree species, and 221 terrestrial mammals.</p>
          </div>
        </div>
      `;
      return;
    }

    const r = this.selectedRegion;
    const color = this.getFeatureColor({ properties: r });
    const layer = this.data.layers[this.currentLayer];

    card.innerHTML = `
      <div class="inspector-active card glass slide-in">
        <div class="inspector-header" style="border-left: 6px solid ${color};">
          <div class="inspector-badge">${r.nation || 'Region'}</div>
          <h4 class="inspector-title">${r.name || r.shortName}</h4>
          <span class="inspector-cap">Capital / Hub: <strong>${r.capital || 'N/A'}</strong></span>
        </div>

        <div class="metrics-grid">
          <div class="metric-card">
            <span class="metric-label">Total Population</span>
            <span class="metric-val">${(r.population || 0).toLocaleString()}</span>
          </div>
          <div class="metric-card">
            <span class="metric-label">Land Area</span>
            <span class="metric-val">${(r.areaKm2 || 0).toLocaleString()} km²</span>
          </div>
          <div class="metric-card highlight-metric">
            <span class="metric-label">Population Density</span>
            <span class="metric-val">${r.density || 'N/A'} <small>people/km²</small></span>
          </div>
          <div class="metric-card highlight-metric">
            <span class="metric-label">Dayak Population</span>
            <span class="metric-val">${r.dayakPct || '0'}% <small>share</small></span>
          </div>
          <div class="metric-card highlight-metric">
            <span class="metric-label">Rainforest Canopy</span>
            <span class="metric-val">${r.forestPct || '0'}% <small>covered</small></span>
          </div>
          <div class="metric-card">
            <span class="metric-label">Active Map Layer</span>
            <span class="metric-val" style="color: ${color};">${layer.name}</span>
          </div>
        </div>

        <div class="inspector-features">
          <h5>Key Features & Culture:</h5>
          <p>${r.keyFeatures || 'Authentic geographic province with distinct regional demographics.'}</p>
        </div>

        <div class="inspector-footer">
          <button class="btn btn-sm btn-outline" id="clear-inspect-btn">Reset Selection</button>
        </div>
      </div>
    `;

    const clearBtn = document.getElementById("clear-inspect-btn");
    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        this.selectedRegion = null;
        this.renderGeoJsonLayer(this.activeViewPreset);
        this.updateRegionDetailCard();
      });
    }
  }

  bindHeaderControls() {
    const tabs = this.container.querySelectorAll(".layer-tab-btn");
    tabs.forEach(tab => {
      tab.addEventListener("click", () => {
        tabs.forEach(t => t.classList.remove("active"));
        tab.classList.add("active");
        this.setLayer(tab.getAttribute("data-layer"));
      });
    });

    const basemapSelect = document.getElementById("basemap-select");
    if (basemapSelect) {
      basemapSelect.addEventListener("change", (e) => {
        this.setBasemap(e.target.value);
      });
    }

    const presetBorneo = document.getElementById("preset-borneo");
    const presetIndo = document.getElementById("preset-indonesia");
    const presetAus = document.getElementById("preset-australia");
    const resetViewBtn = document.getElementById("map-reset-view-btn");

    if (presetBorneo) presetBorneo.addEventListener("click", () => this.setViewPreset("borneo"));
    if (presetIndo) presetIndo.addEventListener("click", () => this.setViewPreset("indonesia"));
    if (presetAus) presetAus.addEventListener("click", () => this.setViewPreset("australia"));
    if (resetViewBtn) resetViewBtn.addEventListener("click", () => {
      this.activeBinFilter = null;
      this.selectedRegion = null;
      this.setViewPreset("borneo");
      this.renderLegend();
      this.updateRegionDetailCard();
    });
  }
}

window.MapViewer = MapViewer;
