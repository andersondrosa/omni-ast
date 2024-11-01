import { acornParse } from "../utils/acornParse";
import { clearAST, generate } from "../../src";
import { describe, expect, it } from "vitest";
import { lint } from "../utils/eslint";
import { tokenizer } from "../utils/tokenizer";
import { generateBuilders } from "../../src/generateBuilders";

describe("UnaryExpression", () => {
  //
  it("Should generate code correctly", async () => {
    //
    const script = `{
      console.log(++prefixIncrement);
      console.log(suffixIncrement++);
    }`;

    const AST = clearAST(acornParse(script)).body[0];
    // dir(AST);

    const { build, buildFunction, evaluate } = generateBuilders();

    const generatedBuilders = buildFunction(AST);

    // console.log(generatedBuilders);

    const code = generate(evaluate(generatedBuilders));

    expect(await lint(tokenizer(code))).toEqual(await lint(tokenizer(script)));
  });
});
