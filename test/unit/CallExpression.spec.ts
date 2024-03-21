import { acornParse } from "../utils/acornParse";
import { cleanAST } from "../../src/CleanAST";
import { describe, expect, it } from "vitest";
import { tokenizer } from "../utils/tokenizer";
import { builder as b, serialize } from "../../src";
import { buildersGenerate } from "../../src/generators";

describe("CallExpression", () => {
  //
  it("Should works", () => {
    //
    const script = "new foo.member.bar(bar.test(alpha.x.y.z(), beta.test))";

    const AST = cleanAST(acornParse(script)).body[0].expression;

    const code = serialize(AST) as string;

    expect(tokenizer(script)).toMatchObject(tokenizer(code));
  });
});
