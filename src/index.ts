// src/index.ts
// Export core functionality
import { MinimalTemplate, Parser, Compiler, Renderer, RenderFunction } from './core';
export { MinimalTemplate, Parser, Compiler, Renderer, RenderFunction };

// Export component system
import { Component, attachEvents, EventMap, EventHandler } from './components';
export { Component, attachEvents, EventMap, EventHandler };

// Export type definitions
import {
  TokenType,
  BaseToken,
  TextToken,
  ExpressionToken,
  IfToken,
  ElseToken,
  EachToken,
  CloseBlockToken,
  Token,
  TemplateEngineOptions,
  ComponentOptions
} from './types';
export {
  TokenType,
  BaseToken,
  TextToken,
  ExpressionToken,
  IfToken,
  ElseToken,
  EachToken,
  CloseBlockToken,
  Token,
  TemplateEngineOptions,
  ComponentOptions
};