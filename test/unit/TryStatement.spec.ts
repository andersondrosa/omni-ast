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
  tryStatement,
  memberExpression,
  catchStatement,
  throwStatement,
} from "../../src/builders";
import { cleanAST } from "../../src/utils";

const acorn = require("acorn");
const options = { ecmaVersion: "latest" };
const dir = (x) => console.dir(x, { depth: 12 });

describe("TryStatement", () => {
  //
  it("Should Works", () => {
    //
    const script = `try {
      foo.bar();
    } catch(e) {
      console.dir(e.message);
    }`;

    // const AST = cleanAST(acorn.parse(script, options)).body[0];
    // dir(AST);

    const AST = tryStatement(
      blockStatement([
        expressionStatement(
          callExpression(
            memberExpression(identifier("foo"), identifier("bar")),
            []
          )
        ),
      ]),
      catchStatement(
        identifier("e"),
        blockStatement([
          expressionStatement(
            callExpression(
              memberExpression(identifier("console"), identifier("dir")),
              [memberExpression(identifier("e"), identifier("message"))]
            )
          ),
        ])
      )
    );

    const code = serialize(AST);

    // console.log(script, "\n>>");
    // console.log(code);

    expect(tokenizer(script)).toMatchObject(tokenizer(code));
  });

  it("Should Throw and Catch error", () => {
    //
    const script = `try {
      throw Error("Test message");
    } catch(e) {
      console.dir(e.message);
    }`;

    // const AST = cleanAST(acorn.parse(script, options)).body[0];
    // dir(AST);

    const throwError = throwStatement(
      callExpression(identifier("Error"), [lit("Test message")])
    );

    const AST = tryStatement(
      blockStatement([throwError]),
      catchStatement(
        identifier("e"),
        blockStatement([
          expressionStatement(
            callExpression(
              memberExpression(identifier("console"), identifier("dir")),
              [memberExpression(identifier("e"), identifier("message"))]
            )
          ),
        ])
      )
    );

    const code = serialize(AST);

    console.log(script, "\n>>");
    console.log(code);

    expect(tokenizer(script)).toMatchObject(tokenizer(code));

    expect(() => eval(serialize(throwError))).toThrow("Test message");
  });
});
