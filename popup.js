const attrInput = document.getElementById('attrInput');
const toggleBtn = document.getElementById('toggleBtn');

// Load saved settings
chrome.storage.sync.get(['attribute', 'enabled'], ({ attribute, enabled }) => {
  if (attribute) attrInput.value = attribute;

  if (enabled) {
    toggleBtn.textContent = "Disable";
    toggleBtn.classList.add("enabled");
  } else {
    toggleBtn.textContent = "Enable";
    toggleBtn.classList.remove("enabled");
  }
});

// Save attribute changes
attrInput.addEventListener('input', () => {
  chrome.storage.sync.set({ attribute: attrInput.value.trim() });
});

// Enable / Disable
toggleBtn.addEventListener('click', () => {
  const newState = !toggleBtn.classList.contains("enabled");

  chrome.storage.sync.set({ enabled: newState });

  if (newState) {
    toggleBtn.textContent = "Disable";
    toggleBtn.classList.add("enabled");
  } else {
    toggleBtn.textContent = "Enable";
    toggleBtn.classList.remove("enabled");
  }
});
