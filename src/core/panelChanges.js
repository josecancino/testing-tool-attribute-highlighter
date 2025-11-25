// src/core/panelChanges.js
/**
 * Determines whether DOM mutations affect the panel (panel node or its children).
 * @param {MutationRecord[]} mutations - DOM mutation records.
 * @param {HTMLElement|null} panel - Panel root element.
 * @returns {boolean} True if any mutation adds/removes the panel or its children.
 */
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
