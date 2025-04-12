// Import the template engine
// In a real project, you would import from the npm package:
// import { MinimalTemplate } from 'minimal-template-engine';
import { MinimalTemplate } from '../../dist/index.js';

// Initialize the template engine
const engine = new MinimalTemplate();

// Wait for the DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
  // ------------------------
  // Basic Example
  // ------------------------
  const basicTemplate = `
    <div>
      <h3>Hello, {{ name }}!</h3>
      <p>Welcome to {{ company }}.</p>
    </div>
  `;

  let basicData = {
    name: 'John',
    company: 'Acme Corp',
  };

  // Render the basic example
  document.getElementById('basic-example').innerHTML = engine.render(
    basicTemplate,
    basicData,
  );

  // Handle update button click
  document.getElementById('update-basic').addEventListener('click', () => {
    // Toggle between two data sets
    if (basicData.name === 'John') {
      basicData = {
        name: 'Jane',
        company: 'TechHub Inc.',
      };
    } else {
      basicData = {
        name: 'John',
        company: 'Acme Corp',
      };
    }

    // Re-render with new data
    document.getElementById('basic-example').innerHTML = engine.render(
      basicTemplate,
      basicData,
    );
  });

  // ------------------------
  // Conditional Example
  // ------------------------
  const conditionalTemplate = `
    <div class="user-profile">
      <h3>{{ user.name }}</h3>
      
      {{ if user.isAdmin }}
        <span class="badge" style="background-color: #e74c3c; color: white; padding: 3px 8px; border-radius: 3px; font-size: 12px;">Administrator</span>
        <div class="admin-controls" style="margin-top: 10px;">
          <button style="background-color: #34495e; color: white; border: none; padding: 5px 10px; border-radius: 3px; font-size: 12px;">Manage Users</button>
        </div>
      {{ else }}
        <span class="badge" style="background-color: #3498db; color: white; padding: 3px 8px; border-radius: 3px; font-size: 12px;">User</span>
      {{ /if }}
      
      <p>Last login: {{ user.lastLogin }}</p>
    </div>
  `;

  const conditionalData = {
    user: {
      name: 'Sarah Johnson',
      isAdmin: true,
      lastLogin: 'Yesterday at 2:30 PM',
    },
  };

  // Render the conditional example
  document.getElementById('conditional-example').innerHTML = engine.render(
    conditionalTemplate,
    conditionalData,
  );

  // Handle toggle button click
  document.getElementById('toggle-admin').addEventListener('click', () => {
    // Toggle admin status
    conditionalData.user.isAdmin = !conditionalData.user.isAdmin;

    // Re-render with updated data
    document.getElementById('conditional-example').innerHTML = engine.render(
      conditionalTemplate,
      conditionalData,
    );
  });

  // ------------------------
  // Loop Example
  // ------------------------
  const loopTemplate = `
    <div class="product-list">
      <h3>Products ({{ products.length }})</h3>
      
      <ul style="list-style-type: none; padding: 0;">
        {{ each product in products }}
          <li style="margin-bottom: 10px; padding: 8px; border-left: 3px solid {{ product.inStock ? '#2ecc71' : '#e74c3c' }}; background-color: #f8f9fa;">
            <strong>{{ product.name }}</strong> - {{ product.price }}
            
            {{ if !product.inStock }}
              <span style="color: #e74c3c; font-size: 12px; margin-left: 10px;">Out of Stock</span>
            {{ /if }}
          </li>
        {{ /each }}
      </ul>
      
      <p>Total value: {{ products.reduce((sum, p) => sum + p.price, 0).toFixed(2) }}</p>
    </div>
  `;

  const loopData = {
    products: [
      { name: 'Laptop', price: 999.99, inStock: true },
      { name: 'Smartphone', price: 699.99, inStock: true },
      { name: 'Headphones', price: 149.99, inStock: false },
      { name: 'Tablet', price: 399.99, inStock: true },
    ],
  };

  // Render the loop example
  document.getElementById('loop-example').innerHTML = engine.render(
    loopTemplate,
    loopData,
  );

  // Handle add product button click
  document.getElementById('add-product').addEventListener('click', () => {
    // Add a new product
    loopData.products.push({
      name: `New Product ${loopData.products.length + 1}`,
      price: Math.round(Math.random() * 500 + 99) / 100,
      inStock: Math.random() > 0.3,
    });

    // Re-render with updated data
    document.getElementById('loop-example').innerHTML = engine.render(
      loopTemplate,
      loopData,
    );
  });

  // Handle toggle stock button click
  document.getElementById('toggle-stock').addEventListener('click', () => {
    // Toggle stock status of all products
    loopData.products.forEach((product) => {
      product.inStock = !product.inStock;
    });

    // Re-render with updated data
    document.getElementById('loop-example').innerHTML = engine.render(
      loopTemplate,
      loopData,
    );
  });

  // ------------------------
  // DOM Rendering Example
  // ------------------------
  const domTemplate = `
    <div class="counter-widget">
      <h3>Counter: {{ count }}</h3>
      <p style="color: {{ count % 2 === 0 ? '#2980b9' : '#8e44ad' }};">
        {{ count % 2 === 0 ? 'Even' : 'Odd' }} number
      </p>
    </div>
  `;

  const domData = { count: 0 };

  // Render directly to DOM
  engine.renderToDOM('#dom-example-output', domTemplate, domData);

  // Handle increment button click
  document.getElementById('increment-counter').addEventListener('click', () => {
    domData.count++;
    engine.renderToDOM('#dom-example-output', domTemplate, domData);
  });

  // Handle reset button click
  document.getElementById('reset-counter').addEventListener('click', () => {
    domData.count = 0;
    engine.renderToDOM('#dom-example-output', domTemplate, domData);
  });
});
