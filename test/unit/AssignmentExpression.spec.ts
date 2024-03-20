import { cleanAST, parseOmniAST } from "../../src/utils";
import { describe, expect, it } from "vitest";
import { serialize } from "../../src";
import { tokenizer } from "../utils/tokenizer";

import { acornParse } from "../utils/acornParse";

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

  it("Should works", () => {
    //
    const script = "value = object.method(foo.baz, baz)";

    const AST = cleanAST(acornParse(script)).body[0].expression;

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
        },
        arguments: [
          {
            type: "MemberExpression",
            object: { type: "Identifier", name: "foo" },
            property: { type: "Identifier", name: "baz" },
          },
          { type: "Identifier", name: "baz" },
        ],
      },
    };

    const omniCode = `${serialize(omniAST)}`;

    expect(tokenizer(script)).toMatchObject(tokenizer(omniCode));

    const code = `${serialize(AST)}`;

    expect(tokenizer(code)).toMatchObject(tokenizer(code));
  });
});
