import { acornParse } from "../utils/acornParse";
import { builder } from "../../dist";
import { cleanAST } from "../../src/utils";
import { describe, expect, it } from "vitest";
import { serialize } from "../../src/generators";
import { tokenizer } from "../utils/tokenizer";

const log = false;
const dir = (x) => log && console.dir(x, { depth: 12 });

const {
  blockStatement,
  expressionStatement,
  callExpression,
  identifier,
  lit,
  tryStatement,
  memberExpression,
  catchStatement,
  throwStatement,
} = builder;

describe("TryStatement", () => {
  //
  it("Should Works", () => {
    //
    const script = `try {
      foo.bar();
    } catch(e) {
      console.dir(e.message);
    }`;

    dir(cleanAST(acornParse(script)).body[0]);

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

    dir(script);
    dir(code);

    expect(tokenizer(script)).toMatchObject(tokenizer(code));
  });

  it("Should Throw and Catch error", () => {
    //
    const script = `try {
      throw Error("Test message");
    } catch(e) {
      console.dir(e.message);
    }`;

    dir(cleanAST(acornParse(script)).body[0]);

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

    dir(script);
    dir(code);

    expect(tokenizer(script)).toMatchObject(tokenizer(code));

    expect(() => eval(serialize(throwError))).toThrow("Test message");
  });
});
