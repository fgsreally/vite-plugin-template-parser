# vite-plugin-template-parser

对.vue 文件中的 template 进行更改，增加/改变/删去 => 标签/属性


## 使用
作为工具函数使用

```js
import { generate, HTMLparser } from " vite-plugin-template-parser";
import $AST from "trans-ast";

let str = `<template> <h1>{{ msg }}</h1>
<div anime="fgp">xx</div>
</template>`;
const node = $AST.parseAST(str);
new HTMLparser({
  node(info) {},//对节点的操作
  text(info){}//对文本的操作
  button(info){}//对特定标签的操作
}).transform(node);
console.log(generate(node));//output string
```
info 中的变量

```js
{
  node, //本节点
    parent, //父节点
    i, //本节点在同级中的位置（第几个
    brother; //兄弟（不包括自己）
  find; //找到特定的祖辈节点
}
```


vite 插件中：

```js
import { parser } from "vite-template-parser";
export default defineConfig({
  plugins: [
    vue(),
    parser({
      node(info,exclude) {},//会忽略所有node_modules中的文件
    }),
  ],
});
```

其中 node 有两类，一个是 node,一个是 text，分别类型如下

## 类型
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


