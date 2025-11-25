let currentAttribute = null;
let enabled = false;
let panelVisible = true;

// Debug helper - visible in the page console
console.log("🔵 Content script loaded - SEO Extension");
console.log("📍 Current URL:", window.location.href);

// Observe DOM changes to update the list
let observer = null;
let scanTimeout = null;
let isScanning = false;

function setupObserver() {
  if (observer) {
    observer.disconnect();
    observer = null;
  }
  
  if (!enabled || !currentAttribute) {
    return;
  }
  
  observer = new MutationObserver((mutations) => {
    // Ignore changes in the panel itself to avoid loops
    const hasPanelChanges = mutations.some(mutation => {
      return Array.from(mutation.addedNodes).some(node => 
        node === panel || (node.nodeType === 1 && panel && panel.contains(node))
      ) || Array.from(mutation.removedNodes).some(node => 
        node === panel || (node.nodeType === 1 && panel && panel.contains(node))
      );
    });
    
    if (hasPanelChanges || isScanning) {
      return; // Ignore panel changes or if already scanning
    }
    
    // Debounce: wait 300ms before scanning again
    if (scanTimeout) {
      clearTimeout(scanTimeout);
    }
    
    scanTimeout = setTimeout(() => {
      if (enabled && currentAttribute && panel) {
        scanAndDisplayAttributes();
      }
    }, 300);
  });
  
  // Observe only the body, excluding the panel
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: [`data-${currentAttribute}`]
  });
  
  console.log("👁️ Observer setup for", `data-${currentAttribute}`);
}

function updateExtensionState() {
  if (enabled && currentAttribute) {
    if (!panel) {
      createPanel();
    }
    scanAndDisplayAttributes();
    setupObserver();
  } else {
    removePanel();
    if (observer) {
      observer.disconnect();
      observer = null;
    }
  }
}

// Always load initial values
chrome.storage.sync.get(['attribute', 'enabled'], (data) => {
  currentAttribute = data.attribute || null;
  enabled = data.enabled || false;

  console.log("📦 Initial load:", { 
    currentAttribute, 
    enabled,
    timestamp: new Date().toISOString()
  });
  
  // Verify that storage works
  if (chrome.runtime.lastError) {
    console.error("❌ Error loading storage:", chrome.runtime.lastError);
  }
  
  updateExtensionState();
});

// Listen for changes
chrome.storage.sync.onChanged.addListener((changes) => {
  console.log("🔄 Storage changed:", changes);
  
  if (changes.attribute) {
    currentAttribute = changes.attribute.newValue;
    console.log("✅ Updated attribute:", currentAttribute);
  }
  if (changes.enabled) {
    enabled = changes.enabled.newValue;
    console.log("✅ Updated enabled:", enabled);
  }
  
  updateExtensionState();
});

// Side panel
let panel = null;
let attributeList = null;
let allElements = []; // Store all found elements
let allOriginalStyles = new Map(); // Store original styles
let isAllHighlighted = false; // Global highlight state
let selectedItem = null; // Individually selected item
let selectedElements = []; // Elements of the selected item
let selectedOriginalStyles = new Map(); // Original styles of the selected item
let allAttributeItems = []; // Store all attribute items for filtering

