import { sortElementsByPosition } from './position.js';

function fakeEl(top, left) {
  return {
    getBoundingClientRect: () => ({ top, left }),
    style: {},
  };
}

test('sortElementsByPosition orders by top then left', () => {
  const a1 = fakeEl(10, 100);
  const b1 = fakeEl(50, 10);
  const c1 = fakeEl(10, 20);

  const entries = [
    ['B', [b1]],
    ['A', [a1]],
    ['C', [c1]],
  ];

  const sorted = sortElementsByPosition(entries).map(([v]) => v);
  expect(sorted).toEqual(['C', 'A', 'B']);
});

test('rows within threshold use left comparison', () => {
  // Same row within threshold (diff 3 < 5)
  const a = fakeEl(10, 50);
  const b = fakeEl(13, 10);

  const entries = [
    ['A', [a]],
    ['B', [b]],
  ];

  const sorted = sortElementsByPosition(entries).map(([v]) => v);
  // B should come before A due to smaller left when top difference is within threshold
  expect(sorted).toEqual(['B', 'A']);
});
