// src/core/elementContextInfo.js
import { CONSTANTS } from '../constants.js';

/**
 * Returns contextual information for a DOM element (text, image, link, inputs, buttons, video).
 * Produces a string with segments separated by ` | `, truncating long values according to defined limits.
 * @param {HTMLElement|null} element - Element to analyze.
 * @returns {string} Contextual summary for the element or empty string.
 */
export function getElementContextInfo(element) {
  if (!element) return '';

  const tagName = element.tagName.toLowerCase();
  const info = [];

  const textContent = element.textContent?.trim() || '';
  if (textContent) {
    const truncated = truncate(textContent, CONSTANTS.TEXT.MAX_CONTEXT_LENGTH);
    info.push(`Text: "${truncated}"`);
  }

  if (tagName === 'img') addImageInfo(element, info);
  if (tagName === 'a') addLinkInfo(element, info);
  if (tagName === 'input' || tagName === 'textarea' || tagName === 'select') {
    addFormControlInfo(element, info);
  }
  if (tagName === 'button') addButtonInfo(element, info);
  if (tagName === 'video') addVideoInfo(element, info);

  if (info.length === 0) {
    info.push(`<${tagName}> element`);
  }

  return info.join(' | ');
}

/**
 * Truncates text to the given max length and appends `...` if applicable.
 * @param {string} text - Original text.
 * @param {number} maxLen - Maximum length.
 * @returns {string} Truncated text.
 */
function truncate(text, maxLen) {
  if (text.length <= maxLen) return text;
  return `${text.slice(0, maxLen - 3)}...`;
}

/**
 * Extracts the filename from a URL.
 * @param {string} url - Source URL.
 * @returns {string} Filename or empty string.
 */
function extractFilename(url) {
  try {
    const parts = url.split('/');
    return parts[parts.length - 1] || '';
  } catch {
    return '';
  }
}

/**
 * Adds image-specific information (alt and filename/truncated src).
 * @param {HTMLImageElement} element - Image element.
 * @param {string[]} info - Info accumulator.
 */
function addImageInfo(element, info) {
  const alt = element.getAttribute('alt');
  const src = element.getAttribute('src');

  if (alt) info.push(`Alt: ${alt}`);

  if (src) {
    const filename = extractFilename(src);
    const maxLength = CONSTANTS.TEXT.MAX_URL_LENGTH;
    info.push(`Image: ${filename || src.substring(0, maxLength)}`);
  }
}

/**
 * Adds link information (truncated href).
 * @param {HTMLAnchorElement} element - Anchor element.
 * @param {string[]} info - Info accumulator.
 */
function addLinkInfo(element, info) {
  const href = element.getAttribute('href') || '';
  if (!href) return;

  const maxLength = CONSTANTS.TEXT.MAX_URL_LENGTH;
  const display = href.length > maxLength ? `${href.slice(0, maxLength)}...` : href;
  info.push(`Link: ${display}`);
}

/**
 * Adds form control information (type and placeholder).
 * @param {HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement} element - Form element.
 * @param {string[]} info - Info accumulator.
 */
function addFormControlInfo(element, info) {
  const type = element.getAttribute('type') || 'text';
  const placeholder = element.getAttribute('placeholder');

  info.push(`Type: ${type}`);
  if (placeholder) info.push(`Placeholder: ${placeholder}`);
}

/**
 * Adds button information (type).
 * @param {HTMLButtonElement} element - Button element.
 * @param {string[]} info - Info accumulator.
 */
function addButtonInfo(element, info) {
  const type = element.getAttribute('type') || 'button';
  info.push(`Button type: ${type}`);
}

/**
 * Adds video information (filename or truncated src/poster).
 * @param {HTMLVideoElement} element - Video element.
 * @param {string[]} info - Info accumulator.
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
