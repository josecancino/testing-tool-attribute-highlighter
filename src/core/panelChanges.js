// src/core/panelChanges.js
export function hasPanelChanges(mutations, panel) {
    if (!panel) return false;
  
    return mutations.some((mutation) => {
      const addedNodes = Array.from(mutation.addedNodes);
      const removedNodes = Array.from(mutation.removedNodes);
  
      const affectsPanel = (node) =>
        node === panel || (node.nodeType === 1 && panel.contains(node));
  
      return addedNodes.some(affectsPanel) || removedNodes.some(affectsPanel);
    });
  }
  