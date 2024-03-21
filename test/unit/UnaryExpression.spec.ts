import { acornParse } from "../utils/acornParse";
import { generate } from "../../src";
import { cleanAST } from "../../src/CleanAST";
import { describe, expect, it } from "vitest";
import { lint } from "../utils/eslint";
import { tokenizer } from "../utils/tokenizer";
import { buildersGenerate } from "../../src/generators";

const log = true;

describe("UnaryExpression", () => {
  //
  it("Should works", async () => {
    //
    const script = `{
      console.log(++prefixIncrement);
      console.log(suffixIncrement++);
    }`;

    const AST = cleanAST(acornParse(script)).body[0];
    // dir(AST);

    const { build, buildFunction, evaluate } = buildersGenerate();

    const generatedBuilders = buildFunction(AST);

    console.log(generatedBuilders);

    const code = generate(evaluate(generatedBuilders));

    expect(await lint(tokenizer(code))).toEqual(await lint(tokenizer(script)));
  });
});
