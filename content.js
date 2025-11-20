/************************************
 * Configurable Attribute Highlighter
 ************************************/

// Create attribute input box
const attributeInput = document.createElement('input');
attributeInput.placeholder = 'Enter attribute (e.g. testid)';
attributeInput.style.cssText = `
  position: fixed;
  top: 20px;
  right: 200px;
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 14px;
  z-index: 10000;
  width: 160px;
`;
document.body.appendChild(attributeInput);

// Create toggle button
const toggleButton = document.createElement('button');
toggleButton.innerHTML = '👁 Show attributes';
toggleButton.style.cssText = `
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 8px 16px;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-family: system-ui, sans-serif;
  z-index: 10000;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;
document.body.appendChild(toggleButton);

// Create tooltip
const tooltip = document.createElement('div');
tooltip.id = 'dynamic-tooltip';
tooltip.style.cssText = `
  position: fixed;
  background: #2563eb;
  color: white;
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 13px;
  z-index: 10000;
  display: none;
  font-family: system-ui, sans-serif;
`;
document.body.appendChild(tooltip);

// Container to list all attributes found
const listContainer = document.createElement('div');
listContainer.style.cssText = `
  position: fixed;
  top: 70px;
  right: 20px;
  max-width: 300px;
  max-height: 70vh;
  overflow-y: auto;
  background: white;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  z-index: 10000;
  display: none;
  font-family: system-ui, sans-serif;
`;
document.body.appendChild(listContainer);

let isEnabled = false;
let currentAttribute = null;
let highlightedElement = null;

// Remove all highlights
function clearHighlights() {
  if (!currentAttribute) return;
  document.querySelectorAll(`[data-${currentAttribute}]`).forEach(el => {
    el.style.outline = '';
    el.style.backgroundColor = '';
  });
}

// Highlight specific element
function highlightElement(el) {
  if (!el) return;
  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  el.style.outline = '3px solid #f59e0b';
  el.style.backgroundColor = '#fef3c7';
  highlightedElement = el;
}

// List all attributes
function showAllAttributes() {
  const selector = `[data-${currentAttribute}]`;
  const elements = document.querySelectorAll(selector);

  if (!elements.length) {
    listContainer.innerHTML = `<div>No data-${currentAttribute} found</div>`;
    listContainer.style.display = 'block';
    return;
  }

  const list = Array.from(elements).map((el, i) => {
    const value = el.getAttribute(`data-${currentAttribute}`);
    return `
      <div 
        style="padding: 8px; background: #f0f8ff; margin: 4px; border-radius: 4px; border: 1px solid #2563eb; cursor: pointer;"
        onclick="document.querySelector('[data-${currentAttribute}=\"${value}\"]').scrollIntoView({behavior:'smooth',block:'center'})"
      >
        <strong>data-${currentAttribute}:</strong> ${value}
      </div>
    `;
  });

  listContainer.innerHTML = `
    <div style="font-weight:bold; margin-bottom:10px;">
      Found ${elements.length} data-${currentAttribute} elements:
    </div>
    ${list.join('')}
  `;
  listContainer.style.display = 'block';

  // Highlight all
  elements.forEach(el => {
    el.style.outline = '2px solid #2563eb';
    el.style.backgroundColor = '#dbeafe';
  });
}

// Toggle button
toggleButton.addEventListener('click', () => {
  if (!isEnabled) {
    currentAttribute = attributeInput.value.trim();
    if (!currentAttribute) {
      alert('Please enter an attribute (e.g. testid)');
      return;
    }

    isEnabled = true;
    toggleButton.innerHTML = '❌ Hide';
    toggleButton.style.background = '#dc2626';

    listContainer.style.display = 'none';
    clearHighlights();
    showAllAttributes();
  } else {
    isEnabled = false;
    toggleButton.innerHTML = '👁 Show attributes';
    toggleButton.style.background = '#2563eb';

    listContainer.style.display = 'none';
    clearHighlights();
    tooltip.style.display = 'none';
  }
});

// Tooltip on hover
document.addEventListener('mouseover', (event) => {
  if (!isEnabled) return;

  const el = event.target;
  const value = el.getAttribute(`data-${currentAttribute}`);

  if (value) {
    tooltip.innerHTML = `data-${currentAttribute}: ${value}`;
    tooltip.style.display = 'block';
    tooltip.style.top = (event.pageY + 15) + 'px';
    tooltip.style.left = (event.pageX + 15) + 'px';
  } else {
    tooltip.style.display = 'none';
  }
});

document.addEventListener('mouseout', () => {
  tooltip.style.display = 'none';
});
