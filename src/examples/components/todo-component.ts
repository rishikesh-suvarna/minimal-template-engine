// Import the Component and attachEvents from the library
import { Component, attachEvents } from '../../../dist/index.js';

export class TodoComponent extends Component {
  private selector: string;
  data: any;

  constructor(selector: string) {
    // Template definition
    const template = `
      <div class="todo-app">
        <h2>{{ title }} ({{ items.length }})</h2>
        
        <div class="add-form">
          <input type="text" class="add-input" id="new-todo" placeholder="Add new task...">
          <button class="add-button" id="add-button">Add</button>
        </div>
        
        <ul class="todo-list">
          {{ each item in items }}
            <li class="todo-item {{ item.completed ? 'completed' : '' }}" data-id="{{ $index }}">
              <input type="checkbox" class="todo-checkbox" {{ item.completed ? 'checked' : '' }}>
              <span class="todo-text">{{ item.text }}</span>
            </li>
          {{ /each }}
        </ul>
        
        <div class="todo-controls">
          <button id="clear-completed" class="clear-button">Clear Completed</button>
        </div>
      </div>
    `;

    // Initial data
    const data = {
      title: "My Tasks",
      items: [
        { text: "Learn about components", completed: true },
        { text: "Build a todo app", completed: false },
        { text: "Add event handling", completed: false }
      ]
    };

    super(template, data);
    this.selector = selector;
  }

  // Lifecycle method called after mounting
  mount(): this {
    super.mount(this.selector);
    this._setupEvents();
    return this;
  }

  // Set up event handlers
  private _setupEvents(): void {
    const root = document.querySelector(this.selector);

    if (!root) {
      console.error(`Element not found: ${this.selector}`);
      return;
    }

    attachEvents(root, {
      '#add-button': {
        click: this._handleAddTask.bind(this)
      },
      '.todo-checkbox': {
        change: this._handleToggleComplete.bind(this)
      },
      '#clear-completed': {
        click: this._handleClearCompleted.bind(this)
      }
    });
  }

  // Event handlers
  private _handleAddTask(e: Event): void {
    const input = document.querySelector('#new-todo') as HTMLInputElement;

    if (!input) return;

    const text = input.value.trim();

    if (text) {
      // Access data from base class
      const data = this.getData();
      data.items.push({ text, completed: false });

      // Update data and re-render
      this.update(data);
      input.value = '';
    }
  }
  getData() {
    return this.data;
  }
  update(newData: Record<string, any>, shouldRender: boolean = true): this {
    this.data = { ...this.data, ...newData };
    if (shouldRender) {
      this.render();
    }
    return this;
  }

  private _handleToggleComplete(e: Event): void {
    const target = e.target as HTMLInputElement;
    const li = target.closest('li');

    if (!li) return;

    const index = parseInt(li.dataset.id || '0', 10);
    const data = this.getData();

    if (data.items[index]) {
      data.items[index].completed = target.checked;
      this.update(data);
    }
  }

  private _handleClearCompleted(): void {
    const data = this.getData();
    data.items = data.items.filter((item: { completed: boolean }) => !item.completed);
    this.update(data);
  }
}

// Initialize component when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const todoComponent = new TodoComponent('#todo-app-container');
  todoComponent.mount();
});