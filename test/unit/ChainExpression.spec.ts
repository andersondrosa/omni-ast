import { describe, expect, it } from "vitest";
import { serialize } from "../../src/Serialize";
import { tokenizer } from "../utils/tokenizer";
import {
  callExpression,
  identifier,
  memberExpression,
  chainExpression,
  lit,
  assignmentExpression,
} from "../../src/builders";
import { cleanAST, parseOmniAST } from "../../src/utils";

const acorn = require("acorn");
const options = { ecmaVersion: "latest" };
const dir = (x) => console.dir(x, { depth: 12 });

describe("ChainExpression", () => {
  //
  it("Should Works", () => {
    //
    const script = 'value = base.foo?.bar?.[optional]["strict"]';

    // const AST = cleanAST(acorn.parse(script, options)).body[0].expression;
    // dir(parseOmniAST(AST));

    const omniAST = assignmentExpression(
      "=",
      identifier("value"),
      chainExpression(
        memberExpression(
          memberExpression(
            memberExpression(
              memberExpression(identifier("base"), identifier("foo")),
              identifier("bar"),
              { optional: true }
            ),
            identifier("optional"),
            { computed: true, optional: true }
          ),
          lit("strict"),
          { computed: true, optional: false }
        )
      )
    );

    const code = `${serialize(omniAST)}`;

    console.log(script, "\n>>");
    console.log(code);

    expect(script).toMatchObject(code);
  });
});
