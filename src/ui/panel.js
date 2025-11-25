// src/ui/panel.js
/**
 * Side Panel UI for Attribute Highlighter.
 * Encapsulates DOM structure and events for the floating panel used to list and interact
 * with attribute groups found in the page. Designed to be framework‑free and easily testable.
 *
 * Callbacks are injected to avoid coupling with content logic:
 *  - onSelect(value): select a group by its attribute value
 *  - onHighlightAll(): toggle highlight on all matched elements
 *  - onSearch(text): filter groups by text
 *
 * @class Panel
 */
export class Panel {
  /**
   * @param {(value: string) => void} onSelect - Callback for group selection.
   * @param {() => void} onHighlightAll - Callback to toggle highlight on all.
   * @param {(text: string) => void} onSearch - Callback for search filtering.
   */
  constructor(onSelect, onHighlightAll, onSearch) {
    this.onSelect = onSelect;
    this.onHighlightAll = onHighlightAll;
    this.onSearch = onSearch;
    this.panel = null;
    this.attributeList = null;
  }

  /**
   * Mounts the panel into the document if not already present.
   * Creates the root element, injects HTML, appends to `document.body`, and wires events.
   */
  mount() {
    if (document.getElementById("ah-panel")) return;

    this.panel = document.createElement("div");
    this.panel.id = "ah-panel";
    this.panel.className = "ah-panel ah-panel-expanded";
    this.panel.innerHTML = this.template();

    document.body.appendChild(this.panel);

    this.attributeList = this.panel.querySelector(
      "#ah-attribute-list"
    );

    this.setupEvents();
  }

  /**
   * Returns HTML template for the panel.
   * @returns {string}
   */
  template() {
    return `
      <div class="ah-panel-header">
        <div class="ah-header-left">
          <h3 id="ah-panel-title">Attribute Highlighter</h3>
          <input id="ah-search-input" class="ah-search-input" placeholder="Search attribute value..." />
        </div>
        <button id="ah-highlight-all-btn" class="ah-highlight-all-btn">
          Highlight All
        </button>
        <button id="ah-panel-toggle" class="ah-panel-toggle">⤢</button>
      </div>

      <div class="ah-panel-content">
        <div id="ah-attribute-list" class="ah-attribute-list"></div>
      </div>
    `;
  }

  /**
   * Wires panel events: toggle collapse/expand, search input, and highlight‑all.
   */
  setupEvents() {
    const toggleBtn = this.panel.querySelector("#ah-panel-toggle");
    const searchInput = this.panel.querySelector("#ah-search-input");
    const highlightAllBtn = this.panel.querySelector("#ah-highlight-all-btn");

    toggleBtn.addEventListener("click", () => this.toggle());
    searchInput.addEventListener("input", (e) => this.onSearch(e.target.value));
    highlightAllBtn.addEventListener("click", () => this.onHighlightAll());
  }

  /**
   * Toggles the panel collapsed/expanded state by swapping CSS classes.
   */
  toggle() {
    const collapsed = this.panel.classList.contains("ah-panel-collapsed");

    if (collapsed) {
      this.panel.classList.remove("ah-panel-collapsed");
      this.panel.classList.add("ah-panel-expanded");
    } else {
      this.panel.classList.remove("ah-panel-expanded");
      this.panel.classList.add("ah-panel-collapsed");
    }
  }

  /**
   * Renders the list of attribute groups.
   * @param {Array<[string, HTMLElement[]]>} entries - Tuples [value, elementList].
   */
  renderAttributes(entries) {
    this.attributeList.innerHTML = "";

    for (const [value, elList] of entries) {
      const div = document.createElement("div");
      div.className = "ah-attribute-item";
      div.textContent = `${value} (${elList.length})`;
      div.addEventListener("click", () => this.onSelect(value));
      this.attributeList.appendChild(div);
    }
  }

  /**
   * Renders contextual info into the panel header title.
   * @param {string} text - Context summary to display.
   */
  renderInfo(text) {
    const title = this.panel.querySelector("#ah-panel-title");
    title.textContent = text || "Attribute Highlighter";
  }
}
