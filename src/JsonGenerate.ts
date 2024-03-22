import { generate } from "./codeGenerate";
import { simplify } from "./simplify";
import { JsonTypes, Node, ObjectExpression, Property } from "./types";

export const jsonParseValue = (node: any) => {
  if (node.type == "Literal") return node.value;
  if (node.type == "ArrayExpression") return node.elements.map(jsonParseValue);
  if (node.type == "ObjectExpression") return ObjectExpressionToJSON(node);
  return { "#ast": "current", body: simplify(node) };
};

const isKey = (x: string) => /^[a-zA-Z_][a-zA-Z_0-9]*$/g.test(x);

export function serialize(node: JsonTypes) {
  //
  const recursive = (value) => {
    //
    if (typeof value === "string") return `"${value}"`;
    if (typeof value != "object") return String(value);
    if (value === null) return "null";
    if (Array.isArray(value)) return `[${value.map(recursive).join(",")}]`;
    if (value.hasOwnProperty("#ast")) return generate(value.body);

    const code = Object.entries(value)
      .map((x) => `${isKey(x[0]) ? x[0] : `"${x[0]}"`}: ${recursive(x[1])}`)
      .join(", ");

    return `{ ${code} }`;
  };

  return recursive(node);
}

const resolveKey = (node: Node) => {
  return node.type == "Literal" ? node.value : generate(node);
};

export function ObjectExpressionToJSON(expr: ObjectExpression) {
  const entries = expr.properties.map((prop: Property) => {
    const key = resolveKey(prop.key);
    if (prop.computed) return [`[${key}]`, jsonParseValue(prop.value)];
    return [key, jsonParseValue(prop.value)];
  });
  return Object.fromEntries(entries);
}
