/**
 * Demo app for MinimalTemplate engine
 */

import { MinimalTemplate, Component, attachEvents } from '../dist/index.js'
import { TemplateBenchmark } from '../dist/benchmark.js';

// Initialize template engine
const engine = new MinimalTemplate({ debug: true });

// Example 1: Simple template with variables
document.addEventListener('DOMContentLoaded', () => {
  const simpleTemplate = `
    <div class="user-card">
      <h2>Hello, {{ name }}!</h2>
      <p>Your role is: {{ role }}</p>
    </div>
  `;

  const userData = {
    name: 'John Doe',
    role: 'Developer'
  };

  engine.renderToDOM('#simple-example', simpleTemplate, userData);

  // Example 2: Conditional rendering
  const conditionalTemplate = `
    <div class="product-card">
      <h3>{{ product.name }}</h3>
      <p>{{ product.description }}</p>
      <p>Price: {{ product.price }}</p>
      
      {{ if product.inStock }}
        <button class="buy-button">Buy Now</button>
      {{ else }}
        <p class="out-of-stock">Out of Stock</p>
      {{ /if }}
    </div>
  `;

  const productData = {
    product: {
      name: 'Smartphone',
      description: 'Latest model with amazing features',
      price: 999.99,
      inStock: true
    }
  };

  engine.renderToDOM('#conditional-example', conditionalTemplate, productData);

  // Example 3: List rendering
  const listTemplate = `
    <div class="todo-list">
      <h3>Todo List</h3>
      <ul>
        {{ each item in items }}
          <li class="{{ item.completed ? 'completed' : '' }}">
            {{ item.text }} 
            {{ if item.completed }}
              <span class="badge">Done</span>
            {{ /if }}
          </li>
        {{ /each }}
      </ul>
      <p>Completed: {{ items.filter(i => i.completed).length }} / {{ items.length }}</p>
    </div>
  `;

  const todoData = {
    items: [
      { text: 'Learn JavaScript', completed: true },
      { text: 'Build a template engine', completed: false },
      { text: 'Write documentation', completed: false },
      { text: 'Create examples', completed: true }
    ]
  };

  engine.renderToDOM('#list-example', listTemplate, todoData);

  // Example 4: Reusable component
  class TodoComponent extends Component {
    constructor(selector) {
      const template = `
        <div class="todo-app">
          <h3>{{ title }}</h3>
          <ul>
            {{ each item in items }}
              <li data-id="{{ $index }}" class="{{ item.completed ? 'completed' : '' }}">
                <input type="checkbox" {{ item.completed ? 'checked' : '' }} class="todo-checkbox">
                <span>{{ item.text }}</span>
              </li>
            {{ /each }}
          </ul>
          <div class="add-todo">
            <input type="text" id="new-todo" placeholder="Add new item...">
            <button id="add-button">Add</button>
          </div>
        </div>
      `;
      
      const data = {
        title: 'My Tasks',
        items: [
          { text: 'Learn about template engines', completed: true },
          { text: 'Build a project', completed: false },
          { text: 'Share with others', completed: false }
        ]
      };
      
      super(template, data);
      this.selector = selector;
    }
    
    mount() {
      super.mount(this.selector);
      this._setupEvents();
      return this;
    }
    
    _setupEvents() {
      const root = document.querySelector(this.selector);
      
      attachEvents(root, {
        '#add-button': {
          click: (e) => {
            const input = root.querySelector('#new-todo');
            const text = input.value.trim();
            
            if (text) {
              this.data.items.push({ text, completed: false });
              input.value = '';
              this.mount();
            }
          }
        },
        '.todo-checkbox': {
          change: (e) => {
            const index = parseInt(e.target.closest('li').dataset.id);
            this.data.items[index].completed = e.target.checked;
            this.mount();
          }
        }
      });
    }
  }

  // Initialize component
  const todoComponent = new TodoComponent('#component-example');
  todoComponent.mount();

  // Run benchmark if benchmark section exists
  if (document.getElementById('benchmark-results')) {
    runBenchmark();
  }
});

// Benchmark function
function runBenchmark() {
  const benchmark = new TemplateBenchmark();

  // Add templates for benchmarking
  benchmark.addTemplate('simple', {
    minimal: '<div><h1>{{ title }}</h1><p>{{ content }}</p></div>',
    // Add other engines' templates here with equivalent functionality
  });

  benchmark.addTemplate('complex', {
    minimal: `
      <div>
        <h1>{{ title }}</h1>
        {{ if showDetails }}
          <div class="details">
            {{ each item in items }}
              <div class="item {{ item.highlighted ? 'highlight' : '' }}">
                <h3>{{ item.name }}</h3>
                <p>{{ item.description }}</p>
              </div>
            {{ /each }}
          </div>
        {{ else }}
          <p>Click to show details</p>
        {{ /if }}
      </div>
    `,
    // Add other engines' templates here with equivalent functionality
  });

  // Add data for templates
  benchmark.setData('simple', {
    title: 'Hello World',
    content: 'This is a simple template'
  });

  benchmark.setData('complex', {
    title: 'Complex Template',
    showDetails: true,
    items: Array(20).fill(0).map((_, i) => ({
      name: `Item ${i+1}`,
      description: `Description for item ${i+1}`,
      highlighted: i % 3 === 0
    }))
  });

  // Run benchmark
  const results = benchmark.runBenchmark(5000);
  
  // Display results
  benchmark.visualizeResults('benchmark-results');
}

// Export for usage in HTML script tag
window.demo = {
  engine,
  runBenchmark
};