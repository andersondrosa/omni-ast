import { acornParse } from "../utils/acornParse";
import { ast, builders as b, generate, simplify } from "../../src";
import { describe, expect, it } from "vitest";
import { propEq } from "ramda";
import { mutate } from "../../src/utils";
import { produce } from "immer";

const log = (x) => console.dir(x, { depth: 20 });

describe("ArrowFunctionExpression", () => {
  //
  it("Should generate code correctly", () => {
    //
    const script = `(x, y) => x({ "#json": true, value: y })`;

    const AST = simplify(acornParse(script).body[0].expression);

    const jsonAST = simplify({
      type: "ArrowFunctionExpression",
      params: [b.identifier("x"), b.identifier("y")],
      body: b.callExpression(b.identifier("x"), [
        b.json({ "#json": true, value: ast(b.identifier("y")) }),
      ]),
    });

    expect(jsonAST).toMatchObject(AST);

    expect(generate(jsonAST)).toBe(script); // true
  });

  it("Should update functionality", () => {
    //
    const script = `({ deps, value }) => ({ "#json": "main", value })`;

    const AST = simplify(acornParse(script));

    const fn1 = eval(generate(AST));

    const value1 = fn1({ deps: null, value: "foo" });

    expect(value1).toEqual({ "#json": "main", value: "foo" });

    let mutatedAST = mutate(AST, propEq("main", "#json"), (x) =>
      produce(x, (draft) => {
        draft.value = b.ast(
          b.callExpression(b.identifier("deps.getName"), [x.value.body])
        );
      })
    );

    const fn2 = eval(generate(mutatedAST));

    const value2 = fn2({
      deps: { getName: (x) => x.toUpperCase() },
      value: "bar",
    });

    expect(value2).toEqual({ "#json": "main", value: "BAR" });
  });
});
