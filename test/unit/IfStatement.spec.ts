import { acornParse } from "../utils/acornParse";
import { builder, cleanAST, serialize } from "../../dist";
import { describe, expect, it } from "vitest";
import { tokenizer } from "../utils/tokenizer";

const log = false;
const dir = (x) => log && console.dir(x, { depth: 12 });

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
  it("Should Works", () => {
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

    dir(script);
    dir(code);

    expect(tokenizer(script)).toMatchObject(tokenizer(code));
  });

  it("Should Works with inline conditional", () => {
    //
    const script = `const fooIsBar = foo == "bar" ? true : false`;

    const AST = cleanAST(acornParse(script)).body[0];
    dir(AST);

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

    dir(script);
    dir(code);

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
