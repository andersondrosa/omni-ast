import { acornParse } from "../utils/acornParse";
import { describe, expect, it } from "vitest";
import { tokenizer } from "../utils/tokenizer";
import { clearAST, generate } from "../../src";
import { buildersGenerate } from "../../src/buildersGenerate";

describe("Literal", () => {
  //
  it("Should string works", () => {
    //
    const script = 'const phrase = "Text and number:" + "123" + 456';

    const AST = clearAST(acornParse(script)).body[0];

    const { buildFunction, evaluate } = buildersGenerate();

    const fn = buildFunction(AST);

    expect(fn).toEqual(
      `(b) => b.variableDeclaration("const", [
        b.variableDeclarator(
          b.identifier("phrase"), 
          b.binaryExpression(
            "+", 
            b.binaryExpression(
              "+", 
              b.literal("Text and number:"), 
              b.literal("123")
            ), 
            b.literal(456)
          )
        )
      ])`.replace(/\n\s+/g, "")
    );

    const code = generate(AST) as string;

    expect(tokenizer(code)).toMatchObject(tokenizer(script));

    const evaluatedAST = evaluate(fn);
    expect(evaluatedAST).toMatchObject(AST);

    const evaluatedCode = generate(evaluatedAST) as string;

    expect(tokenizer(evaluatedCode)).toMatchObject(tokenizer(script));
  });

  it("Should BigInt works", () => {
    //
    const script = "const num = 9007199254740991n";

    const AST = clearAST(acornParse(script)).body[0];

    const { buildFunction, evaluate } = buildersGenerate();

    const fn = buildFunction(AST);

    expect(fn).toEqual(
      `(b) => b.variableDeclaration("const", [
        b.variableDeclarator(
          b.identifier("num"), 
          b.literal(9007199254740991n)
        )
      ])`.replace(/\n\s+/g, "")
    );

    const code = generate(AST) as string;

    expect(tokenizer(code)).toMatchObject(tokenizer(script));

    const evaluatedCode = generate(evaluate(fn)) as string;

    expect(tokenizer(evaluatedCode)).toMatchObject(tokenizer(script));
  });
});
