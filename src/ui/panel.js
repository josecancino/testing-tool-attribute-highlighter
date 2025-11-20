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
    this.panel.id = "seo-extension-panel";
    this.panel.className = "seo-extension-panel seo-panel-expanded";
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
          <h3 id="seo-panel-title">Attribute Highlighter</h3>
          <input id="seo-search-input" class="seo-search-input" placeholder="Search attribute value..." />
        </div>
        <button id="seo-highlight-all-btn" class="seo-highlight-all-btn">
          Highlight All
        </button>
        <button id="seo-panel-toggle" class="seo-panel-toggle">⤢</button>
      </div>

      <div class="seo-panel-content">
        <div id="seo-attribute-list" class="seo-attribute-list"></div>
      </div>
    `;
  }

  setupEvents() {
    const toggleBtn = this.panel.querySelector("#seo-panel-toggle");
    const searchInput = this.panel.querySelector("#seo-search-input");
    const highlightAllBtn = this.panel.querySelector("#seo-highlight-all-btn");

    toggleBtn.addEventListener("click", () => this.toggle());
    searchInput.addEventListener("input", (e) => this.onSearch(e.target.value));
    highlightAllBtn.addEventListener("click", () => this.onHighlightAll());
  }

  toggle() {
    const collapsed = this.panel.classList.contains("seo-panel-collapsed");

    if (collapsed) {
      this.panel.classList.remove("seo-panel-collapsed");
      this.panel.classList.add("seo-panel-expanded");
    } else {
      this.panel.classList.remove("seo-panel-expanded");
      this.panel.classList.add("seo-panel-collapsed");
    }
  }

  renderAttributes(entries) {
    this.attributeList.innerHTML = "";

    for (const [value, elList] of entries) {
      const div = document.createElement("div");
      div.className = "seo-attribute-item";
      div.textContent = `${value} (${elList.length})`;
      div.addEventListener("click", () => this.onSelect(value));
      this.attributeList.appendChild(div);
    }
  }

  renderInfo(text) {
    const title = this.panel.querySelector("#seo-panel-title");
    title.textContent = text || "Attribute Highlighter";
  }
}
