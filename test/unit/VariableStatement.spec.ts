import { describe, expect, it } from "vitest";
import { serialize } from "../../src/Serialize";
import { tokenizer } from "../utils/tokenizer";
import {
  callExpression,
  identifier,
  memberExpression,
  variableDeclaration,
  variableDeclarator,
} from "../../src/builders";
import { cleanAST } from "../../src/utils";

const acorn = require("acorn");
const options = { ecmaVersion: "latest" };
const dir = (x) => console.dir(x, { depth: 12 });

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

    // console.log(script, "\n>>");
    // console.log(code);

    expect(tokenizer(script)).toMatchObject(tokenizer(code));
  });

  it("Should works with LET vars", () => {
    //
    const script = "let foo = alpha.fn1(bar.baz, foo)";

    const ast = variableDeclaration("let", [defaultExpression]);

    const code = serialize(ast);

    // console.log(script, "\n>>");
    // console.log(code);

    expect(tokenizer(script)).toMatchObject(tokenizer(code));
  });
});