function createPanel() {
  if (panel) return; // Already exists
  
  panel = document.createElement('div');
  panel.id = 'ah-panel';
  panel.innerHTML = `
    <div class="ah-panel-header">
      <div class="ah-header-left">
        <h3 id="ah-panel-title">Found 0 attributes</h3>
        <input type="text" id="ah-search-input" class="ah-search-input" placeholder="Search attributes..." />
        <button id="ah-highlight-all-btn" class="ah-highlight-all-btn" title="Highlight all elements">Highlight All</button>
      </div>
      <button id="ah-panel-toggle" title="Minimize panel">−</button>
    </div>
    <div class="ah-panel-content">
      <div id="ah-attribute-list"></div>
    </div>
  `;
  
  document.body.appendChild(panel);
  attributeList = document.getElementById('ah-attribute-list');
  
  // Function to toggle the panel
  function togglePanel() {
    panelVisible = !panelVisible;
    
    if (panelVisible) {
      // Expand panel
      panel.classList.remove('ah-panel-collapsed');
      panel.classList.add('ah-panel-expanded');
    } else {
      // Collapse to small icon
      panel.classList.remove('ah-panel-expanded');
      panel.classList.add('ah-panel-collapsed');
    }
  }
  
  // Toggle button - minimize to floating icon
  document.getElementById('ah-panel-toggle').addEventListener('click', (e) => {
    e.stopPropagation(); // Prevent propagation to panel
    togglePanel();
  });
  
  // Click on collapsed panel to expand it
  panel.addEventListener('click', () => {
    if (panel.classList.contains('ah-panel-collapsed')) {
      // If collapsed, expand on click anywhere
      togglePanel();
    }
  });
  
  // Button to highlight/unhighlight all
  const highlightAllBtn = document.getElementById('ah-highlight-all-btn');
  highlightAllBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleAllHighlight();
  });
  
  // Search input filter
  const searchInput = document.getElementById('ah-search-input');
  searchInput.addEventListener('input', (e) => {
    filterAttributeList(e.target.value.toLowerCase());
  });
  
  // Initialize as expanded
  panel.classList.add('ah-panel-expanded');
  
  console.log("✅ Panel created");
}

function toggleAllHighlight() {
  if (allElements.length === 0) return;
  
  // Clear individual selection if exists
  deselectItem();
  
  if (isAllHighlighted) {
    // Remove highlight from all
    allElements.forEach(el => {
      el.classList.remove('ah-highlight-all');
    });
    isAllHighlighted = false;
    const btn = document.getElementById('ah-highlight-all-btn');
    if (btn) {
      btn.textContent = 'Highlight All';
      btn.classList.remove('active');
      btn.setAttribute('aria-pressed', 'false');
    }
  } else {
    // Add highlight to all
    allElements.forEach(el => {
      el.classList.add('ah-highlight-all');
    });
    isAllHighlighted = true;
    const btn2 = document.getElementById('ah-highlight-all-btn');
    if (btn2) {
      btn2.textContent = 'Unhighlight All';
      btn2.classList.add('active');
      btn2.setAttribute('aria-pressed', 'true');
    }
  }
}

function removePanel() {
  // Clear highlights before removing the panel
  if (isAllHighlighted) {
    toggleAllHighlight();
  }
  
  // Clear individual selection
  deselectItem();
  
  if (panel) {
    panel.remove();
    panel = null;
    attributeList = null;
  }
  
  // Clear arrays
  allElements = [];
  allOriginalStyles.clear();
  isAllHighlighted = false;
  selectedItem = null;
  selectedElements = [];
  selectedOriginalStyles.clear();
}

