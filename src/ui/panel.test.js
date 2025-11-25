import { Panel } from './panel.js';

beforeEach(() => {
  const existing = document.getElementById('ah-panel');
  if (existing) existing.remove();
});

test('mount creates panel with accessibility attributes', () => {
  const p = new Panel(() => {}, () => {}, () => {});
  p.mount();
  const root = document.getElementById('ah-panel');
  expect(root).toBeTruthy();
  expect(root.getAttribute('role')).toBe('complementary');
  expect(root.getAttribute('aria-label')).toBe('Attribute Highlighter Panel');
});

test('toggle switches classes and aria-expanded', () => {
  const p = new Panel(() => {}, () => {}, () => {});
  p.mount();
  const toggleBtn = document.getElementById('ah-panel-toggle');
  expect(p.panel).toBeTruthy();
  expect(p.panel.classList.contains('ah-panel-expanded')).toBe(true);
  expect(toggleBtn.getAttribute('aria-expanded')).toBe('true');

  p.toggle();
  expect(p.panel.classList.contains('ah-panel-collapsed')).toBe(true);
  expect(toggleBtn.getAttribute('aria-expanded')).toBe('false');
});

test('renderAttributes creates clickable items', () => {
  const p = new Panel(() => {}, () => {}, () => {});
  p.mount();
  const entries = [
    ['val1', [{ style: {}, getBoundingClientRect: () => ({ top: 0, left: 0 }) }]],
    ['val2', [{ style: {}, getBoundingClientRect: () => ({ top: 10, left: 0 }) }]],
  ];
  p.renderAttributes(entries);
  const items = document.querySelectorAll('.ah-attribute-item');
  expect(items.length).toBe(2);
  expect(items[0].getAttribute('role')).toBe('button');
  expect(items[0].getAttribute('tabindex')).toBe('0');
});
