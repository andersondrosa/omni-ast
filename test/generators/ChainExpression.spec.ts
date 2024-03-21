import { acornParse } from "../utils/acornParse";
import { builders, generate } from "../../src";
import { cleanAST } from "../../src/CleanAST";
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

    const code = `${generate(omniAST)}`;

    expect(script).toMatchObject(code);
  });
});
