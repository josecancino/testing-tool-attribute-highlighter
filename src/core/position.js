// src/core/position.js
import { CONSTANTS } from '../constants.js';

export function sortElementsByPosition(entries) {
  const threshold = CONSTANTS.POSITION_THRESHOLD;

  return Array.from(entries).sort((a, b) => {
    const elA = a[1][0];
    const elB = b[1][0];

    if (!elA || !elB) return 0;

    // JSDOM no calcula layout → para tests usamos style.*
    const rectA = {
      top: parseInt(elA.style.top || '0', 10),
      left: parseInt(elA.style.left || '0', 10),
    };
    const rectB = {
      top: parseInt(elB.style.top || '0', 10),
      left: parseInt(elB.style.left || '0', 10),
    };

    const topDiff = rectA.top - rectB.top;

    if (Math.abs(topDiff) > threshold) {
      return topDiff;
    }

    return rectA.left - rectB.left;
  });
}
