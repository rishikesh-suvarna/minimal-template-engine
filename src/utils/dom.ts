/**
 * DOM utilities for the template engine.
 */

/**
 * Find a DOM element by selector
 * @param selector CSS selector or DOM element
 * @returns The DOM element or null if not found
 */
export function getElement(selector: string | Element): Element | null {
  if (typeof selector === 'string') {
    return document.querySelector(selector);
  }
  return selector;
}

/**
 * Create a DOM element with optional attributes, children, and text content
 * @param tagName HTML tag name
 * @param options Optional configuration (attributes, children, text)
 * @returns The created DOM element
 */
export function createElement(
  tagName: string,
  options: {
    attributes?: Record<string, string>;
    children?: Element[];
    text?: string;
  } = {}
): Element {
  const element = document.createElement(tagName);

  // Add attributes
  if (options.attributes) {
    for (const [key, value] of Object.entries(options.attributes)) {
      element.setAttribute(key, value);
    }
  }

  // Add text content
  if (options.text) {
    element.textContent = options.text;
  }

  // Add children
  if (options.children) {
    for (const child of options.children) {
      element.appendChild(child);
    }
  }

  return element;
}

/**
 * Simple DOM diffing and patching algorithm.
 * This is a simplified version that only handles text content changes.
 * A more comprehensive solution would implement a virtual DOM.
 * 
 * @param oldNode Current DOM node
 * @param newContent New HTML content
 * @returns Updated DOM node
 */
export function updateElement(oldNode: Element, newContent: string): Element {
  // Create a temporary container to parse the new HTML
  const tempContainer = document.createElement('div');
  tempContainer.innerHTML = newContent;
  const newNode = tempContainer.firstElementChild as Element;

  if (!newNode) {
    return oldNode;
  }

  // Very simple diffing strategy - if they're the same type of element, update in place
  // otherwise replace the old node with the new one
  if (oldNode.nodeName === newNode.nodeName) {
    // Update attributes
    const oldAttributes = Array.from(oldNode.attributes);
    const newAttributes = Array.from(newNode.attributes);

    // Remove old attributes not in new node
    for (const attr of oldAttributes) {
      if (!newNode.hasAttribute(attr.name)) {
        oldNode.removeAttribute(attr.name);
      }
    }

    // Set new attributes
    for (const attr of newAttributes) {
      oldNode.setAttribute(attr.name, attr.value);
    }

    // Simple child reconciliation
    // A more complete implementation would use keys and proper reconciliation
    if (!oldNode.hasChildNodes() && !newNode.hasChildNodes()) {
      // Both empty, nothing to do
      return oldNode;
    } else if (!newNode.hasChildNodes()) {
      // New node is empty, clear old node
      oldNode.innerHTML = '';
      return oldNode;
    } else if (!oldNode.hasChildNodes()) {
      // Old node is empty, insert all new children
      oldNode.innerHTML = newNode.innerHTML;
      return oldNode;
    } else {
      // Both have children, update in place when possible
      updateChildren(oldNode, newNode);
      return oldNode;
    }
  } else {
    // Different node types, replace entirely
    oldNode.replaceWith(newNode);
    return newNode;
  }
}

/**
 * Helper function to update children of an element
 */
function updateChildren(oldParent: Element, newParent: Element): void {
  const oldChildren = Array.from(oldParent.childNodes);
  const newChildren = Array.from(newParent.childNodes);

  // Handle simple cases
  if (oldChildren.length === 0) {
    // Old element has no children, append all new children
    for (const newChild of newChildren) {
      oldParent.appendChild(newChild.cloneNode(true));
    }
    return;
  }

  if (newChildren.length === 0) {
    // New element has no children, remove all old children
    oldParent.innerHTML = '';
    return;
  }

  // This is a simplified algorithm - a real implementation would need
  // more sophisticated reconciliation with keys
  for (let i = 0; i < Math.max(oldChildren.length, newChildren.length); i++) {
    if (i >= newChildren.length) {
      // More old children than new, remove excess
      oldParent.removeChild(oldChildren[i]);
    } else if (i >= oldChildren.length) {
      // More new children than old, append new ones
      oldParent.appendChild(newChildren[i].cloneNode(true));
    } else {
      // Update existing child
      if (oldChildren[i].nodeType === Node.TEXT_NODE &&
        newChildren[i].nodeType === Node.TEXT_NODE) {
        // Text node, just update content
        if (oldChildren[i].textContent !== newChildren[i].textContent) {
          oldChildren[i].textContent = newChildren[i].textContent;
        }
      } else if (oldChildren[i].nodeType === Node.ELEMENT_NODE &&
        newChildren[i].nodeType === Node.ELEMENT_NODE) {
        // Element node, recurse if same type
        if ((oldChildren[i] as Element).tagName === (newChildren[i] as Element).tagName) {
          updateElement(oldChildren[i] as Element, (newChildren[i] as Element).outerHTML);
        } else {
          // Different types, replace
          oldChildren[i].replaceWith(newChildren[i].cloneNode(true));
        }
      } else {
        // Different node types, replace
        oldChildren[i].replaceWith(newChildren[i].cloneNode(true));
      }
    }
  }
}