import { acornParse } from "../utils/acornParse";
import { builders, clearAST, generate } from "../../src";
import { describe, expect, it } from "vitest";

const {
  assignmentExpression,
  chainExpression,
  identifier,
  lit,
  memberExpression,
} = builders;

describe("ChainExpression", () => {
  //
  it("Should generate code correctly", () => {
    //
    const script = 'value = base.foo?.bar?.[optional]["strict"]';

    const AST = clearAST(acornParse(script)).body[0].expression;

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

    const code = `${generate(omniAST)}`;

    expect(script).toMatchObject(code);
  });
});
