import { cleanAST, parseOmniAST } from "../../src/utils";
import { describe, expect, it } from "vitest";
import { serialize } from "../../dist";
import { tokenizer } from "../utils/tokenizer";

import { acornParse } from "../utils/acornParse";
const log = false;
const dir = (x) => log && console.dir(x, { depth: 12 });

describe("AssignmentExpression", () => {
  //
  it("should handle simple assignment", () => {
    const input = "a = 2;";
    const ast = acornParse(input);
    const assignmentExpression = ast.body[0].expression;

    expect(assignmentExpression.type).toBe("AssignmentExpression");
    expect(assignmentExpression.operator).toBe("=");
    expect(assignmentExpression.left.type).toBe("Identifier");
    expect(assignmentExpression.left.name).toBe("a");
    expect(assignmentExpression.right.type).toBe("Literal");
    expect(assignmentExpression.right.value).toBe(2);
  });

  it("Should Works", () => {
    //
    const script = "value = object.method(foo.baz, baz)";

    const AST = cleanAST(acornParse(script)).body[0].expression;
    dir(parseOmniAST(AST));

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

    dir(script);
    dir(code);

    expect(tokenizer(script)).toMatchObject(tokenizer(code));
  });
});
