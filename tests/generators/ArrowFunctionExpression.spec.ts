import { acornParse } from "../utils/acornParse";
import {
  ast,
  builders as b,
  clearAST,
  generate,
  simplify,
} from "../../src";
import { describe, expect, it } from "vitest";
import { pipe } from "ramda";

const log = (x) => console.dir(x, { depth: 20 });

const simpleParse = pipe(acornParse, (x) => x.body[0], clearAST, simplify);

describe.skip("ArrowFunctionExpression", () => {
  //
  it("Should generate code correctly", () => {
    //
    const script = `(x, y) => x({ value: y })`;

    const AST = simpleParse(script);

    log(AST);

    const jsonAST = {
      type: "ArrowFunctionExpression",
      params: [b.identifier("x"), b.identifier("y")],
      body: {
        type: "CallExpression",
        callee: b.identifier("x"),
        arguments: [b.json({ value: ast(b.identifier("y")) })],
      },
    };

    log(jsonAST);

    expect(jsonAST).toMatchObject(AST.expression);

    // This generates a code and compares it with the code above
    expect(generate(jsonAST)).toBe(script); // true
  });
});
