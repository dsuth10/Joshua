// Recipe Scaler & Problem Solver — Student-Friendly Application Logic

const RECIPES = {
  anzac: {
    name: "Classic Anzac Biscuits",
    icon: "🍪",
    serves: 12,
    unitName: "biscuits",
    ingredients: [
      { name: "Rolled Oats", qty: 1, unit: "cup", isConvertible: false },
      { name: "Plain Flour", qty: 1, unit: "cup", isConvertible: false },
      { name: "Desiccated Coconut", qty: 1, unit: "cup", isConvertible: false },
      { name: "Brown Sugar", qty: 0.75, unit: "cup", isConvertible: false },
      { name: "Unsalted Butter", qty: 100, unit: "g", isConvertible: true, targetUnit: "kg" },
      { name: "Golden Syrup", qty: 30, unit: "mL", isConvertible: true, targetUnit: "L" },
      { name: "Bicarbonate Soda", qty: 5, unit: "g", isConvertible: false },
      { name: "Boiling Water", qty: 30, unit: "mL", isConvertible: true, targetUnit: "L" }
    ]
  },
  guacamole: {
    name: "Party Guacamole & Chips",
    icon: "🥑",
    serves: 6,
    unitName: "serves",
    ingredients: [
      { name: "Ripe Avocados", qty: 3, unit: "whole", isConvertible: false },
      { name: "Red Onion", qty: 0.5, unit: "whole", isConvertible: false },
      { name: "Fresh Lime Juice", qty: 30, unit: "mL", isConvertible: true, targetUnit: "L" },
      { name: "Cherry Tomatoes", qty: 150, unit: "g", isConvertible: true, targetUnit: "kg" },
      { name: "Fine Sea Salt", qty: 2.5, unit: "g", isConvertible: false }
    ]
  },
  smoothie: {
    name: "Berry Blast Smoothie Bowl",
    icon: "🫐",
    serves: 4,
    unitName: "bowls",
    ingredients: [
      { name: "Frozen Mixed Berries", qty: 300, unit: "g", isConvertible: true, targetUnit: "kg" },
      { name: "Greek Yogurt", qty: 400, unit: "g", isConvertible: true, targetUnit: "kg" },
      { name: "Full Cream Milk", qty: 250, unit: "mL", isConvertible: true, targetUnit: "L" },
      { name: "Honey", qty: 30, unit: "mL", isConvertible: true, targetUnit: "L" }
    ]
  },
  pizza: {
    name: "Mini Rainbow Pizza Bites",
    icon: "🍕",
    serves: 8,
    unitName: "mini pizzas",
    ingredients: [
      { name: "English Muffins (halved)", qty: 4, unit: "whole", isConvertible: false },
      { name: "Rich Tomato Paste", qty: 120, unit: "g", isConvertible: true, targetUnit: "kg" },
      { name: "Shredded Mozzarella", qty: 200, unit: "g", isConvertible: true, targetUnit: "kg" },
      { name: "Diced Capsicum & Corn", qty: 150, unit: "g", isConvertible: true, targetUnit: "kg" }
    ]
  }
};

let state = {
  currentRecipeKey: "anzac",
  targetPeople: 24,
  strategy: "exact", // 'exact' or 'batches'
  step: 1,
  assemblyPeople: 120
};

// Initialize App
document.addEventListener("DOMContentLoaded", () => {
  setupNavigation();
  setupRecipeSelection();
  setupClassSizeControls();
  setupStrategySelection();
  setupMathVerification();
  setupAssemblyExtension();
  setupPrintExport();

  updateRecipeDisplay();
  updateScaleFactor();
  renderScalingTable();
  updateAssemblyWorking();
});

// Stepper Navigation
function setupNavigation() {
  const tabs = document.querySelectorAll(".step-tab");
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const step = parseInt(tab.dataset.step);
      switchStep(step);
    });
  });

  const nextBtns = document.querySelectorAll(".next-phase-btn");
  nextBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const nextStep = parseInt(btn.dataset.next);
      switchStep(nextStep);
    });
  });
}

