import { acornParse } from "../utils/acornParse";
import { builder, serialize } from "../../dist";
import { cleanAST } from "../../src/utils";
import { describe, expect, it } from "vitest";

const log = false;
const dir = (x) => log && console.dir(x, { depth: 12 });

const {
  identifier,
  lit,
  binaryExpression,
  variableDeclaration,
  variableDeclarator,
} = builder;

describe("LogicalExpression", () => {
  //
  it("Should Works", () => {
    //
    const script = `const fooIsBar = foo == "bar" && true || "nope"`;

    const AST = cleanAST(acornParse(script)).body[0];
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

    dir(script);
    dir(code);

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
