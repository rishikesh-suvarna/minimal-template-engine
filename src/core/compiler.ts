import { Token } from '../types';

export type RenderFunction = (data: Record<string, any>) => string;

export class Compiler {
  private debug: boolean;

  constructor(debug: boolean = false) {
    this.debug = debug;
  }

  /**
   * Compile tokens into a render function
   */
  public compile(tokens: Token[]): RenderFunction {
    let code = 'let output = "";\n';
    code += 'with (data) {\n';

    // Stack to handle nested blocks
    const blockStack: string[] = [];

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
      // Using Function constructor to create a function from string
      return new Function('data', code) as RenderFunction;
    } catch (e) {
      console.error('Error compiling template:', e);
      throw e;
    }
  }
}