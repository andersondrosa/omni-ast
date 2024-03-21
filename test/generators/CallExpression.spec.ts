import { acornParse } from "../utils/acornParse";
import { cleanAST } from "../../src/CleanAST";
import { describe, expect, it } from "vitest";
import { tokenizer } from "../utils/tokenizer";
import { builders as b, generate } from "../../src";

describe("CallExpression", () => {
  //
  it("Should generate code correctly", () => {
    //
    const script = "new foo.member.bar(bar.test(alpha.x.y.z(), beta.test))";

    const AST = cleanAST(acornParse(script)).body[0].expression;

    const code = generate(AST) as string;

    expect(tokenizer(script)).toMatchObject(tokenizer(code));
  });
});
