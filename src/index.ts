/**
 * * MinimalTemplate - A lightweight, high-performance template engine
 */

class MinimalTemplate {
  cache: Map<any, any>;
  delimiters: any;
  debug: any;
  constructor(options: { delimiters?: [string, string]; debug?: boolean } = {}) {
    this.cache = new Map();
    this.delimiters = options.delimiters || ['{{', '}}'];
    this.debug = options.debug || false;
  }


  compile(template: any) {
    // Check cache first
    if (this.cache.has(template)) {
      return this.cache.get(template);
    }

    const tokens = this._parseTemplate(template);
    const renderFunction = this._compileTokens(tokens);

    // Cache the result
    this.cache.set(template, renderFunction);
    return renderFunction;
  }

  _parseTemplate(template: string) {
    const tokens = [];
    const [openDelimiter, closeDelimiter] = this.delimiters;
    let currentPosition = 0;
    let textBuffer = '';

    // Helper to add text token
    const addTextToken = () => {
      if (textBuffer) {
        tokens.push({ type: 'text', value: textBuffer });
        textBuffer = '';
      }
    };

    while (currentPosition < template.length) {
      // Find opening delimiter
      const openTagPos = template.indexOf(openDelimiter, currentPosition);

      // If no more delimiters, add the rest as text and break
      if (openTagPos === -1) {
        textBuffer += template.slice(currentPosition);
        break;
      }

      // Add text before delimiter
      textBuffer += template.slice(currentPosition, openTagPos);

      // Find closing delimiter
      const closeTagPos = template.indexOf(closeDelimiter, openTagPos + openDelimiter.length);

      if (closeTagPos === -1) {
        // No closing delimiter found, treat as text
        textBuffer += template.slice(openTagPos);
        break;
      }

      // Add accumulated text as token
      addTextToken();

      // Extract expression content
      const expressionContent = template.slice(
        openTagPos + openDelimiter.length,
        closeTagPos
      ).trim();

      // Process different expression types
      if (expressionContent.startsWith('if ')) {
        tokens.push({
          type: 'if',
          condition: expressionContent.slice(3).trim()
        });
      } else if (expressionContent === 'else') {
        tokens.push({ type: 'else' });
      } else if (expressionContent.startsWith('each ')) {
        const [itemName, , collectionName] = expressionContent.slice(5).split(/\s+in\s+/);
        tokens.push({
          type: 'each',
          item: itemName.trim(),
          collection: collectionName.trim()
        });
      } else if (expressionContent === '/if' || expressionContent === '/each') {
        tokens.push({
          type: 'closeBlock',
          blockType: expressionContent.slice(1)
        });
      } else {
        // Regular expression
        tokens.push({
          type: 'expression',
          value: expressionContent
        });
      }

      // Update position
      currentPosition = closeTagPos + closeDelimiter.length;
    }

    // Add any remaining text
    addTextToken();

    return tokens;
  }

  _compileTokens(tokens: string | any[]) {
    let code = 'let output = "";\n';
    code += 'with (data) {\n';

    // Stack to handle nested blocks
    const blockStack = [];

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];

      switch (token.type) {
        case 'text':
          code += `  output += ${JSON.stringify(token.value)};\n`;
          break;

        case 'expression':
          // Safely handle undefined values
          code += `  output += (${token.value} !== undefined ? ${token.value} : '');\n`;
          break;

        case 'if':
          code += `  if (${token.condition}) {\n`;
          blockStack.push('if');
          break;

        case 'else':
          if (blockStack[blockStack.length - 1] === 'if') {
            code += '  } else {\n';
          } else {
            throw new Error("'else' without matching 'if'");
          }
          break;

        case 'each':
          code += `  for (let i = 0; i < ${token.collection}.length; i++) {\n`;
          code += `    const ${token.item} = ${token.collection}[i];\n`;
          code += `    const $index = i;\n`;
          blockStack.push('each');
          break;

        case 'closeBlock':
          const blockType = blockStack.pop();
          if (blockType !== token.blockType) {
            throw new Error(`Mismatched block closing: expected '${blockType}', got '${token.blockType}'`);
          }
          code += '  }\n';
          break;
      }
    }

    code += '}\n';
    code += 'return output;';

    if (this.debug) {
      console.log('Generated function:');
      console.log(code);
    }

    try {
      return new Function('data', code);
    } catch (e) {
      console.error('Error compiling template:', e);
      throw e;
    }
  }

  render(template: any, data = {}) {
    const renderFn = this.compile(template);
    return renderFn(data);
  }

  renderToDOM(selector: any, template: any, data = {}) {
    const element = document.querySelector(selector);
    if (!element) {
      throw new Error(`Element not found: ${selector}`);
    }
    element.innerHTML = this.render(template, data);
  }
}

class Component {
  template: any;
  data: {};
  engine: MinimalTemplate;
  constructor(template: any, data = {}) {
    this.template = template;
    this.data = data;
    this.engine = new MinimalTemplate();
  }

  render() {
    return this.engine.render(this.template, this.data);
  }

  mount(selector: any) {
    const element = document.querySelector(selector);
    if (!element) {
      throw new Error(`Element not found: ${selector}`);
    }
    element.innerHTML = this.render();
    return this;
  }

  update(newData: any) {
    Object.assign(this.data, newData);
    return this;
  }
}

function attachEvents(rootElement: { querySelectorAll: (arg0: any) => any; }, eventMap: { [selector: string]: { [eventName: string]: EventListener } }) {
  for (const [selector, events] of Object.entries(eventMap)) {
    const elements = rootElement.querySelectorAll(selector);

    for (const [eventName, handler] of Object.entries(events)) {
      elements.forEach((element: { addEventListener: (arg0: any, arg1: any) => void; }) => {
        element.addEventListener(eventName, handler);
      });
    }
  }
}

export { MinimalTemplate, Component, attachEvents };