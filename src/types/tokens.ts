export type TokenType = 'text' | 'expression' | 'if' | 'else' | 'each' | 'closeBlock';

export interface BaseToken {
  type: TokenType;
}

export interface TextToken extends BaseToken {
  type: 'text';
  value: string;
}

export interface ExpressionToken extends BaseToken {
  type: 'expression';
  value: string;
}

export interface IfToken extends BaseToken {
  type: 'if';
  condition: string;
}

export interface ElseToken extends BaseToken {
  type: 'else';
}

export interface EachToken extends BaseToken {
  type: 'each';
  item: string;
  collection: string;
}

export interface CloseBlockToken extends BaseToken {
  type: 'closeBlock';
  blockType: string;
}

export type Token =
  | TextToken
  | ExpressionToken
  | IfToken
  | ElseToken
  | EachToken
  | CloseBlockToken;
