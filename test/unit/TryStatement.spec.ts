import { acornParse } from "../utils/acornParse";
import { builder } from "../../src";
import { cleanAST } from "../../src/CleanAST";
import { describe, expect, it } from "vitest";
import { serialize } from "../../src/generators";
import { tokenizer } from "../utils/tokenizer";

const {
  blockStatement,
  expressionStatement,
  callExpression,
  identifier,
  lit,
  tryStatement,
  memberExpression,
  throwStatement,
  catchClause,
} = builder;

describe("TryStatement", () => {
  //
  it("Should works", () => {
    //
    const script = `try {
      foo.bar();
    } catch(e) {
      console.dir(e.message);
    }`;

    const AST = tryStatement(
      blockStatement([
        expressionStatement(
          callExpression(
            memberExpression(identifier("foo"), identifier("bar")),
            []
          )
        ),
      ]),
      catchClause(
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

    expect(tokenizer(script)).toMatchObject(tokenizer(code));
  });

  it("Should Throw and Catch error", () => {
    //
    const script = `try {
      throw Error("Test message");
    } catch(e) {
      console.dir(e.message);
    }`;

    const throwError = throwStatement(
      callExpression(identifier("Error"), [lit("Test message")])
    );

    const AST = tryStatement(
      blockStatement([throwError]),
      catchClause(
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

    expect(tokenizer(script)).toMatchObject(tokenizer(code));

    expect(() => eval(serialize(throwError))).toThrow("Test message");
  });
});
