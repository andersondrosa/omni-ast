import { Syntax } from "./constants";
import { stringify } from "./JsonGenerate";
import { generate } from "./Serialize";

const isObject = (x) =>
  typeof x === "object" && !Array.isArray(x) && x !== null;

export const isNode = (x) => isObject(x) && Syntax[x.type];

export { stringify, generate };
