import { Parser } from './parser';
import { Compiler, RenderFunction } from './compiler';
import { Renderer } from './renderer';
import { TemplateEngineOptions } from '../types';

export class MinimalTemplate {
  private parser: Parser;
  private compiler: Compiler;
  private renderer: Renderer;
  private cache: Map<string, RenderFunction>;

  constructor(options: TemplateEngineOptions = {}) {
    this.parser = new Parser(options.delimiters);
    this.compiler = new Compiler(options.debug);
    this.renderer = new Renderer();
    this.cache = new Map<string, RenderFunction>();
  }

  /**
   * Compiles a template string into a render function
   */
  public compile(template: string): RenderFunction {
    // Check cache first
    if (this.cache.has(template)) {
      return this.cache.get(template)!;
    }

    const tokens = this.parser.parse(template);
    const renderFunction = this.compiler.compile(tokens);

    // Cache the result
    this.cache.set(template, renderFunction);
    return renderFunction;
  }

  /**
   * Render a template with data
   */
  public render(template: string, data: Record<string, any> = {}): string {
    const renderFn = this.compile(template);
    return this.renderer.render(renderFn, data);
  }

  /**
   * Render to DOM element
   */
  public renderToDOM(selector: string, template: string, data: Record<string, any> = {}): void {
    const renderFn = this.compile(template);
    this.renderer.renderToDOM(renderFn, selector, data);
  }
}

export { Parser, Compiler, Renderer, RenderFunction };