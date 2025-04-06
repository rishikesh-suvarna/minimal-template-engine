
import { BenchmarkResults } from './engine';

export class BenchmarkVisualizer {
  private results: BenchmarkResults;

  constructor(results: BenchmarkResults) {
    this.results = results;
  }

  /**
   * Format results as markdown table
   */
  public formatMarkdown(): string {
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

    // Render results
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

  /**
   * Render results to HTML
   */
  public renderHTML(containerId: string): void {
    const container = document.getElementById(containerId);
    if (!container) return;

    let html = '<div class="benchmark-results">';

    // Compile results
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

    // Render results
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