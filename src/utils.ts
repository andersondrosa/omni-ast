import { ObjectExpressionToJSON } from "./JsonGenerate";
import { Node, Property } from "../src/types";
import { identifier, lit, objectExpression } from "./builders";
import { generate } from "./generators";

type Options = { pre?; post?; skipProperty? };

export function simpleTraverse(root, options: Options = {}) {
  var pre = options.pre;
  var post = options.post;
  var skipProperty = options.skipProperty;

  function visit(node, parent, prop?, idx?) {
    if (!node || typeof node.type !== "string") return;

    var res = undefined;
    if (pre) res = pre(node, parent, prop, idx);

    if (res !== false) {
      for (const prop in node) {
        if (skipProperty ? skipProperty(prop, node) : prop[0] === "$") continue;
        const child = node[prop];
        if (Array.isArray(child)) {
          for (var i = 0; i < child.length; i++) visit(child[i], node, prop, i);
        } else visit(child, node, prop);
      }
    }

    if (post) post(node, parent, prop, idx);
  }

  visit(root, null);
}

export const Mock = new Proxy({ fn: {} } as any, {
  get(target, name, receiver) {
    return { type: "Identifier", name };
  },
});

const isObject = (item) =>
  item && typeof item === "object" && !Array.isArray(item);

export function find(node, match) {
  //
  if (typeof node != "object" || node === null) return;

  const recursive = (object: Object) => {
    //
    if (match(object)) return object;

    if (Array.isArray(object)) {
      for (const val of object) {
        const res = recursive(val);
        if (res) return res;
      }
      return;
    }

    for (const i in object) {
      const value = object[i];
      if (typeof value != "object" || value === null) continue;
      const res = recursive(value);
      if (res) return res;
    }
  };

  return recursive(node);
}

export function mutate(object, match, modifier) {
  const findAndModify = (object) => {
    if (isObject(object)) {
      console.log(typeof match);
      if (match(object)) return modifier(object);
      const newObj = {};
      let changed = false;
      for (const [k, v] of Object.entries(object)) {
        const newValue = findAndModify(v);
        newObj[k] = newValue;
        if (newValue !== v) changed = true;
      }
      return changed ? newObj : object;
    }
    if (Array.isArray(object)) {
      const newArray = object.map(findAndModify);
      return newArray.some((item, index) => item !== object[index])
        ? newArray
        : object;
    }
    return object;
  };
  return findAndModify(object);
}

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
  for (const key in ast) {
    omniAst[key] = simplify(ast[key]);
  }
  return omniAst;
}

export function parseAST(value: Node) {
  //
  const astFindJSON = (ast: Node) => {
    //
    if (Array.isArray(ast)) return ast.map(astFindJSON);

    if (ast.type == "JsonExpression") return jsonToAST(ast.body);

    const _ast: Node = {} as Node;
    for (const key in ast) {
      _ast[key] =
        typeof ast[key] === "object" && ast[key] != null
          ? astFindJSON(ast[key])
          : ast[key];
    }
    return _ast;
  };

  const jsonToAST = (value) => {
    //
    if (typeof value != "object") return lit(value);

    if (Array.isArray(value))
      return { type: "ArrayExpression", elements: value.map(jsonToAST) };

    if (value.type == "#AST") return astFindJSON(value.body);

    const properties: Property[] = [];

    for (const key in value) {
      const row = value[key];
      properties.push({
        type: "Property",
        key: identifier(key),
        value:
          typeof row != "object" || row === null ? lit(row) : jsonToAST(row),
        computed: false,
        kind: "init",
        method: false,
        shorthand: false,
      });
    }
    return objectExpression(properties);
  };

  return astFindJSON(value);
}

export const tryGenerate = (ast) => {
  try {
    return generate(ast);
  } catch (e) {
    return `[${e.message}]`;
  }
};
