/**
 * Constants used throughout the extension
 */
export const CONSTANTS = {
  // Colors
  COLORS: {
    PRIMARY: '#2563eb',
    PRIMARY_DARK: '#1d4ed8',
    HIGHLIGHT_SELECTED: '#f59e0b',
    HIGHLIGHT_SELECTED_BG: '#fef3c7',
    HIGHLIGHT_ALL: '#2563eb',
    HIGHLIGHT_ALL_BG: '#dbeafe',
    DANGER: '#dc2626',
    DANGER_DARK: '#b91c1c',
  },

  // Z-index values
  Z_INDEX: {
    PANEL: 10000,
    TOOLTIP: 10001,
  },

  // Panel dimensions
  PANEL: {
    WIDTH: 350,
    COLLAPSED_SIZE: 50,
    COLLAPSED_POSITION: 20,
  },

  // Timing
  TIMING: {
    DEBOUNCE_DELAY: 300,
    OBSERVER_RECONNECT_DELAY: 50,
    SCROLL_DELAY: 100,
  },

  // Text limits
  TEXT: {
    MAX_CONTEXT_LENGTH: 60,
    MAX_URL_LENGTH: 40,
    MAX_POSTER_LENGTH: 30,
  },

  // Position threshold for sorting
  POSITION_THRESHOLD: 5,
};

/**
 * CSS class names used in the extension
 */
export const CLASS_NAMES = {
  PANEL: 'ah-panel',
  PANEL_COLLAPSED: 'ah-panel-collapsed',
  PANEL_EXPANDED: 'ah-panel-expanded',
  ITEM_SELECTED: 'ah-item-selected',
  HIGHLIGHT_ACTIVE: 'active',
};

/**
 * Element IDs used in the extension
 */
export const ELEMENT_IDS = {
  PANEL: 'ah-panel',
  PANEL_TITLE: 'ah-panel-title',
  PANEL_TOGGLE: 'ah-panel-toggle',
  SEARCH_INPUT: 'ah-search-input',
  HIGHLIGHT_ALL_BTN: 'ah-highlight-all-btn',
  ATTRIBUTE_LIST: 'ah-attribute-list',
};
