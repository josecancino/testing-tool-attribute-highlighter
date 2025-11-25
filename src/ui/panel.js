// src/ui/panel.js

export class Panel {
  constructor(onSelect, onHighlightAll, onSearch) {
    this.onSelect = onSelect;
    this.onHighlightAll = onHighlightAll;
    this.onSearch = onSearch;
    this.panel = null;
    this.attributeList = null;
  }

  mount() {
    if (document.getElementById("seo-extension-panel")) return;

    this.panel = document.createElement("div");
    this.panel.id = "ah-panel";
    this.panel.className = "ah-panel ah-panel-expanded";
    this.panel.innerHTML = this.template();

    document.body.appendChild(this.panel);

    this.attributeList = this.panel.querySelector(
      "#seo-attribute-list"
    );

    this.setupEvents();
  }

  template() {
    return `
      <div class="seo-panel-header">
        <div class="seo-header-left">
          <h3 id="ah-panel-title">Attribute Highlighter</h3>
          <input id="ah-search-input" class="ah-search-input" placeholder="Search attribute value..." />
        </div>
        <button id="ah-highlight-all-btn" class="ah-highlight-all-btn">
          Highlight All
        </button>
        <button id="ah-panel-toggle" class="ah-panel-toggle">⤢</button>
      </div>

      <div class="seo-panel-content">
        <div id="ah-attribute-list" class="ah-attribute-list"></div>
      </div>
    `;
  }

  setupEvents() {
    const toggleBtn = this.panel.querySelector("#ah-panel-toggle");
    const searchInput = this.panel.querySelector("#ah-search-input");
    const highlightAllBtn = this.panel.querySelector("#ah-highlight-all-btn");

    toggleBtn.addEventListener("click", () => this.toggle());
    searchInput.addEventListener("input", (e) => this.onSearch(e.target.value));
    highlightAllBtn.addEventListener("click", () => this.onHighlightAll());
  }

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

  renderInfo(text) {
    const title = this.panel.querySelector("#ah-panel-title");
    title.textContent = text || "Attribute Highlighter";
  }
}
