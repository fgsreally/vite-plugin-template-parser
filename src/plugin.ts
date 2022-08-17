import $AST from "trans-ast";
import { generate, HTMLparser } from "./utils";
import { parserConfig } from "./types";

export function parser(opts: parserConfig, exclude?: RegExp[]): any {
  const parser = new HTMLparser(opts);
  return {
    enforce: "pre",
    name: "vite-plugin-template-parser",
    transform(code: string, id: string) {
      if (/\.vue$/.test(id) && !id.includes("node_modules")) {
        if (exclude?.some((item) => item.test(id))) {
          return;
        }
        const node = $AST.parseAST(code);
        parser.transform(node);
        return generate(node);
      }
    },
  };
}
