/**
 * Template cache for improved performance.
 * Stores compiled templates for reuse.
 */

import { RenderFunction } from '../core/compiler';

export class TemplateCache {
  private cache: Map<string, RenderFunction>;
  private maxSize: number;

  /**
   * Create a new template cache
   * @param maxSize Maximum number of templates to cache (default: 100)
   */
  constructor(maxSize: number = 100) {
    this.cache = new Map<string, RenderFunction>();
    this.maxSize = maxSize;
  }

  /**
   * Get a template from the cache
   * @param key Template key (usually the template string itself)
   * @returns Cached render function or undefined if not found
   */
  public get(key: string): RenderFunction | undefined {
    const item = this.cache.get(key);

    if (item) {
      // Move to end of Map to implement LRU behavior
      this.cache.delete(key);
      this.cache.set(key, item);
    }

    return item;
  }

  /**
   * Set a template in the cache
   * @param key Template key (usually the template string itself)
   * @param value Compiled render function
   */
  public set(key: string, value: RenderFunction): void {
    // If cache is full, remove oldest item (first item in map)
    if (this.cache.size >= this.maxSize && !this.cache.has(key)) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey !== undefined) {
        this.cache.delete(firstKey);
      }
    }

    this.cache.set(key, value);
  }

  /**
   * Check if a template exists in the cache
   * @param key Template key
   * @returns True if the template is cached
   */
  public has(key: string): boolean {
    return this.cache.has(key);
  }

  /**
   * Remove a template from the cache
   * @param key Template key
   * @returns True if the template was in the cache
   */
  public delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * Clear the entire cache
   */
  public clear(): void {
    this.cache.clear();
  }

  /**
   * Get the number of templates in the cache
   */
  public get size(): number {
    return this.cache.size;
  }
}