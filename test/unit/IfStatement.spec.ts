import { acornParse } from "../utils/acornParse";
import { builder, cleanAST, serialize } from "../../src";
import { describe, expect, it } from "vitest";
import { tokenizer } from "../utils/tokenizer";

const {
  blockStatement,
  ifStatement,
  expressionStatement,
  callExpression,
  identifier,
  lit,
  binaryExpression,
  variableDeclaration,
  variableDeclarator,
  conditionalExpression,
} = builder;

describe("IfStatement", () => {
  //
  it("Should works", () => {
    //
    const script = `if (x < 11) { console.log("ok"); }`;

    const ast = ifStatement(
      binaryExpression("<", identifier("x"), lit(11)),
      blockStatement([
        expressionStatement(
          callExpression(identifier("console.log"), [lit("ok")])
        ),
      ])
    );

    const code = serialize(ast);

    expect(tokenizer(script)).toMatchObject(tokenizer(code));
  });

  it("Should works with inline conditional", () => {
    //
    const script = `const fooIsBar = foo == "bar" ? true : false`;

    const AST = cleanAST(acornParse(script)).body[0];

    const ast = variableDeclaration("const", [
      variableDeclarator(
        identifier("fooIsBar"),
        conditionalExpression(
          binaryExpression("==", identifier("foo"), lit("bar")),
          lit(true),
          lit(false)
        )
      ),
    ]);

    const code = serialize(ast);

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
