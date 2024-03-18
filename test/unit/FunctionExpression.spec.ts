import { describe, expect, it } from "vitest";
import { serialize } from "../../src/generators";
import { tokenizer } from "../utils/tokenizer";
import {
  awaitExpression,
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

describe("FunctionExpression", () => {
  //
  it("Should Works", () => {
    //
    const script = `async function main() { 
      return await value;
    }`;

    // const AST = cleanAST(acorn.parse(script, options)).body[0];
    // dir(AST);

    const code = serialize(
      functionExpression(
        identifier("main"),
        [],
        blockStatement([returnStatement(awaitExpression(identifier("value")))]),
        true
      )
    );

    // console.log(script, "\n>>");
    // console.log(code);

    expect(tokenizer(script)).toMatchObject(tokenizer(code));
  });
});
