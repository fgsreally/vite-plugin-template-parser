# vite-plugin-template-parser

Change the template in the .vue file (add/change/delete) =>(tags/attributes)

## use

as a tool function

```js
import { generate, HTMLparser } from " vite-plugin-template-parser";
import $AST from "trans-ast";
let str = `<template> <h1>{{ msg }}</h1>
<div anime="fgp">xx</div>
</template>`;
const node = $AST.parseAST(str);
new HTMLparser({
  node(info) {},//node operation
  text(info){}//text operation
  button(info){}//specific node operation
}).transform(node);
console.log(generate(node));//output string
```

# info variable:

```js
{
  node, //self node
    parent, //parent node
    i, //The position (number) of this node in the sibling
    brother; //Sibling nodes (without selfNode)
  find; //Find a specific grandparent node
}
```

as a vite plugin

```js
import { parser } from "vite-template-parser";
export default defineConfig({
  plugins: [
    vue(),
    parser({
      node(info, exclude) {}, //All files in node_modules are ignored
    }),
  ],
});
```

There are two types of node, Node and text

## types

```ts
export interface nodeType {
  type: number;
  tag: string;
  attrslist: Array<{ name: string; value: string }>;
  attrsMap: attrsMap;
  children: Array<nodeType | textType>;
}
interface attrsMap {
  [key: string]: string;
}

export interface textType {
  type: number;
  text: string;
  expression: string;
}
```
