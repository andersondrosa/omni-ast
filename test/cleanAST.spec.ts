import { acornParse } from "./utils/acornParse";
import { cleanAST, serialize } from "../src";
import { buildersGenerate } from "../src/generators";
import { describe, expect, it } from "vitest";
import { tokenizer } from "./utils/tokenizer";

const { buildFunction, evaluate } = buildersGenerate();

describe("Clean AST", () => {
  //
  it("Regex Literal", () => {
    //
    const script = "const regex = /[a-zA-Z_][a-zA-Z0-9_]+/g; ";

    const acornAST = acornParse(script).body[0];

    // console.dir(acornAST, { depth: 12 });

    const acornGeneratedCleanAST = evaluate(buildFunction(acornAST));
    // console.dir(acornGeneratedCleanAST, { depth: 12 });

    const AST = cleanAST(acornAST);

    // console.dir(AST, { depth: 12 });

    expect(AST).toMatchObject(acornGeneratedCleanAST);
  });
});
