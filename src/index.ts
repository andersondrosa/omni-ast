import { generate } from "./JsonGenerate";

const isObject = (x) =>
  typeof x === "object" && !Array.isArray(x) && x !== null;

export { generate };
