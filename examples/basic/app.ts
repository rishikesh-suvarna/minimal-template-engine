import { MinimalTemplate } from '../../dist/index.js';

// Initialize the template engine
const engine = new MinimalTemplate();

// Simple Example
const simpleTemplate = `
  <div class="user-card">
    <h3>Hello, {{ name }}!</h3>
    <p>Your role: {{ role }}</p>
  </div>
`;

let simpleData = {
  name: "John Smith",
  role: "Developer"
};

engine.renderToDOM('#simple-example', simpleTemplate, simpleData);

// Update button handler
document.getElementById('update-simple')?.addEventListener('click', () => {
  // Toggle between two users
  if (simpleData.name === "John Smith") {
    simpleData = {
      name: "Jane Doe",
      role: "Designer"
    };
  } else {
    simpleData = {
      name: "John Smith",
      role: "Developer"
    };
  }

  engine.renderToDOM('#simple-example', simpleTemplate, simpleData);
});

// Conditional Example
const conditionalTemplate = `
  <div class="product-info">
    <h3>{{ product.name }}</h3>
    <p>{{ product.description }}</p>
    <p>Price: {{ product.price }}</p>
    
    {{ if product.inStock }}
      <button class="buy-btn">Add to Cart</button>
    {{ else }}
      <p class="out-of-stock">Currently Out of Stock</p>
    {{ /if }}
  </div>
`;

const productData = {
  product: {
    name: "Smart Watch",
    description: "Latest smartwatch with health tracking features",
    price: 249.99,
    inStock: true
  }
};

engine.renderToDOM('#conditional-example', conditionalTemplate, productData);

// Toggle stock button handler
document.getElementById('toggle-stock')?.addEventListener('click', () => {
  productData.product.inStock = !productData.product.inStock;
  engine.renderToDOM('#conditional-example', conditionalTemplate, productData);
});

// Loop Example
const loopTemplate = `
  <div class="task-list">
    <h3>Tasks ({{ tasks.length }})</h3>
    <ul>
      {{ each task in tasks }}
        <li class="{{ task.completed ? 'completed' : '' }}">
          {{ task.title }} 
          {{ if task.completed }}
            <span>✓</span>
          {{ /if }}
        </li>
      {{ /each }}
    </ul>
    <p>Completed: {{ tasks.filter(t => t.completed).length }} / {{ tasks.length }}</p>
  </div>
`;

const tasksData = {
  tasks: [
    { title: "Learn JavaScript", completed: true },
    { title: "Build a template engine", completed: false },
    { title: "Create documentation", completed: false },
    { title: "Write tests", completed: true }
  ]
};

engine.renderToDOM('#loop-example', loopTemplate, tasksData);

// Add task button handler
document.getElementById('add-task')?.addEventListener('click', () => {
  const tasks = tasksData.tasks;
  tasksData.tasks.push({
    title: `New task ${tasks.length + 1}`,
    completed: false
  });

  engine.renderToDOM('#loop-example', loopTemplate, tasksData);
});

// Complete task button handler
document.getElementById('complete-task')?.addEventListener('click', () => {
  const nextIncompleteTask = tasksData.tasks.find(task => !task.completed);

  if (nextIncompleteTask) {
    nextIncompleteTask.completed = true;
    engine.renderToDOM('#loop-example', loopTemplate, tasksData);
  }
});