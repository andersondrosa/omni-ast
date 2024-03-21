//
const remove = ["start", "end", "generator"];

const hideIfNil = [
  "async",
  "id",
  "label",
  "computed",
  "optional",
  "shorthand",
  "prefix",
  "method",
  "expression",
];

export function cleanAST(ast): any {
  //
  if (typeof ast != "object") throw Error("Invalid AST");

  if (ast === null) return null;

  const res = {};

  if (Array.isArray(ast)) return ast.map(cleanAST);

  Object.entries(ast).forEach(([key, value]) => {
    //
    if (remove.includes(key)) return;

    if (hideIfNil.includes(key) && !value) return;

    if (typeof value != "object" || value instanceof RegExp || value === null)
      return (res[key] = value);

    res[key] = cleanAST(value);
  });

  return res;
}
