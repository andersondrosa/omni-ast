import { builder, serialize } from "../../dist";
import { describe, expect, it } from "vitest";
import { tokenizer } from "../utils/tokenizer";

const log = false;
const dir = (x) => log && console.dir(x, { depth: 12 });

const {
  callExpression,
  identifier,
  memberExpression,
  variableDeclaration,
  variableDeclarator,
} = builder;

const defaultExpression = variableDeclarator(
  identifier("foo"),
  callExpression(memberExpression(identifier("alpha"), identifier("fn1")), [
    memberExpression(identifier("bar"), identifier("baz")),
    identifier("foo"),
  ])
);

describe("VariableStatement", () => {
  //
  it("Should works with CONST vars", () => {
    //
    const script = "const foo = alpha.fn1(bar.baz, foo)";

    const ast = variableDeclaration("const", [defaultExpression]);

    const code = serialize(ast);

    dir(script);
    dir(code);

    expect(tokenizer(script)).toMatchObject(tokenizer(code));
  });

  it("Should works with LET vars", () => {
    //
    const script = "let foo = alpha.fn1(bar.baz, foo)";

    const ast = variableDeclaration("let", [defaultExpression]);

    const code = serialize(ast);

    dir(script);
    dir(code);

    expect(tokenizer(script)).toMatchObject(tokenizer(code));
  });
});
