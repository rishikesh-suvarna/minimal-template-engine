import { Token, TextToken, ExpressionToken, IfToken, ElseToken, EachToken, CloseBlockToken } from '../types';

export class Parser {
  private delimiters: [string, string];

  constructor(delimiters: [string, string] = ['{{', '}}']) {
    this.delimiters = delimiters;
  }

  /**
   * Parse a template string into tokens
   */
  public parse(template: string): Token[] {
    const tokens: Token[] = [];
    const [openDelimiter, closeDelimiter] = this.delimiters;
    let currentPosition = 0;
    let textBuffer = '';

    // Helper to add text token
    const addTextToken = (): void => {
      if (textBuffer) {
        tokens.push({ type: 'text', value: textBuffer } as TextToken);
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
      const closeTagPos = template.indexOf(
        closeDelimiter,
        openTagPos + openDelimiter.length
      );

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
        } as IfToken);
      } else if (expressionContent === 'else') {
        tokens.push({ type: 'else' } as ElseToken);
      } else if (expressionContent.startsWith('each ')) {
        const [itemPart, collectionPart] = expressionContent.slice(5).split(/\s+in\s+/);
        tokens.push({
          type: 'each',
          item: itemPart.trim(),
          collection: collectionPart.trim()
        } as EachToken);
      } else if (expressionContent === '/if' || expressionContent === '/each') {
        tokens.push({
          type: 'closeBlock',
          blockType: expressionContent.slice(1)
        } as CloseBlockToken);
      } else {
        // Regular expression
        tokens.push({
          type: 'expression',
          value: expressionContent
        } as ExpressionToken);
      }

      // Update position
      currentPosition = closeTagPos + closeDelimiter.length;
    }

    // Add any remaining text
    addTextToken();

    return tokens;
  }
}