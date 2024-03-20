import { acornParse } from "../utils/acornParse";
import { builder, serialize } from "../../dist";
import { cleanAST, parseOmniAST } from "../../src/utils";
import { describe, expect, it } from "vitest";

const log = false;
const dir = (x) => log && console.dir(x, { depth: 12 });

const {
  assignmentExpression,
  chainExpression,
  identifier,
  lit,
  memberExpression,
} = builder;

describe("ChainExpression", () => {
  //
  it("Should Works", () => {
    //
    const script = 'value = base.foo?.bar?.[optional]["strict"]';

    const AST = cleanAST(acornParse(script)).body[0].expression;
    dir(parseOmniAST(AST));

    const omniAST = assignmentExpression(
      "=",
      identifier("value"),
      chainExpression(
        memberExpression(
          memberExpression(
            memberExpression(
              memberExpression(identifier("base"), identifier("foo")),
              identifier("bar"),
              false,
              true
            ),
            identifier("optional"),
            true,
            true
          ),
          lit("strict"),
          true
        )
      )
    );

    const code = `${serialize(omniAST)}`;

    dir(script);
    dir(code);

    expect(script).toMatchObject(code);
  });
});
