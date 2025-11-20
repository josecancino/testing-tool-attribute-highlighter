/**
 * Global state management for the extension
 */
export class ExtensionState {
  constructor() {
    this.currentAttribute = null;
    this.enabled = false;
    this.panelVisible = true;
    this.panel = null;
    this.attributeList = null;
    this.allElements = [];
    this.allOriginalStyles = new Map();
    this.isAllHighlighted = false;
    this.selectedItem = null;
    this.selectedElements = [];
    this.selectedOriginalStyles = new Map();
    this.allGroups = [];
    this.allAttributeItems = [];
    this.observer = null;
    this.scanTimeout = null;
    this.isScanning = false;
  }

  /**
   * Reset all state
   */
  reset() {
    this.currentAttribute = null;
    this.enabled = false;
    this.allElements = [];
    this.allOriginalStyles.clear();
    this.isAllHighlighted = false;
    this.selectedItem = null;
    this.selectedElements = [];
    this.selectedOriginalStyles.clear();
    this.allGroups = [];
    this.allAttributeItems = [];
  }

  /**
   * Clear selection state
   */
  clearSelection() {
    this.selectedItem = null;
    this.selectedElements = [];
    this.selectedOriginalStyles.clear();
  }

  saveOriginalStyles(targetMap, elements) {
    if (!elements || !targetMap) return;
    for (const el of elements) {
      if (!targetMap.has(el)) {
        targetMap.set(el, {
          outline: el.style.outline || '',
          background: el.style.background || '',
        });
      }
    }
  }

  clearSelectedHighlights() {
    for (const [el, styles] of this.selectedOriginalStyles) {
      Object.assign(el.style, styles);
    }
    this.selectedOriginalStyles.clear();
    this.selectedElements = [];
    this.selectedItem = null;
  }

  clearAllHighlights() {
    for (const [el, styles] of this.allOriginalStyles) {
      Object.assign(el.style, styles);
    }
    this.allOriginalStyles.clear();
    this.isAllHighlighted = false;
  }

  clearAllElements() {
    this.allElements = [];
    this.allGroups = [];
  }

  cleanupHighlights() {
    for (const [el, styles] of this.allOriginalStyles) {
      Object.assign(el.style, styles);
    }
    for (const [el, styles] of this.selectedOriginalStyles) {
      Object.assign(el.style, styles);
    }
    this.allOriginalStyles.clear();
    this.selectedOriginalStyles.clear();
    this.allElements = [];
    this.selectedElements = [];
    this.isAllHighlighted = false;
  }
}

// Export singleton instance
export const state = new ExtensionState();

