import { test, expect } from "vitest";
import $AST from "trans-ast";
import { generate, HTMLparser } from "../src/utils";

test("add decorator tag", () => {
  let str = `<template> <h1>{{ msg }}</h1>
<div anime="fgp">xx</div>

</template>`;
  const node = $AST.parseAST(str);
  new HTMLparser({
    node({ node: n, parent, i }) {
      if (n.attrsMap.anime) {
        parent.children.splice(i, 1, {
          type: 1,
          tag: "transition",
          attrsMap: {},
          attrslist: [
            {
              name: "name",
              value: n.attrslist.find((i) => i.name === "anime").value,
            },
          ],
          children: [n],
        });
      }
    },
  }).transform(node);

  expect(generate(node)).toBe(
    `<template ><h1 >{{ msg }}</h1><transition  name="fgp"><div  anime="fgp">xx</div></transition></template>`
  );
});
test("add decorator tag", () => {
  let str = `<template>
  <section> <div anime="fgp" v-if="isShow">1</div>
  <div anime="fgp" v-else >2</div>  <div>none</div> </section>
  <div anime="fgs" v-if="isWatch" >3</div>
</template>`;
  const node = $AST.parseAST(str);

  new HTMLparser({
    node({ node: n, parent, i }) {
      let attr = n.attrsMap.anime;
      let key = n.attrsMap["v-if"]; //||n.attrsMap["v-else"]||n.attrsMap["v-else-if"]
      if (attr && !n.attrsMap["v-for"] && key) {
        parent.children.splice(i, 1, {
          type: 1,
          tag: "transition",
          attrsMap: {
            ":css": "false",
            "@before-enter": "$enterBefore",
            "@enter": "$enter",
            "@leave": "$leave",
            "@after-leave": "$leaveAfter",
            "@enter-cancelled": "$enterCancel",
          },
          attrslist: [
            { name: ":css", value: "false" },
            { name: "@before-enter", value: "$enterBefore" },
            { name: "@enter", value: "$enter" },
            { name: "@leave", value: "$leave" },
            { name: "@after-leave", value: "$leaveAfter" },
            { name: "@enter-cancelled", value: "$enterCancel" },
          ],
          children: parent.children.filter((i) => {
            return i.attrsMap.anime === attr;
          }),
        });

        parent.children = parent.children.filter((i) => {
          return i.attrsMap.anime !== attr;
        });
      }
    },
  }).transform(node);

  expect(generate(node)).toBe(
    `<template ><section ><transition  :css="false" @before-enter="$enterBefore" @enter="$enter" @leave="$leave" @after-leave="$leaveAfter" @enter-cancelled="$enterCancel"><div  anime="fgp" v-if="isShow">1</div><div  anime="fgp" :v-else="true">2</div></transition><div >none</div></section><transition  :css="false" @before-enter="$enterBefore" @enter="$enter" @leave="$leave" @after-leave="$leaveAfter" @enter-cancelled="$enterCancel"><div  anime="fgs" v-if="isWatch">3</div></transition></template>`
  );
});

test("add decorator tag", () => {
  let str = `<template> <li
  v-for="(item, index) in computedList"
  :key="item.msg"
  :data-index="index"
  anime="block7"
>
  {{ item.msg }}
</li></template>`;
  const node = $AST.parseAST(str);

  new HTMLparser({
    node({ node: n, parent, i }) {
      let attr = n.attrsMap.anime;

      if (attr && n.attrsMap["v-for"]) {
        parent.children.splice(i, 1, {
          type: 1,
          tag: "transition-group",
          attrsMap: {
            ":css": "false",
            "@before-enter": "$enterBefore",
            "@enter": "$enter",
            "@leave": "$leave",
            "@after-leave": "$leaveAfter",
            "@enter-cancelled": "$enterCancel",
          },
          attrslist: [
            { name: ":css", value: "false" },
            { name: "@before-enter", value: "$enterBefore" },
            { name: "@enter", value: "$enter" },
            { name: "@leave", value: "$leave" },
            { name: "@after-leave", value: "$leaveAfter" },
            { name: "@enter-cancelled", value: "$enterCancel" },
          ],
          children: parent.children.filter((i) => {
            return i.attrsMap.anime === attr;
          }),
        });
        parent.children = parent.children.filter((i) => {
          return i.attrsMap.anime !== attr;
        });
      }
    },
  }).transform(node);

  expect(generate(node).trim()).toBe(
    `<template ><transition-group  :css="false" @before-enter="$enterBefore" @enter="$enter" @leave="$leave" @after-leave="$leaveAfter" @enter-cancelled="$enterCancel"><li  v-for="(item, index) in computedList" :key="item.msg" :data-index="index" anime="block7">
  {{ item.msg }}
</li></transition-group></template>`
  );
});
