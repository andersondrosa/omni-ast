import { ObjectExpressionToJSON } from "./JsonGenerate";
import { Node, Property } from "../src/types";
import { identifier, lit, objectExpression } from "./builders";

export function simplify(ast: Node) {
  //
  if (typeof ast != "object" || ast === null) return ast;

  if (Array.isArray(ast)) return ast.map(simplify);

  if (!ast.hasOwnProperty("type")) return ast;

  if (typeof ast["type"] != "string")
    throw Error("Invalid AST. Type is invalid");

  if (ast.type == "ObjectExpression")
    return { type: "JsonExpression", body: ObjectExpressionToJSON(ast) };

  const omniAst = {};
  for (const key in ast) omniAst[key] = simplify(ast[key]);

  return omniAst;
}

export function parseAST(value: Node) {
  //
  const restore = (ast: Node) => {
    //
    if (Array.isArray(ast)) return ast.map(restore);

    if (ast.type == "JsonExpression") return fromJson(ast.body);

    const _ast: Node = {} as Node;
    for (const key in ast) {
      _ast[key] =
        typeof ast[key] === "object" && ast[key] != null
          ? restore(ast[key])
          : ast[key];
    }
    return _ast;
  };

  const fromJson = (value) => {
    //
    if (typeof value != "object") return lit(value);

    if (Array.isArray(value))
      return { type: "ArrayExpression", elements: value.map(fromJson) };

    if (value.type == "#AST") return restore(value.body);

    const properties: Property[] = Object.entries(value).map(
      ([key, value]: any) => ({
        type: "Property",
        key: identifier(key),
        value:
          typeof value != "object" || value === null
            ? lit(value)
            : fromJson(value),
        computed: false,
        kind: "init",
        method: false,
        shorthand: false,
      })
    );

    return objectExpression(properties);
  };

  return restore(value);
}
