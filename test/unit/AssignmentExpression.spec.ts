import { describe, expect, it } from "vitest";
import { serialize } from "../../src/generators";
import { tokenizer } from "../utils/tokenizer";
import {
  callExpression,
  identifier,
  memberExpression,
} from "../../src/builders";
import { cleanAST, parseOmniAST } from "../../src/utils";

const acorn = require("acorn");
const options = { ecmaVersion: "latest" };
const dir = (x) => console.dir(x, { depth: 12 });

describe("AssignmentExpression", () => {
  //
  it("Should Works", () => {
    //
    const script = "value = object.method(foo.baz, baz)";

    const AST = cleanAST(acorn.parse(script, options)).body[0].expression;

    // dir(parseOmniAST(AST));

    const omniAST = {
      type: "AssignmentExpression",
      operator: "=",
      left: { type: "Identifier", name: "value" },
      right: {
        type: "CallExpression",
        callee: {
          type: "MemberExpression",
          object: { type: "Identifier", name: "object" },
          property: { type: "Identifier", name: "method" },
          computed: false,
          optional: false,
        },
        arguments: [
          {
            type: "MemberExpression",
            object: { type: "Identifier", name: "foo" },
            property: { type: "Identifier", name: "baz" },
            computed: false,
            optional: false,
          },
          { type: "Identifier", name: "baz" },
        ],
        optional: false,
      },
    };

    const code = `${serialize(omniAST)}`;

    console.log(script, "\n>>");
    console.log(code);

    expect(tokenizer(script)).toMatchObject(tokenizer(code));
  });
});
