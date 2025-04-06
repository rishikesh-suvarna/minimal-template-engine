export interface TemplateEngineOptions {
  delimiters?: [string, string];
  debug?: boolean;
}

export interface ComponentOptions {
  autoRender?: boolean;
  propsData?: Record<string, any>;
}