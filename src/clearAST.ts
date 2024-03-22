//
const removeKeys = ["start", "end", "method"];

const exceptions = {
  FunctionDeclaration: (key) => key == "expression",
  FunctionExpression: (key) => key == "expression",
  ArrowFunctionExpression: (key) => key == "id",
};

export function clearAST(ast): any {
  //
  function clear(ast, visited = new WeakMap<object, boolean>()): any {
    //
    if (ast === null) return null;

    if (typeof ast != "object") throw Error("Invalid AST");

    if (visited.has(ast)) throw new Error("Detected a circular AST reference");
    visited.set(ast, true);

    const res = {};

    if (Array.isArray(ast)) return ast.map((x) => clear(x, visited));

    Object.entries(ast).forEach(([key, value]) => {
      //
      if (removeKeys.includes(key)) return;
      if (exceptions[ast.type]?.(key, value)) return;

      if (typeof value != "object" || value instanceof RegExp || value === null)
        return (res[key] = value);

      res[key] = clear(value);
    });

    visited.delete(ast);

    return res;
  }
  return clear(ast);
}
