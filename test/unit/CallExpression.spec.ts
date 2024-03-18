import { describe, expect, it } from "vitest";
import { serialize } from "../../src/generators";
import { tokenizer } from "../utils/tokenizer";
import {
  callExpression,
  identifier,
  memberExpression,
  newExpression,
} from "../../src/builders";
import { cleanAST } from "../../src/utils";

const acorn = require("acorn");
const options = { ecmaVersion: "latest" };
const dir = (x) => console.dir(x, { depth: 12 });

describe("CallExpression", () => {
  //
  it("Should Works", () => {
    //
    const script = "new foo.member.bar(bar.test(alpha.x.y.z(), beta.test))";

    const AST = cleanAST(acorn.parse(script, options)).body[0].expression;
    // dir(AST);

    // const code = serialize(AST) as string;
    const code = serialize(
      newExpression(
        memberExpression(
          memberExpression(identifier("foo"), identifier("member")),
          identifier("bar")
        ),
        [
          callExpression(
            memberExpression(identifier("bar"), identifier("test")),
            [
              callExpression(
                memberExpression(
                  memberExpression(
                    memberExpression(identifier("alpha"), identifier("x")),
                    identifier("y")
                  ),
                  identifier("z")
                ),
                []
              ),
              memberExpression(identifier("beta"), identifier("test")),
            ]
          ),
        ]
      )
    ) as string;

    // console.log(script, "\n>>");
    // console.log(code);

    expect(tokenizer(script)).toMatchObject(tokenizer(code));
  });
});