function scanAndDisplayAttributes() {
  if (!enabled || !currentAttribute || !panel) return;
  
  // Prevent loops: if already scanning, exit
  if (isScanning) return;
  isScanning = true;
  
  const attrName = `data-${currentAttribute}`;
  const elements = document.querySelectorAll(`[${attrName}]`);
  const title = document.getElementById('ah-panel-title');
  
  if (!title) {
    isScanning = false;
    return;
  }
  
  title.textContent = `Found ${elements.length} ${attrName} attributes:`;
  
  if (!attributeList) {
    attributeList = document.getElementById('ah-attribute-list');
  }
  
  if (!attributeList) {
    isScanning = false;
    return;
  }
  
  // Disconnect observer temporarily while modifying the panel
  if (observer) {
    observer.disconnect();
  }
  
  // Store all found elements
  allElements = Array.from(elements);
  allOriginalStyles.clear(); // Legacy map no longer required for class-based highlight
  // Preserve global highlight state; if active, reapply to new elements
  if (isAllHighlighted) {
    allElements.forEach(el => {
      el.classList.add('ah-highlight-all');
    });
  }
  
  // Clear individual selection on update
  deselectItem();
  
  // Update highlight button
  const highlightAllBtn = document.getElementById('ah-highlight-all-btn');
  if (highlightAllBtn) {
    if (isAllHighlighted) {
      highlightAllBtn.textContent = 'Unhighlight All';
      highlightAllBtn.classList.add('active');
      highlightAllBtn.setAttribute('aria-pressed', 'true');
    } else {
      highlightAllBtn.textContent = 'Highlight All';
      highlightAllBtn.classList.remove('active');
      highlightAllBtn.setAttribute('aria-pressed', 'false');
    }
  }
  
  // Clear search input
  const searchInput = document.getElementById('ah-search-input');
  if (searchInput) {
    searchInput.value = '';
  }
  
  // Clear previous items
  allAttributeItems = [];
  attributeList.innerHTML = '';
  
  const attributeMap = new Map();
  
  elements.forEach((el, index) => {
    const value = el.getAttribute(attrName);
    const key = value || `element-${index}`;
    
    if (!attributeMap.has(key)) {
      attributeMap.set(key, []);
    }
    attributeMap.get(key).push(el);
  });
  
  // Sort by position on the page (top to bottom)
  const sortedEntries = Array.from(attributeMap.entries()).sort((a, b) => {
    // Get the first element of each group
    const elA = a[1][0];
    const elB = b[1][0];
    
    // Get positions on the page
    const rectA = elA.getBoundingClientRect();
    const rectB = elB.getBoundingClientRect();
    
    // Sort by Y position (top), then by X (left) if on the same row
    const topDiff = rectA.top - rectB.top;
    if (Math.abs(topDiff) > 5) { // If there's a significant difference in Y
      return topDiff;
    }
    // If approximately at the same height, sort by X (left)
    return rectA.left - rectB.left;
  });
  
  // Clear previous items
  allAttributeItems = [];
  attributeList.innerHTML = '';
  
  // Display clickable attribute list
  sortedEntries.forEach(([value, elements]) => {
    const firstElement = elements[0];
    const item = document.createElement('div');
    item.className = 'ah-attribute-item';
    item.setAttribute('role', 'button');
    item.setAttribute('tabindex', '0');
    item.setAttribute('aria-label', `${attrName}: ${value || '(empty)'}`);
    
    // Get contextual information from the element
    const contextInfo = getElementContextInfo(firstElement);
    
    item.innerHTML = `
      <div class="ah-attr-header">
        <span class="ah-attr-name">${attrName}: ${value || '(empty)'} </span>
      </div>
      <div class="ah-attr-context">${contextInfo}</div>
    `;
    
    // Store searchable data
    item.dataset.searchText = `${value || 'empty'} ${contextInfo}`.toLowerCase();
    
    // Make item clickable
    item.style.cursor = 'pointer';
    item.addEventListener('click', () => {
      // If already selected, deselect
      if (selectedItem === item) {
        deselectItem();
        return;
      }
      
      // Deselect previous item if exists
      if (selectedItem) {
        deselectItem();
      }
      
      // Select new item
      selectItem(item, elements);
    });
    
    // Keyboard activation
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        item.click();
      }
    });

    attributeList.appendChild(item);
    allAttributeItems.push(item);
  });
  
  // Reconnect observer after modifying the panel
  if (enabled && currentAttribute) {
    // Small delay to ensure DOM is updated
    setTimeout(() => {
      if (observer) {
        observer.observe(document.body, {
          childList: true,
          subtree: true,
          attributes: true,
          attributeFilter: [`data-${currentAttribute}`]
        });
      }
      isScanning = false;
    }, 50);
  } else {
    isScanning = false;
  }
  
  console.log(`✅ Found ${elements.length} elements with ${attrName}`);
}

