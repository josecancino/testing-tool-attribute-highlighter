// Create toggle button
const toggleButton = document.createElement('button');
toggleButton.innerHTML = '👁 Show data-atm';
toggleButton.style.cssText = `
  position: fixed;
  top: 20px;
  right: 140px;
  padding: 8px 16px;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  z-index: 10000;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;
document.body.appendChild(toggleButton);

// Create alt text button
const altTextButton = document.createElement('button');
altTextButton.innerHTML = '♿️ Accessibility';
altTextButton.style.cssText = `
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 8px 16px;
  background: #059669;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  z-index: 10000;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;
document.body.appendChild(altTextButton);

// Create tooltip
const tooltip = document.createElement('div');
tooltip.id = 'attribute-tooltip';
tooltip.style.cssText = `
  position: fixed;
  background: #2563eb;
  color: white;
  padding: 8px;
  border-radius: 6px;
  font-size: 14px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 10000;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  display: none;
`;
document.body.appendChild(tooltip);

// Create container for showing all data-atm
const allDataAtmContainer = document.createElement('div');
allDataAtmContainer.style.cssText = `
  position: fixed;
  top: 70px;
  right: 20px;
  max-width: 300px;
  max-height: 80vh;
  overflow-y: auto;
  background: white;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 10000;
  display: none;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
`;
document.body.appendChild(allDataAtmContainer);

// Create container for showing all alt text
const allAltTextContainer = document.createElement('div');
allAltTextContainer.style.cssText = `
  position: fixed;
  top: 70px;
  right: 20px;
  max-width: 300px;
  max-height: 80vh;
  overflow-y: auto;
  background: white;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 10000;
  display: none;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
`;
document.body.appendChild(allAltTextContainer);

let isEnabled = true;
let showingAllDataAtm = false;
let showingAllAltText = false;
let highlightedElement = null;

// Function to remove highlight from previous element
function removeHighlight() {
  if (highlightedElement) {
    highlightedElement.style.outline = '';
    highlightedElement.style.backgroundColor = '';
    highlightedElement = null;
  }
}

// Function to highlight elements by selector
function highlightElements(selector, color) {
  const elements = document.querySelectorAll(selector);
  elements.forEach(el => {
    if (el !== highlightedElement) { // Don't override the highlighted element
      el.style.outline = `2px solid ${color}`;
      el.style.backgroundColor = color === '#2563eb' ? '#dbeafe' : '#f0fdf4';
    }
  });
  return elements.length;
}

// Function to highlight and scroll to element
function highlightElement(element) {
  if (highlightedElement === element) return; // Don't rehighlight the same element
  
  // Remove previous highlight but maintain general highlights
  if (highlightedElement) {
    const isDataAtm = highlightedElement.hasAttribute('data-atm');
    const color = isDataAtm ? '#2563eb' : '#059669';
    const bgColor = isDataAtm ? '#dbeafe' : '#f0fdf4';
    highlightedElement.style.outline = `2px solid ${color}`;
    highlightedElement.style.backgroundColor = bgColor;
  }
  
  element.scrollIntoView({ behavior: 'smooth', block: 'center' });
  element.style.outline = '3px solid #f59e0b'; // Bright orange for better visibility
  element.style.backgroundColor = '#fef3c7';
  highlightedElement = element;
}

function showAllDataAtm() {
  const elements = document.querySelectorAll('[data-atm]');
  const dataAtmList = Array.from(elements).map((el, index) => {
    const value = el.getAttribute('data-atm');
    return `<div 
      onclick="(function() {
        const element = document.querySelector('[data-atm=\\'${value}\\']');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.style.outline = '3px solid #f59e0b';
          element.style.backgroundColor = '#fef3c7';
          
          // Reset other elements to their default highlight
          document.querySelectorAll('[data-atm]').forEach(el => {
            if (el !== element) {
              el.style.outline = '2px solid #2563eb';
              el.style.backgroundColor = '#dbeafe';
            }
          });
        }
      })()"
      style="padding: 8px; background: #f0f8ff; margin: 4px; border-radius: 4px; border: 1px solid #2563eb; cursor: pointer; transition: all 0.2s;"
      onmouseover="this.style.background='#e0f2fe'"
      onmouseout="this.style.background='#f0f8ff'"
    >
      <strong style="color: #2563eb;">data-atm:</strong> 
      <span style="color: #1f2937;">${value}</span>
      <div style="font-size: 12px; color: #6b7280; margin-top: 2px;">Click to highlight</div>
    </div>`;
  });

  if (dataAtmList.length > 0) {
    allDataAtmContainer.innerHTML = `
      <div style="margin-bottom: 10px; font-weight: bold; color: #2563eb;">
        Found ${dataAtmList.length} data-atm attributes:
      </div>
      ${dataAtmList.join('')}
    `;
    allDataAtmContainer.style.display = 'block';
    highlightElements('[data-atm]', '#2563eb');
  } else {
    allDataAtmContainer.innerHTML = '<div style="color: #6b7280;">No data-atm attributes found</div>';
    allDataAtmContainer.style.display = 'block';
  }
}

