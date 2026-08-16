/**
 * Interactive Data Chart Visualisations for Comparative Geography and Demographics
 */
class ChartViewer {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.data = window.MAP_DATA;
    this.activeChart = "islands"; // "islands" | "states" | "forestTimeline" | "densityBenchmark"
    this.init();
  }

  init() {
    if (!this.container) return;
    this.render();
  }

  setChart(chartType) {
    this.activeChart = chartType;
    this.render();
  }

  render() {
    this.container.innerHTML = `
      <div class="chart-wrapper card glass">
        <div class="chart-header">
          <div class="chart-title-area">
            <h3 class="chart-title"><span class="icon-chart">📈</span> Comparative Data Explorer</h3>
            <p class="chart-subtitle">Explore demographic and spatial patterns between Indonesia and Australia.</p>
          </div>
          <div class="chart-nav-tabs" role="tablist">
            <button class="chart-tab-btn ${this.activeChart === 'islands' ? 'active' : ''}" data-chart="islands">
              🏝️ Indonesian Islands
            </button>
            <button class="chart-tab-btn ${this.activeChart === 'states' ? 'active' : ''}" data-chart="states">
              🦘 Australian States
            </button>
            <button class="chart-tab-btn ${this.activeChart === 'forestTimeline' ? 'active' : ''}" data-chart="forestTimeline">
              🌳 Borneo Forest Timeline
            </button>
            <button class="chart-tab-btn ${this.activeChart === 'densityBenchmark' ? 'active' : ''}" data-chart="densityBenchmark">
              📏 Density Benchmarks
            </button>
          </div>
        </div>

        <div class="chart-body" id="chart-display-stage">
          ${this.renderActiveChartContent()}
        </div>
      </div>
    `;

    this.bindEvents();
  }

  renderActiveChartContent() {
    if (this.activeChart === "islands") {
      return this.renderIslandsChart();
    } else if (this.activeChart === "states") {
      return this.renderStatesChart();
    } else if (this.activeChart === "forestTimeline") {
      return this.renderForestTimelineChart();
    } else if (this.activeChart === "densityBenchmark") {
      return this.renderDensityBenchmarkChart();
    }
    return "";
  }

  renderIslandsChart() {
    const islands = this.data.indonesiaIslands;
    const maxPop = Math.max(...islands.map(i => i.population)); // 156M

    const barsHtml = islands.map(island => {
      const pct = (island.population / maxPop) * 100;
      return `
        <div class="bar-row">
          <div class="bar-label-group">
            <span class="bar-name"><strong>${island.name}</strong></span>
            <span class="bar-sub">${(island.population / 1000000).toFixed(1)} Million people</span>
          </div>
          <div class="bar-track">
            <div class="bar-fill" style="width: ${pct}%; background: linear-gradient(90deg, #38BDF8, #0284C7);" data-val="${island.population.toLocaleString()}">
              <span class="bar-fill-text">${island.population >= 10000000 ? (island.population / 1000000).toFixed(1) + 'M' : ''}</span>
            </div>
          </div>
          <div class="bar-meta">
            <span class="meta-tag">Density: <strong>${island.density}/km²</strong></span>
            <span class="meta-tag">Area: <strong>${island.areaKm2.toLocaleString()} km²</strong></span>
          </div>
        </div>
      `;
    }).join("");

    return `
      <div class="chart-stage-container">
        <div class="chart-instructions">
          <h4>Population Distribution by Major Indonesian Island Regions</h4>
          <p>Over 55% of Indonesia's total population (278M) is concentrated on the single island of <strong>Java</strong>.</p>
        </div>
        <div class="bar-chart-grid">
          ${barsHtml}
        </div>
      </div>
    `;
  }

  renderStatesChart() {
    const states = this.data.australianStates;
    const maxPop = Math.max(...states.map(s => s.population)); // 8.4M

    const barsHtml = states.map(state => {
      const pct = (state.population / maxPop) * 100;
      return `
        <div class="bar-row">
          <div class="bar-label-group">
            <span class="bar-name"><strong>${state.name}</strong></span>
            <span class="bar-sub">${(state.population / 1000000).toFixed(2)} Million people</span>
          </div>
          <div class="bar-track">
            <div class="bar-fill" style="width: ${pct}%; background: linear-gradient(90deg, #F59E0B, #D97706);" data-val="${state.population.toLocaleString()}">
              <span class="bar-fill-text">${state.population >= 1000000 ? (state.population / 1000000).toFixed(1) + 'M' : ''}</span>
            </div>
          </div>
          <div class="bar-meta">
            <span class="meta-tag">Density: <strong>${state.density} /km²</strong></span>
            <span class="meta-tag">Area: <strong>${state.areaKm2.toLocaleString()} km²</strong></span>
          </div>
        </div>
      `;
    }).join("");

    return `
      <div class="chart-stage-container">
        <div class="chart-instructions">
          <h4>Population Distribution by Australian States and Territories</h4>
          <p>Australia has 26.4 million people spread across 7.7 million km² (national density: ~3.4 people/km²).</p>
        </div>
        <div class="bar-chart-grid">
          ${barsHtml}
        </div>
      </div>
    `;
  }

  renderForestTimelineChart() {
    const timeline = this.data.forestTimeline;

    const timelineCards = timeline.map(item => {
      return `
        <div class="timeline-step card">
          <div class="timeline-year-badge">${item.year}</div>
          <div class="timeline-stacked-bar">
            <div class="bar-segment forest" style="width: ${item.forestPct}%;" title="Intact Forest: ${item.forestPct}%">
              ${item.forestPct}% Forest
            </div>
            <div class="bar-segment cleared" style="width: ${item.clearedPct}%;" title="Cleared / Agriculture: ${item.clearedPct}%">
              ${item.clearedPct}% Cleared
            </div>
          </div>
          <p class="timeline-desc">${item.label}</p>
        </div>
      `;
    }).join("");

    return `
      <div class="chart-stage-container">
        <div class="chart-instructions">
          <h4>Borneo Rainforest Canopy vs Cleared Land (1970–2025)</h4>
          <p>Visualising 50 years of rainforest changes and recent conservation stabilization.</p>
        </div>
        <div class="timeline-grid">
          ${timelineCards}
        </div>
        <div class="timeline-legend">
          <span class="legend-chip"><span class="chip-color" style="background:#15803D;"></span> Intact Rainforest Canopy</span>
          <span class="legend-chip"><span class="chip-color" style="background:#EF4444;"></span> Cleared / Cultivated / Urban</span>
        </div>
      </div>
    `;
  }

  renderDensityBenchmarkChart() {
    const comparisons = [
      { name: "Java (Indonesia)", density: 1216, color: "#0C4A6E", note: "One of the most densely populated islands in the world." },
      { name: "Indonesia (National Average)", density: 146, color: "#0284C7", note: "278 million people across 1.9 million km²." },
      { name: "South Kalimantan (Borneo)", density: 108.4, color: "#38BDF8", note: "Highest density province in Borneo." },
      { name: "Kalimantan / Borneo (Island Average)", density: 31, color: "#7DD3FC", note: "Low density due to massive rainforest expanses." },
      { name: "Victoria (Australia)", density: 29.9, color: "#F59E0B", note: "Most densely populated Australian state." },
      { name: "New South Wales (Australia)", density: 10.5, color: "#FBBF24", note: "Concentrated heavily in Sydney region." },
      { name: "Australia (National Average)", density: 3.4, color: "#FEF3C7", note: "26.4 million people across 7.7 million km²." },
      { name: "Western Australia", density: 1.1, color: "#E0F2FE", note: "Huge desert interior and vast landmass." }
    ];

    const rows = comparisons.map(item => {
      const barWidth = Math.max(2, Math.min(100, (Math.log10(item.density + 1) / Math.log10(1300)) * 100));
      return `
        <div class="benchmark-row">
          <div class="benchmark-name">
            <strong>${item.name}</strong>
            <small>${item.note}</small>
          </div>
          <div class="benchmark-bar-track">
            <div class="benchmark-fill" style="width: ${barWidth}%; background-color: ${item.color};">
              <span class="benchmark-val-pill">${item.density} people/km²</span>
            </div>
          </div>
        </div>
      `;
    }).join("");

    return `
      <div class="chart-stage-container">
        <div class="chart-instructions">
          <h4>Population Density Benchmarking: Indonesia vs Australia (Log Scale)</h4>
          <p>Comparing people per square kilometre across islands, states, and nations.</p>
        </div>
        <div class="benchmark-grid">
          ${rows}
        </div>
      </div>
    `;
  }

  bindEvents() {
    const tabs = this.container.querySelectorAll(".chart-tab-btn");
    tabs.forEach(tab => {
      tab.addEventListener("click", () => {
        tabs.forEach(t => t.classList.remove("active"));
        tab.classList.add("active");
        this.setChart(tab.getAttribute("data-chart"));
      });
    });
  }
}

window.ChartViewer = ChartViewer;
