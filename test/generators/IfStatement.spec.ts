import { acornParse } from "../utils/acornParse";
import { builders as b, cleanAST, generate } from "../../src";
import { describe, expect, it } from "vitest";
import { tokenizer } from "../utils/tokenizer";

describe("IfStatement", () => {
  //
  it("Should generate code correctly", () => {
    //
    const script = `if (x < 11) { console.log("ok"); }`;

    const ast = b.ifStatement(
      b.binaryExpression("<", b.identifier("x"), b.lit(11)),
      b.blockStatement([
        b.expressionStatement(
          b.callExpression(b.identifier("console.log"), [b.lit("ok")])
        ),
      ])
    );

    const code = generate(ast);

    expect(tokenizer(script)).toMatchObject(tokenizer(code));
  });

  it("Should works with inline conditional", () => {
    //
    const script = `const fooIsBar = foo == "bar" ? true : false`;

    const AST = cleanAST(acornParse(script)).body[0];

    const ast = b.variableDeclaration("const", [
      b.variableDeclarator(
        b.identifier("fooIsBar"),
        b.conditionalExpression(
          b.binaryExpression("==", b.identifier("foo"), b.lit("bar")),
          b.lit(true),
          b.lit(false)
        )
      ),
    ]);

    const code = generate(ast);

    const result = eval(
      `(() => { const foo = "bar"; ${code}; return fooIsBar; })()`
    );
    expect(result).toBe(true);

    const result2 = eval(
      `(() => { const foo = "other"; ${code}; return fooIsBar; })()`
    );
    expect(result2).toBe(false);

    expect(tokenizer(script)).toMatchObject(tokenizer(code));
  });
});
