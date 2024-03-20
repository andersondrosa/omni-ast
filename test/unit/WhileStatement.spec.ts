import { acornParse } from "../utils/acornParse";
import { builder, serialize } from "../../src";
import { cleanAST } from "../../src/utils";
import { describe, expect, it } from "vitest";
import { tokenizer } from "../utils/tokenizer";
import { buildersGenerate } from "../../src/generators";

describe("WhileStatement", () => {
  //
  it("Should works", () => {
    //
    const script = `let i = 0; while (i < 100) { i++; }`;

    const AST = cleanAST(acornParse(script));

    console.dir(AST, { depth: 12 });
    const code = serialize(AST);

    expect(tokenizer(code)).toMatchObject(tokenizer(script));

    const { buildFunction, evaluate } = buildersGenerate();

    const generatedFunction = buildFunction(AST);

    expect(generatedFunction).toEqual(
      `(b) => 
        b.program([
          b.variableDeclaration("let", [
            b.variableDeclarator(b.identifier("i"), b.literal(0))
          ]), 
          b.whileStatement(
            b.binaryExpression("<", b.identifier("i"), b.literal(100)), 
            b.blockStatement([
              b.expressionStatement(b.updateExpression("++", b.identifier("i")))
            ])
          )
        ])
    `.replace(/\n\s+/g, "")
    );

    const evaluatedAST = evaluate(generatedFunction);

    expect(evaluatedAST).toMatchObject(AST);

    const evaluatedCode = serialize(evaluatedAST);

    expect(evaluatedCode).toMatchObject(code);
  });
});
