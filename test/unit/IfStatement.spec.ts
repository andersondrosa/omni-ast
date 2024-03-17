import { describe, expect, it } from "vitest";
import { ExpressionStatement, serialize } from "../../src/Serialize";
import { tokenizer } from "../utils/tokenizer";
import {
  blockStatement,
  ifStatement,
  expressionStatement,
  callExpression,
  identifier,
  lit,
  binaryExpression,
} from "../../src/builders";

describe("IfStatement", () => {
  //
  it("Should Works", () => {
    //
    const script = `if ((x < 11)) { console.log("ok") }`;

    const ast = ifStatement(
      binaryExpression("<", identifier("x"), lit(11)),
      blockStatement([
        expressionStatement(
          callExpression(identifier("console.log"), [lit("ok")])
        ),
      ])
    );

    const code = serialize(ast);

    // console.log(script, "\n>>");
    // console.log(code);

    expect(tokenizer(script)).toMatchObject(tokenizer(code));
  });
});
