import { acornParse } from "../utils/acornParse";
import { builder, serialize } from "../../src";
import { cleanAST } from "../../src/utils";
import { describe, expect, it } from "vitest";
import { tokenizer } from "../utils/tokenizer";

const {
  expressionStatement,
  callExpression,
  identifier,
  lit,
  switchStatement,
  switchCase,
  assignmentExpression,
} = builder;

describe("SwitchStatement", () => {
  //
  it("Should works", () => {
    //
    const script = `switch(true) { 
      case true: 
        console.log("ok"); 
      case false: 
        foo = "bar"; 
        bar = "baz";
    }`;

    const ast = switchStatement(lit(true), [
      switchCase(lit(true), [
        expressionStatement(
          callExpression(identifier("console.log"), [lit("ok")])
        ),
      ]),
      switchCase(lit(false), [
        expressionStatement(
          assignmentExpression("=", identifier("foo"), lit("bar"))
        ),
        expressionStatement(
          assignmentExpression("=", identifier("bar"), lit("baz"))
        ),
      ]),
    ]);

    const code = serialize(ast);

    expect(tokenizer(script)).toMatchObject(tokenizer(code));
  });
});
