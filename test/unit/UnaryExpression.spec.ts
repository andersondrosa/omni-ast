import { describe, expect, it } from "vitest";
import { serialize } from "../../src/Serialize";
import { tokenizer } from "../utils/tokenizer";
import {
  blockStatement,
  expressionStatement,
  callExpression,
  identifier,
  lit,
  variableDeclaration,
  variableDeclarator,
  unaryExpression,
  memberExpression,
  updateExpression,
  jsonExpression,
  functionExpression,
} from "../../src/builders";
import { cleanAST } from "../../src/utils";

const t = require("@babel/types");

const acorn = require("acorn");
const options = { ecmaVersion: "latest" };
const dir = (x) => console.dir(x, { depth: 12 });

describe("UnaryExpression", () => {
  //
  it("Should Works", () => {
    //
    const script = `{
      console.log(!isActive);
      const positiveNumber = +42;
      const negativeNumber = -42;
      let prefixIncrement = 0;
      console.log(++prefixIncrement);
      let suffixIncrement = 0;
      console.log(suffixIncrement++);
      let prefixDecrement = 10;
      console.log(--prefixDecrement);
      let suffixDecrement = 10;
      console.log(suffixDecrement--);
      console.log(typeof isActive);
      const myObject = { key: "value" };
      delete myObject.key;
      console.log(myObject);
      void function() {
        console.log('Esta função é chamada sem retornar valor');
      }();
    }`;

    const AST = cleanAST(acorn.parse(script, options)).body[0];
    dir(AST);

    const ast = blockStatement([
      expressionStatement(
        callExpression(
          memberExpression(identifier("console"), identifier("log")),
          [unaryExpression("!", identifier("isActive"))]
        )
      ),
      variableDeclaration("const", [
        variableDeclarator(
          identifier("positiveNumber"),
          unaryExpression("+", lit(42))
        ),
      ]),
      variableDeclaration("const", [
        variableDeclarator(
          identifier("negativeNumber"),
          unaryExpression("-", lit(42))
        ),
      ]),
      variableDeclaration("let", [
        variableDeclarator(identifier("prefixIncrement"), lit(0)),
      ]),
      expressionStatement(
        callExpression(
          memberExpression(identifier("console"), identifier("log")),
          [updateExpression("++", identifier("prefixIncrement"), true)]
        )
      ),
      variableDeclaration("let", [
        variableDeclarator(identifier("suffixIncrement"), lit(0)),
      ]),
      expressionStatement(
        callExpression(
          memberExpression(identifier("console"), identifier("log")),
          [updateExpression("++", identifier("suffixIncrement"), false)]
        )
      ),
      variableDeclaration("let", [
        variableDeclarator(identifier("prefixDecrement"), lit(10)),
      ]),
      expressionStatement(
        callExpression(
          memberExpression(identifier("console"), identifier("log")),
          [updateExpression("--", identifier("prefixDecrement"), true)]
        )
      ),
      variableDeclaration("let", [
        variableDeclarator(identifier("suffixDecrement"), lit(10)),
      ]),
      expressionStatement(
        callExpression(
          memberExpression(identifier("console"), identifier("log")),
          [updateExpression("--", identifier("suffixDecrement"), false)]
        )
      ),
      expressionStatement(
        callExpression(
          memberExpression(identifier("console"), identifier("log")),
          [unaryExpression("typeof", identifier("isActive"))]
        )
      ),
      variableDeclaration("const", [
        variableDeclarator(
          identifier("myObject"),
          jsonExpression({ key: "value" })
        ),
      ]),
      expressionStatement(
        unaryExpression(
          "delete",
          memberExpression(identifier("myObject"), identifier("key"))
        )
      ),
      expressionStatement(
        callExpression(
          memberExpression(
            identifier("console"),
            identifier("log"),
            false,
            false
          ),
          [identifier("myObject")]
        )
      ),
      expressionStatement(
        unaryExpression(
          "void",
          callExpression(
            functionExpression(
              null,
              [],
              blockStatement([
                expressionStatement(
                  callExpression(
                    memberExpression(
                      identifier("console"),
                      identifier("log"),
                      false,
                      false
                    ),
                    [lit("Esta função é chamada sem retornar valor")]
                  )
                ),
              ])
            ),
            []
          )
        )
      ),
    ]);

    // simpleTraverse(ast, {
    //   pre: function (node, parent, prop, idx) {
    //     console.log(
    //       node.type +
    //         (parent
    //           ? " from parent " +
    //             parent.type +
    //             " via " +
    //             prop +
    //             (idx !== undefined ? "[" + idx + "]" : "")
    //           : "")
    //     );
    //   },
    // });

    const code = serialize(ast);

    console.log(script, "\n>>");
    console.log(code);

    expect(tokenizer(script)).toMatchObject(tokenizer(code));
  });
});
