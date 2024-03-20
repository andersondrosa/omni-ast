import { acornParse } from "../utils/acornParse";
import { builder, serialize } from "../../src";
import { cleanAST } from "../../src/utils";
import { describe, expect, it } from "vitest";

const {
  assignmentExpression,
  chainExpression,
  identifier,
  lit,
  memberExpression,
} = builder;

describe("ChainExpression", () => {
  //
  it("Should works", () => {
    //
    const script = 'value = base.foo?.bar?.[optional]["strict"]';

    const AST = cleanAST(acornParse(script)).body[0].expression;

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

    expect(script).toMatchObject(code);
  });
});
