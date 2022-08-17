export interface parserConfig {
  [key: string]: Function;
}

export interface nodeType {
  type: number;
  tag: string;
  attrslist: Array<{ name: string; value: string }>;
  attrsMap: attrsMap;
  children:Array<nodeType | textType>;
}
interface attrsMap {
  [key: string]: string;
}

export interface textType {
  type: number;
  text: string;
  expression: string;
}
