import { acornParse } from "../utils/acornParse";
import { builders, cleanAST, generate } from "../../src";
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
} = builders;

describe("FunctionExpression", () => {
  //
  it("Should generate code correctly", () => {
    //
    const script = `async function main(foo, { bar: [ baz ] }) { 
      return await baz;
    }`;

    const AST = cleanAST(acornParse(script)).body[0];

    const code = generate(
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
