import { acornParse } from "../utils/acornParse";
import { builders, generate } from "../../src";
import { describe, expect, it } from "vitest";
import { tokenizer } from "../utils/tokenizer";
import { literal } from "../../src/builders";

const {
  expressionStatement,
  callExpression,
  identifier,
  switchStatement,
  switchCase,
  assignmentExpression,
} = builders;

describe("SwitchStatement", () => {
  //
  it("Should generate code correctly", () => {
    //
    const script = `switch(true) { 
      case true: 
        console.log("ok"); 
      case false: 
        foo = "bar"; 
        bar = "baz";
    }`;

    const ast = switchStatement(literal(true), [
      switchCase(literal(true), [
        expressionStatement(
          callExpression(identifier("console.log"), [literal("ok")])
        ),
      ]),
      switchCase(literal(false), [
        expressionStatement(
          assignmentExpression("=", identifier("foo"), literal("bar"))
        ),
        expressionStatement(
          assignmentExpression("=", identifier("bar"), literal("baz"))
        ),
      ]),
    ]);

    const code = generate(ast);

    expect(tokenizer(script)).toMatchObject(tokenizer(code));
  });
});
