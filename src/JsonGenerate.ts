import { parseOmniAST } from "./utils";
import { serialize } from "./Serialize";
import { JsonTypes, ObjectExpression, Property } from "./types";

export const jsonParseValue = (node: any) => {
  if (node.type == "Literal") return node.value;
  if (node.type == "ArrayExpression") return node.elements.map(jsonParseValue);
  if (node.type == "ObjectExpression") return ObjectExpressionToJSON(node);
  return { type: "#AST", body: parseOmniAST(node) };
};

export function generate(node: JsonTypes) {
  //
  const recursive = (value) => {
    //
    if (typeof value === "string") return `"${value}"`;

    if (typeof value != "object") return String(value);

    if (value === null) return "null";

    if (Array.isArray(value)) return `[${value.map(recursive).join(",")}]`;

    if (value.type == "#AST") return serialize(value.body);

    return `{ ${Object.entries(value)
      .map(([key, val]) => `${key}: ${recursive(val)}`)
      .join(", ")} }`;
  };

  return recursive(node);
}

export function ObjectExpressionToJSON(expr: ObjectExpression) {
  const entries = expr.properties.map((prop: Property) => {
    const key = serialize(prop.key)
    if (prop.computed) return [`[${key}]`, jsonParseValue(prop.value)];
    return [key, jsonParseValue(prop.value)];
  });
  return Object.fromEntries(entries);
}
