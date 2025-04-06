# MinimalTemplate

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![npm](https://img.shields.io/badge/npm-compatible-green)

A lightweight, high-performance JavaScript template engine written in TypeScript. MinimalTemplate is designed to be minimal yet powerful, with a focus on performance and simplicity.

## ✨ Features

- 🚀 **High Performance**: Optimized parsing and rendering with intelligent caching
- 🔍 **Small Footprint**: Minimal bundle size with no dependencies
- 💪 **Type-Safe**: Full TypeScript support with comprehensive type definitions
- 🧩 **Simple Syntax**: Intuitive templating language that's easy to learn
- 🔄 **Component System**: Create reusable UI components with encapsulated logic
- 📊 **Performance Benchmarking**: Built-in tools to compare against other template engines

## 📦 Installation

```bash
npm install minimal-template-engine
```

## 🔧 Basic Usage

```typescript
import { MinimalTemplate } from 'minimal-template-engine';

// Initialize the engine
const engine = new MinimalTemplate();

// Define a template
const template = `
  <div class="greeting">
    <h1>Hello, {{ name }}!</h1>
    {{ if showWelcome }}
      <p>Welcome to our platform.</p>
    {{ /if }}
  </div>
`;

// Render with data
const html = engine.render(template, {
  name: 'John',
  showWelcome: true,
});

// Render directly to DOM
engine.renderToDOM('#app', template, {
  name: 'John',
  showWelcome: true,
});
```

## 📝 Template Syntax

### Variables

```html
<h1>{{ title }}</h1>
<p>{{ content }}</p>
```

### Conditionals

```html
{{ if isLoggedIn }}
<button>Logout</button>
{{ else }}
<button>Login</button>
{{ /if }}
```

### Loops

```html
<ul>
  {{ each item in items }}
  <li>{{ item.name }} - ${{ item.price }}</li>
  {{ /each }}
</ul>
```

### Expressions

```html
<p>Total: ${{ items.reduce((sum, item) => sum + item.price, 0).toFixed(2) }}</p>
<p>Items: {{ items.length }}</p>
```

## 🧩 Component System

Create reusable UI components with encapsulated templates and data:

```typescript
import { Component, attachEvents } from 'minimal-template-engine';

class TodoComponent extends Component {
  constructor(selector: string) {
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
        { text: 'Learn templates', completed: true },
        { text: 'Build app', completed: false },
      ],
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
        },
      },
      '.todo-checkbox': {
        change: (e) => {
          const index = parseInt(e.target.closest('li').dataset.id);
          this.data.items[index].completed = e.target.checked;
          this.mount();
        },
      },
    });
  }
}

// Initialize component
const todoComponent = new TodoComponent('#app');
todoComponent.mount();
```

## 📊 Performance Benchmarking

MinimalTemplate includes tools to benchmark against other popular template engines:

```typescript
import {
  TemplateBenchmark,
  BenchmarkVisualizer,
} from 'minimal-template-engine';

// Initialize benchmark
const benchmark = new TemplateBenchmark();

// Register engines
benchmark.registerEngine('minimal', {
  compile: (template) => new MinimalTemplate().compile(template),
  render: (template, data) => new MinimalTemplate().render(template, data),
});

// Add templates for testing
benchmark.addTemplate('simple', {
  minimal: '<div><h1>{{ title }}</h1><p>{{ content }}</p></div>',
  // Add other engines here
});

// Add test data
benchmark.setData('simple', {
  title: 'Hello World',
  content: 'This is a test',
});

// Run benchmark
const results = benchmark.runBenchmark(5000);

// Visualize results
const visualizer = new BenchmarkVisualizer(results);
visualizer.renderHTML('benchmark-results');
```

## 🔍 API Reference

### MinimalTemplate

The core template engine class.

```typescript
class MinimalTemplate {
  constructor(options?: TemplateEngineOptions);
  compile(template: string): RenderFunction;
  render(template: string, data?: Record<string, any>): string;
  renderToDOM(
    selector: string,
    template: string,
    data?: Record<string, any>,
  ): void;
}

interface TemplateEngineOptions {
  delimiters?: [string, string]; // Default: ['{{', '}}']
  debug?: boolean; // Default: false
}
```

### Component

Base class for creating reusable UI components.

```typescript
class Component {
  constructor(
    template: string,
    data?: Record<string, any>,
    options?: ComponentOptions,
  );
  render(): string;
  mount(selector: string): Component;
  update(newData: Record<string, any>, shouldRender?: boolean): Component;
  getData(): Record<string, any>;
  protected mounted(): void; // Lifecycle hook
  protected updated(): void; // Lifecycle hook
}

interface ComponentOptions {
  autoRender?: boolean;
  propsData?: Record<string, any>;
}
```

### Event Handling

Attach event handlers to elements within a component.

```typescript
function attachEvents(rootElement: Element | string, eventMap: EventMap): void;

interface EventMap {
  [selector: string]: {
    [eventName: string]: EventHandler;
  };
}

type EventHandler = (event: Event) => void;
```

## 🚀 Performance

MinimalTemplate is designed to be one of the fastest template engines available:

- **Fast Parsing**: Optimized tokenization algorithm
- **Efficient Compilation**: Templates are compiled to highly optimized JavaScript functions
- **Smart Caching**: Compiled templates are cached for repeated use
- **Minimal DOM Updates**: (Coming soon) Virtual DOM-like diffing to minimize browser reflows

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.
