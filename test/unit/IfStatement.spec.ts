import { describe, expect, it } from "vitest";
import { serialize } from "../../src/generators";
import { tokenizer } from "../utils/tokenizer";
import {
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
} from "../../src/builders";
import { cleanAST } from "../../src/utils";

const acorn = require("acorn");
const options = { ecmaVersion: "latest" };
const dir = (x) => console.dir(x, { depth: 12 });

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

    console.log(script, "\n>>");
    console.log(code);

    expect(tokenizer(script)).toMatchObject(tokenizer(code));
  });

  it("Should Works with inline conditional", () => {
    //
    const script = `const fooIsBar = foo == "bar" ? true : false`;

    const AST = cleanAST(acorn.parse(script, options)).body[0];
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

    console.log(script, "\n>>");
    console.log(code);

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
