import { describe, expect, it } from "vitest";
import { serialize } from "../../src/Serialize";
import { tokenizer } from "../utils/tokenizer";
import {
  expressionStatement,
  callExpression,
  identifier,
  lit,
  binaryExpression,
  switchStatement,
  switchCase,
  assignmentExpression,
} from "../../src/builders";
import { cleanAST } from "../../src/utils";

const acorn = require("acorn");
const options = { ecmaVersion: "latest" };
const dir = (x) => console.dir(x, { depth: 12 });

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

    // dir(cleanAST(acorn.parse(script, options)).body[0]);

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

    console.log(script, "\n>>");
    console.log(code);

    // expect(tokenizer(script)).toMatchObject(tokenizer(code));
  });
});
