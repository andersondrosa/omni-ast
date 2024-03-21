import { acornParse } from "../utils/acornParse";
import { builder, generate } from "../../src";
import { cleanAST } from "../../src/CleanAST";
import { describe, expect, it } from "vitest";
import { tokenizer } from "../utils/tokenizer";
import { buildersGenerate } from "../../src/generators";

describe("DoWhileStatement", () => {
  //
  it("Should works", () => {
    //
    const script = `for(let i = 0; i < 10; i++) { 
      console.log("iteration:", i); 
    }`;

    const AST = cleanAST(acornParse(script).body[0]);

    const code = generate(AST);

    expect(tokenizer(code)).toMatchObject(tokenizer(script));

    const { buildFunction, evaluate } = buildersGenerate();

    const generatedFunction = buildFunction(AST);

    expect(generatedFunction).toEqual(
      `(b) => b.forStatement(
        b.variableDeclaration("let", [
          b.variableDeclarator(b.identifier("i"), b.literal(0))
        ]), 
        b.binaryExpression(
          "<", b.identifier("i"), 
          b.literal(10)), 
          b.updateExpression(
            "++", 
            b.identifier("i")), 
            b.blockStatement([
              b.expressionStatement(
                b.callExpression(
                  b.memberExpression(
                    b.identifier("console"), 
                    b.identifier("log")
                  ), 
                  [b.literal("iteration:"), b.identifier("i")]
                )
              )
            ]
          )
        )
        `.replace(/\n\s+/g, "")
    );

    const evaluatedAST = evaluate(generatedFunction);

    expect(evaluatedAST).toMatchObject(AST);

    const evaluatedCode = generate(evaluatedAST);

    expect(evaluatedCode).toMatchObject(code);
  });
});
