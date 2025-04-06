import { MinimalTemplate } from '../core';
import { ComponentOptions } from '../types';

export class Component {
  protected template: string;
  protected data: Record<string, any>;
  protected engine: MinimalTemplate;
  private element: Element | null = null;

  /**
   * Create a new component
   */
  constructor(template: string, data: Record<string, any> = {}, options: ComponentOptions = {}) {
    this.template = template;
    this.data = data;
    this.engine = new MinimalTemplate();

    if (options.autoRender && options.propsData) {
      this.update(options.propsData);
    }
  }

  /**
   * Render the component to a string
   */
  public render(): string {
    return this.engine.render(this.template, this.data);
  }

  /**
   * Mount the component to a DOM element
   */
  public mount(selector: string): Component {
    const element = document.querySelector(selector);
    if (!element) {
      throw new Error(`Element not found: ${selector}`);
    }

    element.innerHTML = this.render();
    this.element = element;

    this.mounted();
    return this;
  }

  /**
   * Update component data and optionally re-render
   */
  public update(newData: Record<string, any>, shouldRender: boolean = true): Component {
    Object.assign(this.data, newData);

    if (shouldRender && this.element) {
      this.element.innerHTML = this.render();
      this.updated();
    }

    return this;
  }

  /**
   * Get current component data
   */
  public getData(): Record<string, any> {
    return { ...this.data };
  }

  /**
   * Called after the component is mounted
   * Override in subclasses for custom behavior
   */
  protected mounted(): void { }

  /**
   * Called after the component is updated
   * Override in subclasses for custom behavior
   */
  protected updated(): void { }
}