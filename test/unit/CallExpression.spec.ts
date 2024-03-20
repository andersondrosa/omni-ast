import { acornParse } from "../utils/acornParse";
import { cleanAST } from "../../src/utils";
import { describe, expect, it } from "vitest";
import { tokenizer } from "../utils/tokenizer";
import { builder as b, serialize } from "../../dist";
import { buildersGenerate } from "../../src/generators";

const log = false;
const dir = (x) => log && console.dir(x, { depth: 12 });

describe("CallExpression", () => {
  //
  it("Should Works", () => {
    //
    const script = "new foo.member.bar(bar.test(alpha.x.y.z(), beta.test))";

    const AST = cleanAST(acornParse(script)).body[0].expression;
    dir(AST);

    const code = serialize(AST) as string;

    dir(script);
    dir(code);

    expect(tokenizer(script)).toMatchObject(tokenizer(code));
  });
});
