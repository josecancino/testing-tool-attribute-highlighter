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
}

// Export singleton instance
export const state = new ExtensionState();

