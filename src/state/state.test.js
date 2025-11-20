import { ExtensionState, state } from './state.js';

describe('ExtensionState', () => {
  let extensionState;

  beforeEach(() => {
    extensionState = new ExtensionState();
  });

  test('should initialize with default values', () => {
    expect(extensionState.currentAttribute).toBeNull();
    expect(extensionState.enabled).toBe(false);
    expect(extensionState.panelVisible).toBe(true);
    expect(extensionState.allElements).toEqual([]);
    expect(extensionState.isAllHighlighted).toBe(false);
  });

  test('should reset all state', () => {
    extensionState.currentAttribute = 'testid';
    extensionState.enabled = true;
    extensionState.allElements = [document.createElement('div')];
    extensionState.isAllHighlighted = true;

    extensionState.reset();

    expect(extensionState.currentAttribute).toBeNull();
    expect(extensionState.enabled).toBe(false);
    expect(extensionState.allElements).toEqual([]);
    expect(extensionState.isAllHighlighted).toBe(false);
  });

  test('should clear selection', () => {
    const element = document.createElement('div');
    extensionState.selectedItem = element;
    extensionState.selectedElements = [element];
    extensionState.selectedOriginalStyles.set(element, { outline: 'none' });

    extensionState.clearSelection();

    expect(extensionState.selectedItem).toBeNull();
    expect(extensionState.selectedElements).toEqual([]);
    expect(extensionState.selectedOriginalStyles.size).toBe(0);
  });

  test('restoreStyles should apply saved styles to valid elements', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);

    // Original styles
    el.style.outline = '4px solid #000';
    el.style.background = '#ffffff';

    // Save originals, then change to highlight styles
    extensionState.saveOriginalStyles(extensionState.selectedOriginalStyles, [el]);
    el.style.outline = '2px solid #f59e0b';
    el.style.background = '#fef3c7';

    // Restore from saved map
    extensionState.restoreStyles(extensionState.selectedOriginalStyles);

    expect(el.style.outline).toBe('4px solid #000');
    expect(getComputedStyle(el).backgroundColor).toBe('rgb(255, 255, 255)');

    document.body.removeChild(el);
  });

  test('restoreStyles should skip invalid entries without throwing', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);

    el.style.outline = '1px solid #222';
    el.style.background = '#eee';

    const map = new Map();
    map.set(null, { outline: '0', background: '' });
    map.set(el, { outline: '1px solid #222', background: '#eee' });

    expect(() => extensionState.restoreStyles(map)).not.toThrow();

    expect(el.style.outline).toBe('1px solid #222');
    expect(getComputedStyle(el).backgroundColor).toBe('rgb(238, 238, 238)');

    document.body.removeChild(el);
  });

  test('cleanupHighlights should reset maps and flags safely', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);

    extensionState.isAllHighlighted = true;
    extensionState.allElements = [el];
    extensionState.selectedElements = [el];
    extensionState.saveOriginalStyles(extensionState.allOriginalStyles, [el]);
    extensionState.saveOriginalStyles(extensionState.selectedOriginalStyles, [el]);

    // Detach element to simulate DOM removals
    document.body.removeChild(el);

    // Should not throw and should clear state
    expect(() => extensionState.cleanupHighlights()).not.toThrow();

    expect(extensionState.allOriginalStyles.size).toBe(0);
    expect(extensionState.selectedOriginalStyles.size).toBe(0);
    expect(extensionState.allElements).toEqual([]);
    expect(extensionState.selectedElements).toEqual([]);
    expect(extensionState.isAllHighlighted).toBe(false);
  });
});

describe('state singleton', () => {
  test('should be an instance of ExtensionState', () => {
    expect(state).toBeInstanceOf(ExtensionState);
  });
});

