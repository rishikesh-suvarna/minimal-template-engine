import { RenderFunction } from './compiler';

export class Renderer {
  /**
   * Render data with a compiled template function
   */
  public render(renderFn: RenderFunction, data: Record<string, any> = {}): string {
    return renderFn(data);
  }

  /**
   * Render to a DOM element
   */
  public renderToDOM(renderFn: RenderFunction, selector: string, data: Record<string, any> = {}): void {
    const element = document.querySelector(selector);
    if (!element) {
      throw new Error(`Element not found: ${selector}`);
    }

    element.innerHTML = this.render(renderFn, data);
  }
}