function selectItem(item, elements) {
  selectedItem = item;
  selectedElements = elements;
  selectedOriginalStyles.clear();
  
  // Highlight the item in the list
  item.classList.add('ah-item-selected');
  
  // Highlight elements on the page with different color (yellow/orange)
  elements.forEach((el, index) => {
    // Apply special highlight via class
    el.classList.add('ah-highlight-selected');
    
    // Scroll to first element
    if (index === 0) {
      setTimeout(() => {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  });
}

function deselectItem() {
  if (!selectedItem || selectedElements.length === 0) return;
  
  // Remove highlight from elements
  selectedElements.forEach(el => {
    el.classList.remove('ah-highlight-selected');
  });
  
  // Remove selection class from item
  selectedItem.classList.remove('ah-item-selected');
  
  // Clear selection
  selectedItem = null;
  selectedElements = [];
  selectedOriginalStyles.clear();
}

// Tooltip for hover
const tooltip = document.createElement('div');
tooltip.style.cssText = `
  position: fixed;
  background: #2563eb;
  color: white;
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 13px;
  z-index: 10001;
  display: none;
  pointer-events: none;
  font-family: system-ui, sans-serif;
`;
document.body.appendChild(tooltip);

document.addEventListener('mouseover', (e) => {
  if (!enabled || !currentAttribute) return;

  const attrName = `data-${currentAttribute}`;
  const value = e.target.getAttribute(attrName);

  if (value) {
    tooltip.innerHTML = `${attrName}: ${value}`;
    tooltip.style.top = (e.pageY + 15) + 'px';
    tooltip.style.left = (e.pageX + 15) + 'px';
    tooltip.style.display = 'block';
  } else {
    tooltip.style.display = 'none';
  }
});

document.addEventListener('mouseout', () => {
  tooltip.style.display = 'none';
});


// Función de debug global
window.debugSEOExtension = function() {
  console.log("🔍 SEO Extension Debug Info:");
  console.log("  - Enabled:", enabled);
  console.log("  - Current Attribute:", currentAttribute);
  console.log("  - Panel visible:", panelVisible);
  console.log("  - Panel exists:", !!panel);
  
  chrome.storage.sync.get(['attribute', 'enabled'], (data) => {
    console.log("  - Storage values:", data);
    if (chrome.runtime.lastError) {
      console.error("  - Storage error:", chrome.runtime.lastError);
    }
  });
  
  return {
    enabled,
    currentAttribute,
    panelVisible,
    panelExists: !!panel
  };
};

// Get contextual information from an element
function getElementContextInfo(element) {
  if (!element) return '';
  
  const tagName = element.tagName.toLowerCase();
  let info = [];
  
  // Get text content (truncated)
  const textContent = element.textContent?.trim() || '';
  if (textContent) {
    const truncated = textContent.length > 60 ? textContent.substring(0, 60) + '...' : textContent;
    info.push(`"${truncated}"`);
  }
  
  // For images
  if (tagName === 'img') {
    const alt = element.getAttribute('alt') || '';
    const src = element.getAttribute('src') || '';
    const imageName = src.split('/').pop() || src.split('\\').pop() || '';
    
    if (alt) info.push(`Alt: ${alt}`);
    if (imageName && imageName !== src) info.push(`Image: ${imageName}`);
    else if (src) info.push(`Src: ${src.substring(0, 40)}${src.length > 40 ? '...' : ''}`);
  }
  
  // For videos
  if (tagName === 'video') {
    const src = element.getAttribute('src') || '';
    const poster = element.getAttribute('poster') || '';
    if (src) info.push(`Video: ${src.split('/').pop() || src.substring(0, 40)}`);
    if (poster) info.push(`Poster: ${poster.split('/').pop() || poster.substring(0, 30)}`);
  }
  
  // For links
  if (tagName === 'a') {
    const href = element.getAttribute('href') || '';
    if (href) info.push(`Link: ${href.substring(0, 40)}${href.length > 40 ? '...' : ''}`);
  }
  
  // For inputs
  if (tagName === 'input') {
    const type = element.getAttribute('type') || 'text';
    const placeholder = element.getAttribute('placeholder') || '';
    info.push(`Type: ${type}`);
    if (placeholder) info.push(`Placeholder: ${placeholder}`);
  }
  
  // For buttons
  if (tagName === 'button') {
    const type = element.getAttribute('type') || '';
    if (type) info.push(`Button type: ${type}`);
  }
  
  // Add tag name if no other info
  if (info.length === 0) {
    info.push(`<${tagName}>`);
  }
  
  return info.join(' • ') || '';
}

// Filter attribute list based on search query
function filterAttributeList(searchQuery) {
  if (!attributeList || !allAttributeItems.length) return;
  
  allAttributeItems.forEach(item => {
    if (!searchQuery || item.dataset.searchText.includes(searchQuery)) {
      item.style.display = 'flex';
    } else {
      item.style.display = 'none';
    }
  });
}

console.log("💡 Tip: Type 'debugSEOExtension()' in the console to see the extension state");
