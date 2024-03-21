import { acornParse } from "../utils/acornParse";
import { generate, cleanAST } from "../../src";
import { describe, expect, it } from "vitest";
import { tokenizer } from "../utils/tokenizer";
import { buildersGenerate } from "../../src/buildersGenerate";

describe("DoWhileStatement", () => {
  //
  it("Should generate code correctly", () => {
    //
    const script = `let i = 0; do { i++; } while (i < 100)`;

    const AST = cleanAST(acornParse(script));

    const code = generate(AST);

    expect(tokenizer(code)).toMatchObject(tokenizer(script));

    const { buildFunction, evaluate } = buildersGenerate();

    const generatedFunction = buildFunction(AST);

    expect(generatedFunction).toEqual(
      `(b) => 
        b.program([
          b.variableDeclaration("let", [
            b.variableDeclarator(b.identifier("i"), b.literal(0))
          ]), 
          b.doWhileStatement(
            b.blockStatement([
              b.expressionStatement(b.updateExpression("++", b.identifier("i")))
            ]), 
            b.binaryExpression("<", b.identifier("i"), b.literal(100))
          )
        ])
    `.replace(/\n\s+/g, "")
    );

    const evaluatedAST = evaluate(generatedFunction);

    expect(evaluatedAST).toMatchObject(AST);

    const evaluatedCode = generate(evaluatedAST);

    console.log(evaluatedCode);

    expect(evaluatedCode).toMatchObject(code);
  });
});
