import { Options, plugins } from "@swc/core";
import classExtend from "./src/swc/ClassExtend";
import classToFunction from "./src/swc/ClassToFunction";
import defaultVisitor from "./src/swc/DefaultVisitor";
import keepInstanceOf from "./src/swc/KeepInstanceOf";
import noArraySpreading from "./src/swc/NoArraySpreading";
import noVoid0 from "./src/swc/NoVoid0";

const transformForLR: Options = {
  jsc: {
    parser: {
      syntax: "typescript",
      tsx: false,
    },
    target: "es5",
    loose: true,
  },
  minify: false,
  isModule: true,
  module: {
    type: "es6",
  },
  plugin: plugins([noArraySpreading(), classExtend(), classToFunction(), noVoid0(), keepInstanceOf()]),
  sourceMaps: false,
};

export { transformForLR };
