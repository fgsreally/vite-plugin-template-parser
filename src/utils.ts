import { parserConfig, nodeType, textType } from "./types";

export function generate(node: any) {
  if (node.type === 2) return node.text;
  return `<${node.tag} ${node.attrslist.reduce(
    (acc: string, cur: { name: any; value: any }) => {
      return (
        acc +
        " " +
        (cur.value === undefined ? `${cur.name}` : `${cur.name}="${cur.value}"`)
      );
    },
    ""
  )}>${node.children.reduce((acc: any, cur: any) => {
    return acc + generate(cur);
  }, "")}</${node.tag}>`;
}
// function transform(node) {}

export class HTMLparser {
  config: parserConfig;
  stack: Array<nodeType | textType>;
  index: number;
  sibling: Array<nodeType | textType>;
  constructor(opt: parserConfig) {
    this.config = opt;
    this.stack = [];
    this.sibling = [];

    this.index = 0;
  }
  get parent() {
    return this.stack[1];
  }
  get node() {
    return this.stack[0];
  }
  get brother() {
    return this.sibling;
  }
  get i() {
    return this.index;
  }
  find(cb: any) {
    return this.stack.find(cb);
  }
  transform(node: nodeType | textType) {
    this.stack.unshift(node);
    if (node.type === 1) {
      (node as any).attrslist.forEach(
        (attr: { name: string; value: undefined | string }) => {
          if (!attr.value) {
            attr.name = ":" + attr.name;
            attr.value = "true";
          }
          return attr;
        }
      );
      this.config.node && this.config.node(this);
    } else {
      this.config.text && this.config.text(this);
      this.stack.shift();
      return;
    }
    this.config[node.type] && this.config[node.type](this);
    (node as nodeType).children.map((item, i) => {
      this.index = i;
      this.sibling = (node as nodeType).children.filter((ele, index) => {
        return index !== i;
      });
      this.transform(item);
    });
    this.stack.shift();
  }
}
