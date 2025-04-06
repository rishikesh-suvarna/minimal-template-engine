export type EventHandler = (event: Event) => void;

export interface EventMap {
  [selector: string]: {
    [eventName: string]: EventHandler;
  };
}

/**
 * Attach event handlers to elements matching selectors within a root element
 */
export function attachEvents(rootElement: Element | string, eventMap: EventMap): void {
  const root = typeof rootElement === 'string'
    ? document.querySelector(rootElement)
    : rootElement;

  if (!root) {
    throw new Error('Root element not found');
  }

  for (const [selector, events] of Object.entries(eventMap)) {
    const elements = root.querySelectorAll(selector);

    for (const [eventName, handler] of Object.entries(events)) {
      elements.forEach(element => {
        element.addEventListener(eventName, handler);
      });
    }
  }
}