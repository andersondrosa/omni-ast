import { ObjectExpressionToJSON } from "./JsonGenerate";
import { parsers } from "./astGenerate";
import { Node, Property } from "../src/types";
import { identifier, lit, objectExpression } from "./builders";

const removeFalseValues = (n) => {
  const r = {};
  for (const i in n) {
    if (n[i] == false) continue;
    r[i] = n[i];
  }
  return r;
};

export function simplify(ast: Node) {
  //
  if (typeof ast != "object" || ast === null) return ast;

  if (Array.isArray(ast)) return ast.map(simplify);

  if (!ast.hasOwnProperty("type")) return ast;

  if (typeof ast["type"] != "string")
    throw Error("Invalid AST. Type is invalid");

  switch (ast.type) {
    case "ObjectExpression":
      return { type: "JsonExpression", body: ObjectExpressionToJSON(ast) };
    case "Literal":
    case "Identifier":
      return { ...ast };
    case "MemberExpression":
      return removeFalseValues(ast);
  }

  const omniAst = {};
  for (const key in ast) omniAst[key] = simplify(ast[key]);

  return omniAst;
}

export function parseAST(jsonAst: Record<string, any>) {
  //
  const restore = (simpleAst: Record<string, any>) => {
    //
    if (typeof simpleAst != "object") throw Error("AST must be object");

    if (Array.isArray(simpleAst)) return simpleAst.map(restore);

    if (simpleAst.type == "JsonExpression") return fromJson(simpleAst.body);

    return parsers[simpleAst.type](simpleAst);
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

  return restore(jsonAst);
}
