import { acornParse } from "../utils/acornParse";
import { builder, cleanAST, serialize } from "../../dist";
import { describe, expect, it } from "vitest";
import { tokenizer } from "../utils/tokenizer";

const log = false;
const dir = (x) => log && console.dir(x, { depth: 12 });

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
  it("Should Works", () => {
    //
    const script = `async function main(foo, { bar: [ baz ] }) { 
      return await baz;
    }`;

    const AST = cleanAST(acornParse(script)).body[0];
    dir(AST);

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

    dir(script);
    dir(code);

    expect(tokenizer(code)).toMatchObject(tokenizer(script));
  });
});
