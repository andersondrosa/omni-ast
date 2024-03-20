import { builder as b, serialize } from "../../src";
import { describe, expect, it } from "vitest";
import { tokenizer } from "../utils/tokenizer";

const defaultExpression = b.variableDeclarator(
  b.identifier("foo"),
  b.callExpression(
    b.memberExpression(b.identifier("alpha"), b.identifier("fn1")),
    [
      b.memberExpression(b.identifier("bar"), b.identifier("baz")),
      b.identifier("foo"),
    ]
  )
);

describe("VariableStatement", () => {
  //
  it("Should works with CONST vars", () => {
    //
    const script = "const foo = alpha.fn1(bar.baz, foo)";

    const ast = b.variableDeclaration("const", [defaultExpression]);

    const code = serialize(ast);

    expect(tokenizer(script)).toMatchObject(tokenizer(code));
  });

  it("Should works with LET vars", () => {
    //
    const script = "let foo = alpha.fn1(bar.baz, foo)";

    const ast = b.variableDeclaration("let", [defaultExpression]);

    const code = serialize(ast);

    expect(tokenizer(script)).toMatchObject(tokenizer(code));
  });
});
