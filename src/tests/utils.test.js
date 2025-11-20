import {
  getElementContextInfo,
  sortElementsByPosition,
  hasPanelChanges,
} from '../utils.js';

describe('getElementContextInfo', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  test('should return empty string for null element', () => {
    expect(getElementContextInfo(null)).toBe('');
  });

  test('should return text content for text elements', () => {
    const element = document.createElement('div');
    element.textContent = 'Hello World';
    container.appendChild(element);

    const result = getElementContextInfo(element);
    expect(result).toContain('"Hello World"');
  });

  test('should truncate long text content', () => {
    const element = document.createElement('div');
    element.textContent = 'a'.repeat(100);
    container.appendChild(element);

    const result = getElementContextInfo(element);
    expect(result).toContain('...');
    expect(result.length).toBeLessThan(100);
  });

  test('should return image info with alt text', () => {
    const element = document.createElement('img');
    element.setAttribute('alt', 'Test image');
    element.setAttribute('src', '/path/to/image.jpg');
    container.appendChild(element);

    const result = getElementContextInfo(element);
    expect(result).toContain('Alt: Test image');
  });

  test('should return image filename', () => {
    const element = document.createElement('img');
    element.setAttribute('src', '/path/to/test-image.jpg');
    container.appendChild(element);

    const result = getElementContextInfo(element);
    expect(result).toContain('Image: test-image.jpg');
  });

  test('should return link href', () => {
    const element = document.createElement('a');
    element.setAttribute('href', '/test-page');
    element.textContent = 'Link text';
    container.appendChild(element);

    const result = getElementContextInfo(element);
    expect(result).toContain('Link: /test-page');
  });

  test('should return input type and placeholder', () => {
    const element = document.createElement('input');
    element.setAttribute('type', 'email');
    element.setAttribute('placeholder', 'Enter email');
    container.appendChild(element);

    const result = getElementContextInfo(element);
    expect(result).toContain('Type: email');
    expect(result).toContain('Placeholder: Enter email');
  });

  test('should return button type', () => {
    const element = document.createElement('button');
    element.setAttribute('type', 'submit');
    element.textContent = 'Submit';
    container.appendChild(element);

    const result = getElementContextInfo(element);
    expect(result).toContain('Button type: submit');
  });

  test('should return tag name if no other info', () => {
    const element = document.createElement('div');
    container.appendChild(element);

    const result = getElementContextInfo(element);
    expect(result).toContain('<div>');
  });
});

describe('sortElementsByPosition', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    container.style.position = 'relative';
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  test('should sort elements by top position', () => {
    const el1 = document.createElement('div');
    el1.style.position = 'absolute';
    el1.style.top = '100px';
    el1.style.left = '0px';

    const el2 = document.createElement('div');
    el2.style.position = 'absolute';
    el2.style.top = '50px';
    el2.style.left = '0px';

    container.appendChild(el1);
    container.appendChild(el2);

    const entries = [
      ['key1', [el1]],
      ['key2', [el2]],
    ];

    const sorted = sortElementsByPosition(entries);
    expect(sorted[0][0]).toBe('key2'); // el2 is higher (top: 50px)
    expect(sorted[1][0]).toBe('key1'); // el1 is lower (top: 100px)
  });

  test('should sort by left position when top is similar', () => {
    const el1 = document.createElement('div');
    el1.style.position = 'absolute';
    el1.style.top = '50px';
    el1.style.left = '100px';

    const el2 = document.createElement('div');
    el2.style.position = 'absolute';
    el2.style.top = '52px'; // Within threshold
    el2.style.left = '50px';

    container.appendChild(el1);
    container.appendChild(el2);

    const entries = [
      ['key1', [el1]],
      ['key2', [el2]],
    ];

    const sorted = sortElementsByPosition(entries);
    expect(sorted[0][0]).toBe('key2'); // el2 is more to the left
    expect(sorted[1][0]).toBe('key1');
  });
});

describe('hasPanelChanges', () => {
  let panel;

  beforeEach(() => {
    panel = document.createElement('div');
    panel.id = 'test-panel';
    document.body.appendChild(panel);
  });

  afterEach(() => {
    if (panel.parentNode) {
      document.body.removeChild(panel);
    }
  });

  test('should return false for empty mutations', () => {
    expect(hasPanelChanges([], panel)).toBe(false);
  });

  test('should return false if mutations do not affect panel', () => {
    const otherElement = document.createElement('div');
    document.body.appendChild(otherElement);

    const mutations = [
      {
        addedNodes: [otherElement],
        removedNodes: [],
      },
    ];

    expect(hasPanelChanges(mutations, panel)).toBe(false);
    document.body.removeChild(otherElement);
  });

  test('should return true if panel is added', () => {
    const mutations = [
      {
        addedNodes: [panel],
        removedNodes: [],
      },
    ];

    expect(hasPanelChanges(mutations, panel)).toBe(true);
  });

  test('should return true if child of panel is added', () => {
    const child = document.createElement('div');
    panel.appendChild(child);

    const mutations = [
      {
        addedNodes: [child],
        removedNodes: [],
      },
    ];

    expect(hasPanelChanges(mutations, panel)).toBe(true);
  });
});

