/**
 * * Benchmark utility for template engines
 */

import { MinimalTemplate } from './index';


class TemplateBenchmark {
  engines: { [key: string]: { compile: (template: any) => any; render: (template: any, data: any) => any } };
  templates: { [key: string]: any };
  data: { [key: string]: any };
  results: {
    compile: { [key: string]: { [key: string]: { time: number; opsPerSec: number } } };
    render: { [key: string]: { [key: string]: { time: number; opsPerSec: number } } };
  };
  constructor() {
    this.engines = {};
    this.templates = {};
    this.data = {};
    this.results = {
      compile: {},
      render: {}
    };

    this.registerEngine('minimal', {
      compile: (template: any) => {
        const engine = new MinimalTemplate();
        return engine.compile(template);
      },
      render: (template: any, data: {} | undefined) => {
        const engine = new MinimalTemplate();
        return engine.render(template, data);
      }
    });

  }

  registerEngine(name: string, engine: { compile: (template: any) => any; render: (template: any, data: any) => any; }) {
    this.engines[name] = engine;
  }

  addTemplate(name: string | number, templates: any) {
    this.templates[name] = templates;
  }

  setData(name: string | number, data: any) {
    this.data[name] = data;
  }

  benchmarkCompile(templateName: string, iterations = 1000) {
    const template = this.templates[templateName];
    const results: { [key: string]: { time: number; opsPerSec: number } } = {};

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

  benchmarkRender(templateName: string, iterations = 1000) {
    const template = this.templates[templateName];
    const data = this.data[templateName];
    const results: { [key: string]: { time: number; opsPerSec: number } } = {};

    for (const [engineName, engine] of Object.entries(this.engines)) {
      if (!template[engineName]) continue;

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

  runBenchmark(iterations = 1000) {
    const results: { compile: { [key: string]: { [key: string]: { time: number; opsPerSec: number } } }, render: { [key: string]: { [key: string]: { time: number; opsPerSec: number } } } } = {
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

  formatResults() {
    let output = '';

    // Compile results
    output += '## Compile Performance\n\n';
    output += '| Template | Engine | Time (ms) | Ops/sec |\n';
    output += '|----------|--------|-----------|--------|\n';

    for (const [templateName, results] of Object.entries(this.results.compile)) {
      for (const [engineName, result] of Object.entries(results)) {
        output += `| ${templateName} | ${engineName} | ${result.time.toFixed(2)} | ${result.opsPerSec.toLocaleString()} |\n`;
      }
    }

    output += '\n## Render Performance\n\n';
    output += '| Template | Engine | Time (ms) | Ops/sec |\n';
    output += '|----------|--------|-----------|--------|\n';

    for (const [templateName, results] of Object.entries(this.results.render)) {
      for (const [engineName, result] of Object.entries(results)) {
        output += `| ${templateName} | ${engineName} | ${result.time.toFixed(2)} | ${result.opsPerSec.toLocaleString()} |\n`;
      }
    }

    return output;
  }

  visualizeResults(containerId: string) {
    const container = document.getElementById(containerId);
    if (!container) return;

    let html = '<div class="benchmark-results">';

    html += '<h2>Compile Performance</h2>';
    html += '<table border="1">';
    html += '<tr><th>Template</th><th>Engine</th><th>Time (ms)</th><th>Ops/sec</th></tr>';

    for (const [templateName, results] of Object.entries(this.results.compile)) {
      for (const [engineName, result] of Object.entries(results)) {
        html += `<tr>
          <td>${templateName}</td>
          <td>${engineName}</td>
          <td>${result.time.toFixed(2)}</td>
          <td>${result.opsPerSec.toLocaleString()}</td>
        </tr>`;
      }
    }

    html += '</table>';

    html += '<h2>Render Performance</h2>';
    html += '<table border="1">';
    html += '<tr><th>Template</th><th>Engine</th><th>Time (ms)</th><th>Ops/sec</th></tr>';

    for (const [templateName, results] of Object.entries(this.results.render)) {
      for (const [engineName, result] of Object.entries(results)) {
        html += `<tr>
          <td>${templateName}</td>
          <td>${engineName}</td>
          <td>${result.time.toFixed(2)}</td>
          <td>${result.opsPerSec.toLocaleString()}</td>
        </tr>`;
      }
    }

    html += '</table>';
    html += '</div>';

    container.innerHTML = html;
  }
}

export { TemplateBenchmark };