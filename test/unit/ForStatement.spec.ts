import { describe, expect, it } from "vitest";
import { ExpressionStatement, serialize } from "../../src/generators";
import { tokenizer } from "../utils/tokenizer";
import {
  blockStatement,
  ifStatement,
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
} from "../../src/builders";
import { cleanAST } from "../../src/utils";

const acorn = require("acorn");
const options = { ecmaVersion: "latest" };
const dir = (x) => console.dir(x, { depth: 12 });

describe("ForStatement", () => {
  //
  it("Should Works", () => {
    //
    const script = `for (let i=0; i<10; i++) console.log("iteration:", i)`;

    const AST = cleanAST(acorn.parse(script, options)).body[0];

    // dir(AST);

    const ast = forStatement(
      variableDeclaration("let", [variableDeclarator(identifier("i"), lit(0))]),
      binaryExpression("<", identifier("i"), lit(10)),
      updateExpression("++", identifier("i")),
      expressionStatement(
        callExpression(identifier("console.log"), [
          lit("iteration:"),
          identifier("i"),
        ])
      )
    );

    const code = serialize(ast);

    // console.log(script, "\n>>");
    // console.log(code);

    expect(tokenizer(script)).toMatchObject(tokenizer(code));
  });

  it("Should works with ForInStatement", () => {
    //
    const script = ` for (const key in object) console.log(object[key])`;

    const AST = cleanAST(acorn.parse(script, options)).body[0];

    // dir(AST);

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

    console.log(script, "\n>>");
    console.log(code);

    expect(tokenizer(script)).toMatchObject(tokenizer(code));
  });
});
