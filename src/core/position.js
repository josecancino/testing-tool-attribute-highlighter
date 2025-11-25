// src/core/position.js
import { CONSTANTS } from '../constants.js';

/**
 * Sorts element groups by their rendered position (top, then left).
 * Uses `POSITION_THRESHOLD` to treat rows with small top differences as similar.
 * @param {Array<[string, HTMLElement[]]>} entries - Tuples [value, elementList].
 * @returns {Array<[string, HTMLElement[]]>} Entries sorted by position.
 */
export function sortElementsByPosition(entries) {
  const threshold = CONSTANTS.POSITION_THRESHOLD;

  return Array.from(entries).sort((a, b) => {
    const elA = a[1][0];
    const elB = b[1][0];

    if (!elA || !elB) return 0;

    const rectA = getElementPosition(elA);
    const rectB = getElementPosition(elB);

    const topDiff = rectA.top - rectB.top;
    if (Math.abs(topDiff) > threshold) {
      return topDiff;
    }

    return rectA.left - rectB.left;
  });
}

/**
 * Gets a safe element position, with fallback for test environments without layout.
 * @param {HTMLElement} el - DOM element.
 * @returns {{top:number,left:number}} Approximate coordinates.
 */
function getElementPosition(el) {
  const rect = typeof el.getBoundingClientRect === 'function' ? el.getBoundingClientRect() : { top: 0, left: 0 };
  let top = rect?.top ?? 0;
  let left = rect?.left ?? 0;

  // Fallback for test environments where layout is not computed
  if ((top === 0 && left === 0)) {
    const styleTop = parseInt(el.style.top || '', 10);
    const styleLeft = parseInt(el.style.left || '', 10);
    if (!Number.isNaN(styleTop)) top = styleTop;
    if (!Number.isNaN(styleLeft)) left = styleLeft;
  }

  return { top, left };
}
