export interface TemplateEngine {
  compile: (template: string) => any;
  render: (template: string, data: Record<string, any>) => string;
}

export interface BenchmarkResult {
  time: number;
  opsPerSec: number;
}

export interface TemplateEngineResults {
  [engineName: string]: BenchmarkResult;
}

export interface BenchmarkResults {
  compile: {
    [templateName: string]: TemplateEngineResults;
  };
  render: {
    [templateName: string]: TemplateEngineResults;
  };
}

export class TemplateBenchmark {
  private engines: Record<string, TemplateEngine> = {};
  private templates: Record<string, Record<string, string>> = {};
  private data: Record<string, Record<string, any>> = {};
  private results: BenchmarkResults = { compile: {}, render: {} };

  /**
   * Register a template engine for benchmarking
   */
  public registerEngine(name: string, engine: TemplateEngine): void {
    this.engines[name] = engine;
  }

  /**
   * Add a template to benchmark
   */
  public addTemplate(name: string, templates: Record<string, string>): void {
    this.templates[name] = templates;
  }

  /**
   * Set data for templates
   */
  public setData(name: string, data: Record<string, any>): void {
    this.data[name] = data;
  }

  /**
   * Run compile benchmark
   */
  public benchmarkCompile(templateName: string, iterations: number = 1000): TemplateEngineResults {
    const template = this.templates[templateName];
    const results: TemplateEngineResults = {};

    for (const [engineName, engine] of Object.entries(this.engines)) {
      if (!template[engineName]) continue;

      const start = performance.now();

      for (let i = 0; i < iterations; i++) {
        engine.compile(template[engineName]);
      }

      const end = performance.now();
      results[engineName] = {
        time: end - start,
        opsPerSec: Math.floor(iterations / ((end - start) / 1000))
      };
    }

    return results;
  }

  /**
   * Run render benchmark
   */
  public benchmarkRender(templateName: string, iterations: number = 1000): TemplateEngineResults {
    const template = this.templates[templateName];
    const data = this.data[templateName];
    const results: TemplateEngineResults = {};

    for (const [engineName, engine] of Object.entries(this.engines)) {
      if (!template[engineName]) continue;

      // Pre-compile
      const compiled = engine.compile(template[engineName]);

      const start = performance.now();

      for (let i = 0; i < iterations; i++) {
        if (typeof compiled === 'function') {
          compiled(data);
        } else {
          engine.render(template[engineName], data);
        }
      }

      const end = performance.now();
      results[engineName] = {
        time: end - start,
        opsPerSec: Math.floor(iterations / ((end - start) / 1000))
      };
    }

    return results;
  }

  /**
   * Run a complete benchmark suite
   */
  public runBenchmark(iterations: number = 1000): BenchmarkResults {
    const results: BenchmarkResults = {
      compile: {},
      render: {}
    };

    for (const templateName of Object.keys(this.templates)) {
      results.compile[templateName] = this.benchmarkCompile(templateName, iterations);
      results.render[templateName] = this.benchmarkRender(templateName, iterations);
    }

    this.results = results;
    return results;
  }

  /**
   * Get all benchmark results
   */
  public getResults(): BenchmarkResults {
    return this.results;
  }
}