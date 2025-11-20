// src/core/elementContextInfo.js
import { CONSTANTS } from '../constants.js';

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

function truncate(text, maxLen) {
  if (text.length <= maxLen) return text;
  return `${text.slice(0, maxLen - 3)}...`;
}

function extractFilename(url) {
  try {
    const parts = url.split('/');
    return parts[parts.length - 1] || '';
  } catch {
    return '';
  }
}

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

function addLinkInfo(element, info) {
  const href = element.getAttribute('href') || '';
  if (!href) return;

  const maxLength = CONSTANTS.TEXT.MAX_URL_LENGTH;
  const display = href.length > maxLength ? `${href.slice(0, maxLength)}...` : href;
  info.push(`Link: ${display}`);
}

function addFormControlInfo(element, info) {
  const type = element.getAttribute('type') || 'text';
  const placeholder = element.getAttribute('placeholder');

  info.push(`Type: ${type}`);
  if (placeholder) info.push(`Placeholder: ${placeholder}`);
}

function addButtonInfo(element, info) {
  const type = element.getAttribute('type') || 'button';
  info.push(`Button type: ${type}`);
}

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
