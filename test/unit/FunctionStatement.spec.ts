import { describe, expect, it } from "vitest";
import { serialize } from "../../src/Serialize";
import { tokenizer } from "../utils/tokenizer";
import {
  blockStatement,
  callExpression,
  functionExpression,
  identifier,
  memberExpression,
  returnStatement,
} from "../../src/builders";
import { cleanAST } from "../../src/utils";

const acorn = require("acorn");
const options = { ecmaVersion: "latest" };
const dir = (x) => console.dir(x, { depth: 12 });

describe("FunctionStatement", () => {
  //
  it("Should Works", () => {
    //
    const script = `function main() { return value }`;

    const AST = cleanAST(acorn.parse(script, options)).body[0].expression;
    // dir(AST);

    const code = serialize(
      functionExpression(
        identifier("main"),
        [],
        blockStatement([returnStatement(identifier("value"))])
      )
    );

    // console.log(script, "\n>>");
    // console.log(code);

    expect(tokenizer(script)).toMatchObject(tokenizer(code));
  });
});
