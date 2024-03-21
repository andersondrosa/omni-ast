import { acornParse } from "../utils/acornParse";
import { builder, serialize } from "../../src";
import { cleanAST } from "../../src/CleanAST";
import { describe, expect, it } from "vitest";

const {
  identifier,
  lit,
  binaryExpression,
  variableDeclaration,
  variableDeclarator,
} = builder;

describe("LogicalExpression", () => {
  //
  it("Should works", () => {
    //
    const script = `const fooIsBar = foo == "bar" && true || "nope"`;

    const AST = cleanAST(acornParse(script)).body[0];

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
