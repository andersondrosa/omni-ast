import { acornParse } from "../utils/acornParse";
import { builder, cleanAST, serialize } from "../../dist";
import { describe, expect, it } from "vitest";
import { lint } from "../utils/eslint";
import { tokenizer } from "../utils/tokenizer";

const log = false;
const dir = (x) => log && console.dir(x, { depth: 12 });

const {
  blockStatement,
  expressionStatement,
  callExpression,
  identifier,
  lit,
  binaryExpression,
  forStatement,
  variableDeclaration,
  variableDeclarator,
  updateExpression,
  forInStatement,
  memberExpression,
} = builder;

describe("ForStatement", () => {
  //
  it("Should Works", async () => {
    //
    const script = `{
      for (let i = 0; ((i < 10)); i++) { console.log("iteration:", i) }
    }`;

    const AST = cleanAST(acornParse(script)).body[0];
    dir(AST);

    const ast = blockStatement([
      forStatement(
        variableDeclaration("let", [
          variableDeclarator(identifier("i"), lit(0)),
        ]),
        binaryExpression("<", identifier("i"), lit(10)),
        updateExpression("++", identifier("i")),
        blockStatement([
          expressionStatement(
            callExpression(identifier("console.log"), [
              lit("iteration:"),
              identifier("i"),
            ])
          ),
        ])
      ),
    ]);

    const code = serialize(ast);

    dir(script);
    dir(code);

    expect(tokenizer(await lint(code))).toMatchObject(
      tokenizer(await lint(script))
    );
  });

  it("Should works with ForInStatement", () => {
    //
    const script = ` for (const key in object) console.log(object[key]);`;

    const AST = cleanAST(acornParse(script)).body[0];
    dir(AST);

    const ast = forInStatement(
      variableDeclaration("const", [variableDeclarator(identifier("key"))]),
      identifier("object"),
      expressionStatement(
        callExpression(identifier("console.log"), [
          memberExpression(identifier("object"), identifier("key"), true),
        ])
      )
    );

    const code = serialize(ast);

    dir(script);
    dir(code);

    expect(lint(code)).toMatchObject(lint(script));
  });
});
