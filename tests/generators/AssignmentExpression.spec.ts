import { acornParse } from "../utils/acornParse";
import { clearAST, generate } from "../../src";
import { describe, expect, it } from "vitest";
import { tokenizer } from "../utils/tokenizer";
import { generateBuilders } from "../../src/generateBuilders";

describe("AssignmentExpression", () => {
  //
  it("Should generate code correctly", () => {
    //
    const script = "value = object.method(foo.baz, baz)";

    const AST = clearAST(acornParse(script).body[0]);

    const code = generate(AST);

    expect(tokenizer(code)).toMatchObject(tokenizer(script));

    const { buildFunction, evaluate } = generateBuilders();

    const generatedFunction = buildFunction(AST);

    expect(generatedFunction).toEqual(
      `(b) => b.expressionStatement(
        b.assignmentExpression(
          "=", 
          b.identifier("value"), 
          b.callExpression(
            b.memberExpression(b.identifier("object"), b.identifier("method")), 
            [
              b.memberExpression(b.identifier("foo"), b.identifier("baz")), 
              b.identifier("baz")
            ]
          )
        )
      )`.replace(/\n\s+/g, "")
    );

    const evaluatedAST = evaluate(generatedFunction);

    expect(evaluatedAST).toMatchObject(AST);

    const evaluatedCode = generate(evaluatedAST);

    expect(evaluatedCode).toMatchObject(code);
  });
});
