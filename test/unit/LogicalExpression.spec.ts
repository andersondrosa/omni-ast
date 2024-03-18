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

describe("LogicalExpression", () => {
  //
  it("Should Works", () => {
    //
    const script = `const fooIsBar = foo == "bar" && true || "nope"`;

    const AST = cleanAST(acorn.parse(script, options)).body[0];
    dir(AST);

    const ast = variableDeclaration("const", [
      variableDeclarator(identifier("fooIsBar"), {
        type: "LogicalExpression",
        left: {
          type: "LogicalExpression",
          left: binaryExpression("==", identifier("foo"), lit("bar")),
          operator: "&&",
          right: { type: "Literal", value: true, raw: "true" },
        },
        operator: "||",
        right: { type: "Literal", value: "nope", raw: '"nope"' },
      }),
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
    expect(result2).toEqual("nope");

    expect(script).toMatchObject(code);
  });
});
