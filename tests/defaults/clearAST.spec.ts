import { acornParse } from "../utils/acornParse";
import { clearAST } from "../../src";
import { describe, expect, it } from "vitest";
import { generateBuilders } from "../../src/generateBuilders";

const { safeEval, build } = generateBuilders();

describe("Clean AST", () => {
  //
  it("Clear AST", () => {
    //
    const script = `(x, y) => x({ value: y })`;

    const acornAST = acornParse(script).body[0];

    const acornGeneratedCleanAST = safeEval(build(acornAST));

    const AST = clearAST(acornAST);

    expect(AST).toMatchObject(acornGeneratedCleanAST);
  });
});
