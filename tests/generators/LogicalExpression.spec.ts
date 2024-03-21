import { acornParse } from "../utils/acornParse";
import { builders, clearAST, generate } from "../../src";
import { describe, expect, it } from "vitest";

const {
  identifier,
  lit,
  binaryExpression,
  variableDeclaration,
  variableDeclarator,
} = builders;

describe("LogicalExpression", () => {
  //
  it("Should generate code correctly", () => {
    //
    const script = `const fooIsBar = foo == "bar" && true || "nope"`;

    const AST = clearAST(acornParse(script)).body[0];

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

    const code = generate(ast);

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
