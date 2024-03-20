import { acornParse } from "../utils/acornParse";
import { builder, cleanAST, serialize } from "../../src";
import { describe, expect, it } from "vitest";
import { tokenizer } from "../utils/tokenizer";

const {
  awaitExpression,
  blockStatement,
  functionExpression,
  identifier,
  objectPattern,
  returnStatement,
  arrayPattern,
  assignmentProperty,
} = builder;

describe("FunctionExpression", () => {
  //
  it("Should works", () => {
    //
    const script = `async function main(foo, { bar: [ baz ] }) { 
      return await baz;
    }`;

    const AST = cleanAST(acornParse(script)).body[0];

    const code = serialize(
      functionExpression(
        identifier("main"),
        [
          identifier("foo"),
          objectPattern([
            assignmentProperty(
              identifier("bar"),
              arrayPattern([identifier("baz")])
            ),
          ]),
        ],
        blockStatement([returnStatement(awaitExpression(identifier("baz")))]),
        true
      )
    );

    expect(tokenizer(code)).toMatchObject(tokenizer(script));
  });
});
