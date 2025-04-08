import { acornParse } from "../utils/acornParse";
import { clearAST, generate } from "../../src";
import { describe, expect, it } from "vitest";
import { tokenizer } from "../utils/tokenizer";
import { generateBuilders } from "../../src/generateBuilders";

describe("WhileStatement", () => {
  //
  it("Should generate code correctly", () => {
    //
    const script = `let i = 0; while (i < 100) { i++; }`;

    const AST = clearAST(acornParse(script));

    const code = generate(AST);

    expect(tokenizer(code)).toMatchObject(tokenizer(script));

    const { build, safeEval } = generateBuilders();

    const generatedFunction = build(AST);

    expect(generatedFunction).toEqual(
      `b.program([
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

    const evaluatedAST = safeEval(generatedFunction);

    expect(evaluatedAST).toMatchObject(AST);

    const evaluatedCode = generate(evaluatedAST);

    expect(evaluatedCode).toMatchObject(code);
  });
});
