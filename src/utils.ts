import { generate } from ".";
import { ObjectExpressionToJSON } from "./JsonGenerate";
import { Syntax as _ } from "./constants";

export const Mock = new Proxy({ fn: {} } as any, {
  get(target, name, receiver) {
    return { type: _.Identifier, name };
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

const denied = ["start", "end"];

export function cleanAST(ast): any {
  if (typeof ast != "object" || ast === null) return ast;
  const res = {};
  for (const key in ast) {
    if (denied.includes(key)) continue;
    const value = ast[key];
    if (typeof value != "object") {
      res[key] = value;
      continue;
    }
    if (Array.isArray(value)) {
      res[key] = value.map((x) => cleanAST(x));
      continue;
    }
    res[key] = cleanAST(value);
  }
  return res;
}

export function parseOmniAST(ast) {
  //
  if (typeof ast != "object" || ast === null) return ast;

  if (Array.isArray(ast)) return ast.map(parseOmniAST);

  if (!ast.hasOwnProperty("type") || typeof ast["type"] != "string") return ast;

  if (ast["type"] == "ObjectExpression")
    return { type: "JsonExpression", body: ObjectExpressionToJSON(ast) };

  return Object.fromEntries(
    Object.entries(ast).map((e) => [e[0], parseOmniAST(e[1])])
  );
}

export const tryGenerate = (ast) => {
  try {
    return generate(ast);
  } catch (e) {
    return `[${e.message}]`;
  }
};