function showAllAltText() {
  const elements = document.querySelectorAll('[alt], [aria-label]');
  const accessibilityList = Array.from(elements).map((el, index) => {
    const altValue = el.getAttribute('alt');
    const ariaValue = el.getAttribute('aria-label');
    
    if (!altValue && !ariaValue) return null;
    
    let content = [];
    if (altValue) {
      content.push(`<div style="margin-bottom: 4px;">
        <strong style="color: #059669;">alt:</strong> 
        <span style="color: #1f2937;">${altValue}</span>
      </div>`);
    }
    if (ariaValue) {
      content.push(`<div>
        <strong style="color: #059669;">aria-label:</strong> 
        <span style="color: #1f2937;">${ariaValue}</span>
      </div>`);
    }

    const selector = altValue ? `[alt="${altValue.replace(/"/g, '\\"')}"]` : `[aria-label="${ariaValue.replace(/"/g, '\\"')}"]`;
    
    return `<div 
      onclick="(function() {
        const element = document.querySelector('${selector}');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.style.outline = '3px solid #f59e0b';
          element.style.backgroundColor = '#fef3c7';
          
          // Reset other elements to their default highlight
          document.querySelectorAll('[alt], [aria-label]').forEach(el => {
            if (el !== element) {
              el.style.outline = '2px solid #059669';
              el.style.backgroundColor = '#f0fdf4';
            }
          });
        }
      })()"
      style="padding: 8px; background: #f0fdf4; margin: 4px; border-radius: 4px; border: 1px solid #059669; cursor: pointer; transition: all 0.2s;"
      onmouseover="this.style.background='#dcfce7'"
      onmouseout="this.style.background='#f0fdf4'"
    >
      ${content.join('')}
      <div style="font-size: 12px; color: #6b7280; margin-top: 2px;">Click to highlight</div>
    </div>`;
  }).filter(Boolean);

  if (accessibilityList.length > 0) {
    allAltTextContainer.innerHTML = `
      <div style="margin-bottom: 10px; font-weight: bold; color: #059669;">
        Found ${accessibilityList.length} accessibility attributes:
      </div>
      ${accessibilityList.join('')}
    `;
    allAltTextContainer.style.display = 'block';
    highlightElements('[alt], [aria-label]', '#059669');
  } else {
    allAltTextContainer.innerHTML = '<div style="color: #6b7280;">No accessibility attributes found</div>';
    allAltTextContainer.style.display = 'block';
  }
}

// Function to remove all highlights
function removeAllHighlights() {
  document.querySelectorAll('[data-atm], [alt], [aria-label]').forEach(el => {
    el.style.outline = '';
    el.style.backgroundColor = '';
  });
  highlightedElement = null;
}

toggleButton.addEventListener('click', () => {
  if (showingAllDataAtm) {
    // Hide all mode
    showingAllDataAtm = false;
    isEnabled = true;
    allDataAtmContainer.style.display = 'none';
    removeAllHighlights();
    toggleButton.innerHTML = '👁 Show data-atm';
    toggleButton.style.background = '#2563eb';
  } else {
    // Show all mode
    showingAllDataAtm = true;
    showingAllAltText = false;
    isEnabled = false;
    tooltip.style.display = 'none';
    allAltTextContainer.style.display = 'none';
    removeAllHighlights();
    showAllDataAtm();
    toggleButton.innerHTML = '❌ Hide data-atm';
    toggleButton.style.background = '#dc2626';
    
    // Reset other button
    altTextButton.innerHTML = '♿️ Accessibility';
    altTextButton.style.background = '#059669';
  }
});

altTextButton.addEventListener('click', () => {
  if (showingAllAltText) {
    showingAllAltText = false;
    allAltTextContainer.style.display = 'none';
    removeAllHighlights();
    altTextButton.innerHTML = '♿️ Accessibility';
    altTextButton.style.background = '#059669';
  } else {
    showingAllAltText = true;
    showingAllDataAtm = false;
    allDataAtmContainer.style.display = 'none';
    tooltip.style.display = 'none';
    removeAllHighlights();
    showAllAltText();
    altTextButton.innerHTML = '❌ Hide Accessibility';
    altTextButton.style.background = '#dc2626';
    
    // Reset other button
    toggleButton.innerHTML = '👁 Show data-atm';
    toggleButton.style.background = '#2563eb';
  }
});

document.addEventListener('mouseover', (event) => {
  if (!isEnabled || showingAllDataAtm || showingAllAltText) return;
  
  const el = event.target;
  const attributes = [];
  
  // Check for data-atm
  const dataAtm = el.getAttribute('data-atm');
  if (dataAtm) {
    attributes.push(`<div style="padding: 6px; background: rgba(255, 255, 255, 0.1); margin: 4px; border-radius: 4px; backdrop-filter: blur(4px);">
      <strong style="color: #93c5fd;">data-atm:</strong> <span style="color: #ffffff;">${dataAtm}</span>
    </div>`);
  }
  
  // Check for alt text
  const altText = el.getAttribute('alt');
  if (altText) {
    attributes.push(`<div style="padding: 6px; background: rgba(255, 255, 255, 0.1); margin: 4px; border-radius: 4px; backdrop-filter: blur(4px);">
      <strong style="color: #93c5fd;">alt:</strong> <span style="color: #ffffff;">${altText}</span>
    </div>`);
  }

  // Check for aria-label
  const ariaLabel = el.getAttribute('aria-label');
  if (ariaLabel) {
    attributes.push(`<div style="padding: 6px; background: rgba(255, 255, 255, 0.1); margin: 4px; border-radius: 4px; backdrop-filter: blur(4px);">
      <strong style="color: #93c5fd;">aria-label:</strong> <span style="color: #ffffff;">${ariaLabel}</span>
    </div>`);
  }

  if (attributes.length > 0) {
    tooltip.innerHTML = attributes.join('');
    tooltip.style.display = 'block';
    tooltip.style.top = `${event.pageY + 15}px`;
    tooltip.style.left = `${event.pageX + 15}px`;
  } else {
    tooltip.style.display = 'none';
  }
});

document.addEventListener('mouseout', () => {
  if (!isEnabled || showingAllDataAtm || showingAllAltText) return;
  tooltip.style.display = 'none';
});