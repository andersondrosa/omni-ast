import { acornParse } from "../utils/acornParse";
import { clearAST } from "../../src";
import { describe, expect, it } from "vitest";
import { buildersGenerate } from "../../src/buildersGenerate";

const { buildFunction, evaluate } = buildersGenerate();

describe("Clean AST", () => {
  //
  it("Clear AST", () => {
    //
    const script = `(x, y) => x({ value: y })`;

    const acornAST = acornParse(script).body[0];

    console.dir(acornAST, { depth: 12 });

    const acornGeneratedCleanAST = evaluate(buildFunction(acornAST));
    console.dir(acornGeneratedCleanAST, { depth: 12 });

    const AST = clearAST(acornAST);

    console.dir(AST, { depth: 12 });

    expect(AST).toMatchObject(acornGeneratedCleanAST);
  });
});