function switchStep(stepNum) {
  state.step = stepNum;
  document.querySelectorAll(".step-tab").forEach(t => {
    t.classList.toggle("active", parseInt(t.dataset.step) === stepNum);
  });
  document.querySelectorAll(".phase-panel").forEach((p, idx) => {
    p.classList.toggle("active", idx + 1 === stepNum);
  });

  if (stepNum === 3) {
    renderScalingTable();
  } else if (stepNum === 4) {
    updateAssemblyWorking();
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Recipe Selection
function setupRecipeSelection() {
  const cards = document.querySelectorAll(".recipe-card");
  cards.forEach(card => {
    card.addEventListener("click", () => {
      cards.forEach(c => c.classList.remove("selected"));
      card.classList.add("selected");
      state.currentRecipeKey = card.dataset.recipe;
      updateRecipeDisplay();
      updateScaleFactor();
      renderScalingTable();
      updateAssemblyWorking();
    });
  });
}

function updateRecipeDisplay() {
  const recipe = RECIPES[state.currentRecipeKey];
  const display = document.getElementById("recipeDetailsDisplay");
  
  let ingListHtml = recipe.ingredients.map(ing => `
    <li><strong>${ing.qty} ${ing.unit}</strong> — ${ing.name}</li>
  `).join("");

  display.innerHTML = `
    <div class="recipe-overview-box">
      <h4>${recipe.icon} ${recipe.name}</h4>
      <p class="recipe-serves">Original Recipe Makes: <strong>${recipe.serves} ${recipe.unitName}</strong></p>
      <h5 class="mt-3">Ingredients Needed for 1 Recipe:</h5>
      <ul class="ingredient-list">${ingListHtml}</ul>
    </div>
  `;
}

// Class Size & Multiplier
function setupClassSizeControls() {
  const input = document.getElementById("classSizeInput");
  input.addEventListener("input", (e) => {
    let val = parseInt(e.target.value) || 1;
    state.targetPeople = val;
    updateScaleFactor();
    updatePillsActive(val);
  });

  const pills = document.querySelectorAll(".pill-btn");
  pills.forEach(pill => {
    pill.addEventListener("click", () => {
      const val = parseInt(pill.dataset.val);
      input.value = val;
      state.targetPeople = val;
      updateScaleFactor();
      updatePillsActive(val);
    });
  });
}

function updatePillsActive(val) {
  document.querySelectorAll(".pill-btn").forEach(p => {
    p.classList.toggle("active", parseInt(p.dataset.val) === val);
  });
}

function getScaleFactor() {
  const recipe = RECIPES[state.currentRecipeKey];
  const base = recipe.serves;
  const target = state.targetPeople;

  if (state.strategy === "batches") {
    const batches = Math.ceil(target / base);
    return {
      k: batches,
      rawK: target / base,
      batches: batches,
      isBatch: true,
      text: `${batches} Full Batches (${batches * base} ${recipe.unitName})`
    };
  } else {
    const k = target / base;
    let formattedK = k % 1 === 0 ? `${k}×` : `${k.toFixed(1)}×`;
    return {
      k: k,
      rawK: k,
      isBatch: false,
      text: `${formattedK} (${target} ÷ ${base})`
    };
  }
}

function updateScaleFactor() {
  const recipe = RECIPES[state.currentRecipeKey];
  const sfInfo = getScaleFactor();
  const display = document.getElementById("scaleFactorResult");

  display.innerHTML = `
    <div class="sf-number">${sfInfo.text}</div>
    <div class="sf-details mt-2">
      People Needed: <strong>${state.targetPeople}</strong> ÷ Recipe Makes: <strong>${recipe.serves} ${recipe.unitName}</strong>
    </div>
  `;

  document.getElementById("currentScaleSummary").innerText = `Multiplier: ${sfInfo.text}`;
}

// Strategy Selection
function setupStrategySelection() {
  const radios = document.querySelectorAll('input[name="strategy"]');
  radios.forEach(radio => {
    radio.addEventListener("change", (e) => {
      state.strategy = e.target.value;
      document.querySelectorAll(".strategy-card").forEach(c => c.classList.remove("selected"));
      e.target.closest(".strategy-card").classList.add("selected");
      updateScaleFactor();
      renderScalingTable();
    });
  });
}

// Render Scaling Table (Phase 3)
function renderScalingTable() {
  const recipe = RECIPES[state.currentRecipeKey];
  const sfInfo = getScaleFactor();
  const k = sfInfo.k;
  const tbody = document.getElementById("scalingTableBody");

  tbody.innerHTML = recipe.ingredients.map((ing, idx) => {
    const origText = `${ing.qty} ${ing.unit}`;
    const calculatedQty = ing.qty * k;
    
    // Check metric conversion recommendation
    let conversionText = "—";
    if (ing.isConvertible) {
      if (ing.unit === "g" && calculatedQty >= 1000) {
        const kgVal = (calculatedQty / 1000).toFixed(2).replace(/\.00$/, "");
        conversionText = `<strong>${calculatedQty}g = ${kgVal}kg</strong>`;
      } else if (ing.unit === "mL" && calculatedQty >= 1000) {
        const lVal = (calculatedQty / 1000).toFixed(2).replace(/\.00$/, "");
        conversionText = `<strong>${calculatedQty}mL = ${lVal}L</strong>`;
      }
    }

    let multiplierStr = k % 1 === 0 ? `${k}` : `${k.toFixed(1)}`;

    return `
      <tr data-idx="${idx}">
        <td><strong>${ing.name}</strong></td>
        <td>${origText}</td>
        <td>
          <input type="text" class="ns-input" placeholder="e.g. ${ing.qty} × ${multiplierStr}" value="${ing.qty} × ${multiplierStr}">
        </td>
        <td>
          <input type="number" class="qty-input" step="any" placeholder="Amount" data-target="${calculatedQty.toFixed(2)}">
          <span class="unit-tag">${ing.unit}</span>
        </td>
        <td class="conversion-cell">${conversionText}</td>
        <td>
          <span class="status-badge pending" id="status-${idx}">Pending</span>
        </td>
      </tr>
    `;
  }).join("");
}

// Math Verification
function setupMathVerification() {
  document.getElementById("checkMathBtn").addEventListener("click", verifyTableMath);
}

function verifyTableMath() {
  const recipe = RECIPES[state.currentRecipeKey];
  const sfInfo = getScaleFactor();
  const k = sfInfo.k;

  recipe.ingredients.forEach((ing, idx) => {
    const row = document.querySelector(`tr[data-idx="${idx}"]`);
    const qtyInput = row.querySelector(".qty-input");
    const statusBadge = document.getElementById(`status-${idx}`);
    
    const userVal = parseFloat(qtyInput.value);
    const expectedVal = ing.qty * k;

    if (!isNaN(userVal) && Math.abs(userVal - expectedVal) < 0.1) {
      statusBadge.className = "status-badge correct";
      statusBadge.innerText = "✓ Correct!";
    } else {
      statusBadge.className = "status-badge incorrect";
      statusBadge.innerText = "✗ Incorrect";
    }
  });
}

// Extension: Assembly Scaling (120 People)
function setupAssemblyExtension() {
  const input = document.getElementById("assemblyPeopleInput");
  input.addEventListener("input", (e) => {
    state.assemblyPeople = parseInt(e.target.value) || 100;
    updateAssemblyWorking();
  });
}

function updateAssemblyWorking() {
  const recipe = RECIPES[state.currentRecipeKey];
  const base = recipe.serves;
  const target = state.assemblyPeople;
  const kAssembly = target / base;

  const box = document.getElementById("assemblyWorkingBox");
  let stepsHtml = recipe.ingredients.map(ing => {
    const totalQty = ing.qty * kAssembly;
    let displayTotal = totalQty % 1 === 0 ? totalQty : totalQty.toFixed(1);
    let convertedStr = `${displayTotal} ${ing.unit}`;
    
    if (ing.unit === "g" && totalQty >= 1000) {
      convertedStr = `${(totalQty / 1000).toFixed(1)}kg (${displayTotal}g)`;
    } else if (ing.unit === "mL" && totalQty >= 1000) {
      convertedStr = `${(totalQty / 1000).toFixed(1)}L (${displayTotal}mL)`;
    }

    return `
      <div class="assembly-step">
        <span><strong>${ing.name}</strong> (${ing.qty} ${ing.unit} × ${kAssembly.toFixed(1)})</span>
        <span>👉 <strong>${convertedStr}</strong></span>
      </div>
    `;
  }).join("");

  box.innerHTML = `
    <div style="margin-bottom: 0.5rem; font-weight: 700; color: var(--primary);">
      Assembly Multiplier: ${target} people ÷ ${base} serves = ${kAssembly.toFixed(1)}× bigger!
    </div>
    ${stepsHtml}
  `;
}

// Print & Export Report
function setupPrintExport() {
  document.getElementById("printBtn").addEventListener("click", generateAndPrint);
  document.getElementById("finalReportBtn").addEventListener("click", generateAndPrint);
}

function generateAndPrint() {
  // First run verification so badges reflect current input
  verifyTableMath();

  const recipe = RECIPES[state.currentRecipeKey];
  const sfInfo = getScaleFactor();
  const noticeVal = document.getElementById("noticeInput").value || "Looked at recipe serves vs class count.";
  const wonderVal = document.getElementById("wonderInput").value || "Calculated multiplier and shopping units.";
  const solutionVal = document.getElementById("finalSolutionText").value || "Adapted recipe by multiplying ingredients.";
  const efficiencyVal = document.getElementById("efficiencyText").value || "Multiplying made it fast and easy to calculate.";
  const assemblyExpVal = document.getElementById("assemblyExplanation").value || "Multiplied by assembly scale factor.";

  const printContainer = document.getElementById("printableReport");
  
  let tableRowsHtml = recipe.ingredients.map((ing, idx) => {
    const row = document.querySelector(`tr[data-idx="${idx}"]`);
    const studentWorking = row ? row.querySelector(".ns-input").value : `${ing.qty} × ${sfInfo.k.toFixed(1)}`;
    const studentAmount = row ? row.querySelector(".qty-input").value : "";
    const displayQty = studentAmount !== "" ? `${studentAmount} ${ing.unit}` : `_______ ${ing.unit}`;

    const scaledQty = ing.qty * sfInfo.k;
    let metricStr = "—";
    if (ing.unit === "g" && scaledQty >= 1000) {
      metricStr = `${(scaledQty / 1000).toFixed(1)} kg`;
    } else if (ing.unit === "mL" && scaledQty >= 1000) {
      metricStr = `${(scaledQty / 1000).toFixed(1)} L`;
    }
    return `
      <tr>
        <td>${ing.name}</td>
        <td>${ing.qty} ${ing.unit}</td>
        <td>${studentWorking}</td>
        <td><strong>${displayQty}</strong></td>
        <td>${metricStr}</td>
      </tr>
    `;
  }).join("");

  printContainer.innerHTML = `
    <div class="printable-header">
      <h1>Mathematics Student Investigation: Recipe Scaling</h1>
      <p><strong>Student Name:</strong> ___________________________ &nbsp;&nbsp;&nbsp; <strong>Date:</strong> ${new Date().toLocaleDateString('en-AU')}</p>
      <p><strong>Year Level:</strong> Year 5 Maths — Multipliers & Unit Conversions</p>
    </div>

    <div class="printable-section">
      <h2>Phase 1: UNDERSTAND</h2>
      <p><strong>Chosen Recipe:</strong> ${recipe.name} (Makes ${recipe.serves} ${recipe.unitName})</p>
      <p><strong>Class Target:</strong> ${state.targetPeople} students</p>
      <p><strong>What I Noticed:</strong> ${noticeVal}</p>
      <p><strong>What I Wondered:</strong> ${wonderVal}</p>
    </div>

    <div class="printable-section">
      <h2>Phase 2: PLAN</h2>
      <p><strong>Recipe Multiplier:</strong> ${state.targetPeople} ÷ ${recipe.serves} = <strong>${sfInfo.text}</strong></p>
      <p><strong>Strategy Chosen:</strong> ${state.strategy === 'exact' ? 'Exact Multiplier' : 'Full Batches'}</p>
    </div>

    <div class="printable-section">
      <h2>Phase 3: DO (New Recipe Amounts)</h2>
      <table class="printable-table">
        <thead>
          <tr>
            <th>Ingredient</th>
            <th>Original</th>
            <th>Maths Working</th>
            <th>New Amount</th>
            <th>Shopping Unit (kg / L)</th>
          </tr>
        </thead>
        <tbody>
          ${tableRowsHtml}
        </tbody>
      </table>
    </div>

    <div class="printable-section">
      <h2>Phase 4: CONSIDER & SHARE</h2>
      <p><strong>My Solution Summary:</strong> ${solutionVal}</p>
      <p><strong>Efficiency Reflection:</strong> ${efficiencyVal}</p>
      <p><strong>Assembly Extension (${state.assemblyPeople} people):</strong> ${assemblyExpVal}</p>
    </div>
  `;

  window.print();
}
