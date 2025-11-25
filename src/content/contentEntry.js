// src/content/contentEntry.js

import { Panel } from "../ui/panel.js";
import { ExtensionState } from "../state/state.js";
import { sortElementsByPosition } from "../core/position.js";
import { getElementContextInfo } from "../core/elementContextInfo.js";
import { hasPanelChanges } from "../core/panelChanges.js";

console.log("🔵 Attribute Highlighter (content script) initialized");

// --- Estado ---
const state = new ExtensionState();

// --- Panel ---
const panel = new Panel(
  handleSelectAttribute,
  handleHighlightAll,
  handleSearch
);

// Monto el panel
panel.mount();

// --- Observador de Mutaciones ---
const observer = new MutationObserver((mutations) => {
  if (!state.enabled) return;
  if (hasPanelChanges(mutations, panel.panel)) return;

  scanDOM();
});

// Iniciar observer
observer.observe(document.body, {
  childList: true,
  subtree: true,
  attributes: true,
});

// =========
//  Startup
// =========

chrome.storage.sync.get(["enabled", "attribute"], (res) => {
  state.enabled = res.enabled || false;
  state.currentAttribute = res.attribute || null;

  if (state.enabled) {
    scanDOM();
  }
});

// Cuando popup cambia algo
chrome.storage.onChanged.addListener((changes) => {
  if (changes.enabled) {
    state.enabled = changes.enabled.newValue;
    state.cleanupHighlights();
    if (state.enabled) scanDOM();
  }

  if (changes.attribute) {
    state.currentAttribute = changes.attribute.newValue;
    scanDOM();
  }
});

// ==============================
//         DOM Scanning
// ==============================

function scanDOM() {
  state.clearAllElements();

  if (!state.enabled || !state.currentAttribute) return;

  const attrName = state.currentAttribute.startsWith('data-')
    ? state.currentAttribute
    : `data-${state.currentAttribute}`;
  const selector = `[${attrName}]`;
  const elements = Array.from(document.querySelectorAll(selector));

  const groups = new Map();

  for (const el of elements) {
    const value = el.getAttribute(attrName) || "(empty)";

    if (!groups.has(value)) groups.set(value, []);
    groups.get(value).push(el);
  }

  const sortable = sortElementsByPosition(Array.from(groups.entries()));

  panel.renderAttributes(sortable);

  state.allGroups = sortable;

  if (state.isAllHighlighted) {
    highlightAllGroups();
  }
}

// ==============================
//        Panel Events
// ==============================

function handleSelectAttribute(value) {
  const group = state.allGroups.find(([v]) => v === value);
  if (!group) return;

  const [, elements] = group;

  state.clearSelectedHighlights();

  state.selectedElements = elements;
  state.saveOriginalStyles(state.selectedOriginalStyles, elements);

  for (const el of elements) {
    el.style.outline = "2px solid var(--seo-color-highlight)";
    el.style.background = "var(--seo-color-highlight-bg)";
    el.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  panel.renderInfo(getElementContextInfo(elements[0]));
}

function handleHighlightAll() {
  if (state.isAllHighlighted) {
    state.clearAllHighlights();
    state.isAllHighlighted = false;
    return;
  }

  highlightAllGroups();
  state.isAllHighlighted = true;
}

function handleSearch(text) {
  if (!text) {
    panel.renderAttributes(state.allGroups);
    return;
  }

  const filtered = state.allGroups.filter(([value]) =>
    value.toLowerCase().includes(text.toLowerCase())
  );

  panel.renderAttributes(filtered);
}

// ==============================
//       Highlights
// ==============================

function highlightAllGroups() {
  state.clearAllHighlights();

  for (const [, elements] of state.allGroups) {
    for (const el of elements) {
      state.saveOriginalStyles(state.allOriginalStyles, [el]);
      el.style.outline = "2px solid var(--seo-color-primary)";
      el.style.background = "var(--seo-color-primary-light-bg)";
    }
  }
}
