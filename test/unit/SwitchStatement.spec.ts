import { acornParse } from "../utils/acornParse";
import { builder, serialize } from "../../dist";
import { cleanAST } from "../../src/utils";
import { describe, expect, it } from "vitest";
import { tokenizer } from "../utils/tokenizer";

const log = false;
const dir = (x) => log && console.dir(x, { depth: 12 });

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
  it("Should Works", () => {
    //
    const script = `switch(true) { 
      case true: 
        console.log("ok"); 
      case false: 
        foo = "bar"; 
        bar = "baz";
    }`;

    dir(cleanAST(acornParse(script)).body[0]);

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

    // dir(ast);
    const code = serialize(ast);

    dir(script);
    dir(code);

    expect(tokenizer(script)).toMatchObject(tokenizer(code));
  });
});
