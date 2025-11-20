import { CONSTANTS } from './constants.js';

/**
 * Get contextual information from a DOM element
 * @param {HTMLElement} element - The element to analyze
 * @returns {string} Contextual information about the element
 */
export function getElementContextInfo(element) {
  if (!element) return '';

  const tagName = element.tagName.toLowerCase();
  const info = [];

  // Get text content (truncated)
  const textContent = element.textContent?.trim() || '';
  if (textContent) {
    const maxLength = CONSTANTS.TEXT.MAX_CONTEXT_LENGTH;
    const truncated =
      textContent.length > maxLength
        ? textContent.substring(0, maxLength) + '...'
        : textContent;
    info.push(`"${truncated}"`);
  }

  // Handle different element types
  switch (tagName) {
    case 'img':
      addImageInfo(element, info);
      break;
    case 'video':
      addVideoInfo(element, info);
      break;
    case 'a':
      addLinkInfo(element, info);
      break;
    case 'input':
      addInputInfo(element, info);
      break;
    case 'button':
      addButtonInfo(element, info);
      break;
    default:
      if (info.length === 0) {
        info.push(`<${tagName}>`);
      }
  }

  return info.join(' • ') || '';
}

/**
 * Add image-specific information
 */
function addImageInfo(element, info) {
  const alt = element.getAttribute('alt') || '';
  const src = element.getAttribute('src') || '';
  const imageName = extractFilename(src);

  if (alt) info.push(`Alt: ${alt}`);
  if (imageName && imageName !== src) {
    info.push(`Image: ${imageName}`);
  } else if (src) {
    const maxLength = CONSTANTS.TEXT.MAX_URL_LENGTH;
    info.push(
      `Src: ${src.substring(0, maxLength)}${src.length > maxLength ? '...' : ''}`
    );
  }
}

/**
 * Add video-specific information
 */
function addVideoInfo(element, info) {
  const src = element.getAttribute('src') || '';
  const poster = element.getAttribute('poster') || '';

  if (src) {
    const filename = extractFilename(src);
    const maxLength = CONSTANTS.TEXT.MAX_URL_LENGTH;
    info.push(`Video: ${filename || src.substring(0, maxLength)}`);
  }

  if (poster) {
    const filename = extractFilename(poster);
    const maxLength = CONSTANTS.TEXT.MAX_POSTER_LENGTH;
    info.push(`Poster: ${filename || poster.substring(0, maxLength)}`);
  }
}

/**
 * Add link-specific information
 */
function addLinkInfo(element, info) {
  const href = element.getAttribute('href') || '';
  if (href) {
    const maxLength = CONSTANTS.TEXT.MAX_URL_LENGTH;
    info.push(
      `Link: ${href.substring(0, maxLength)}${href.length > maxLength ? '...' : ''}`
    );
  }
}

/**
 * Add input-specific information
 */
function addInputInfo(element, info) {
  const type = element.getAttribute('type') || 'text';
  const placeholder = element.getAttribute('placeholder') || '';

  info.push(`Type: ${type}`);
  if (placeholder) {
    info.push(`Placeholder: ${placeholder}`);
  }
}

/**
 * Add button-specific information
 */
function addButtonInfo(element, info) {
  const type = element.getAttribute('type') || '';
  if (type) {
    info.push(`Button type: ${type}`);
  }
}

/**
 * Extract filename from a URL
 * @param {string} url - The URL to extract filename from
 * @returns {string} The filename or empty string
 */
function extractFilename(url) {
  if (!url) return '';
  return url.split('/').pop() || url.split('\\').pop() || '';
}

/**
 * Sort elements by their position on the page (top to bottom, left to right)
 * @param {Array} entries - Array of [key, elements] tuples
 * @returns {Array} Sorted entries
 */
export function sortElementsByPosition(entries) {
  return Array.from(entries).sort((a, b) => {
    const elA = a[1][0];
    const elB = b[1][0];

    if (!elA || !elB) return 0;

    //const rectA = elA.getBoundingClientRect();
    //const rectB = elB.getBoundingClientRect();
    

    const rectA = {
      top: parseInt(elA.style.top || '0', 10),
      left: parseInt(elA.style.left || '0', 10),
    };
    
    const rectB = {
      top: parseInt(elB.style.top || '0', 10),
      left: parseInt(elB.style.left || '0', 10),
    };
    
    // Sort by Y position (top), then by X (left) if on the same row
    const topDiff = rectA.top - rectB.top;
    const threshold = CONSTANTS.POSITION_THRESHOLD;

    if (Math.abs(topDiff) > threshold) {
      return topDiff;
    }

    return rectA.left - rectB.left;
  });
}

/**
 * Check if mutations affect the panel
 * @param {MutationRecord[]} mutations - Array of mutation records
 * @param {HTMLElement} panel - The panel element
 * @returns {boolean} True if mutations affect the panel
 */
export function hasPanelChanges(mutations, panel) {
  if (!panel) return false;

  return mutations.some((mutation) => {
    const addedNodes = Array.from(mutation.addedNodes);
    const removedNodes = Array.from(mutation.removedNodes);

    return (
      addedNodes.some(
        (node) =>
          node === panel || (node.nodeType === 1 && panel.contains(node))
      ) ||
      removedNodes.some(
        (node) =>
          node === panel || (node.nodeType === 1 && panel.contains(node))
      )
    );
  });
}

