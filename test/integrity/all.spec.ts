import fs from "fs";
import { acornParse } from "../utils/acornParse";
import { builder, serialize } from "../../src";
import { buildersGenerate } from "../../src/generators";
import { cleanAST } from "../../src/CleanAST";
import { describe, expect, it } from "vitest";
import { tokenizer } from "../utils/tokenizer";

describe("Test all expressions", () => {
  //
  it("Should works", async () => {
    //
    const script = fs.readFileSync(__dirname + "/example.js").toString();

    const AST = (acornParse(script).body);

    console.dir(AST, { depth: 12 });

    // const code = serialize(AST);

    // console.log(code);

    // expect(tokenizer(code)).toMatchObject(tokenizer(script));

    const { buildFunction, evaluate } = buildersGenerate();

    const generatedFunction = buildFunction(AST);

    console.log(generatedFunction);

    (b) => [
      b.variableDeclaration("let", [
        b.variableDeclarator(b.identifier("foo"), b.literal(42)),
      ]),
      b.variableDeclaration("const", [
        b.variableDeclarator(b.identifier("bar"), b.literal("Hello World")),
      ]),
      b.variableDeclaration("const", [
        b.variableDeclarator(
          b.identifier("regex"),
          b.literal(b.jsonExpression({}))
        ),
      ]),
      b.functionDeclaration(
        b.identifier("add"),
        [b.identifier("a"), b.identifier("b")],
        b.blockStatement([
          b.returnStatement(
            b.binaryExpression("+", b.identifier("a"), b.identifier("b"))
          ),
        ])
      ),
    ];

    // expect(generatedFunction).toEqual(
    //   `(b) => b.variableDeclaration("let", [b.variableDeclarator(b.identifier("foo"), b.literal(42))])`.replace(
    //     /\n\s+/g,
    //     ""
    //   )
    // );

    // const evaluatedAST = evaluate(generatedFunction);

    // expect(evaluatedAST).toMatchObject(AST);

    // const evaluatedCode = serialize(evaluatedAST);

    // expect(evaluatedCode).toMatchObject(code);
  });
});
