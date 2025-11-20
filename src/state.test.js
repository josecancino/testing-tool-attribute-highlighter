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
});

describe('state singleton', () => {
  test('should be an instance of ExtensionState', () => {
    expect(state).toBeInstanceOf(ExtensionState);
  });
});

