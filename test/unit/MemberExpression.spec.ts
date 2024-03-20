import { acornParse } from "../utils/acornParse";
import { builder, serialize } from "../../dist";
import { cleanAST } from "../../src/utils";
import { describe, expect, it } from "vitest";
import { identifier, memberExpression } from "../../src/builders";
import { tokenizer } from "../utils/tokenizer";

const log = false;
const dir = (x) => log && console.dir(x, { depth: 12 });

describe("MemberExpression", () => {
  //
  it("Should Works", () => {
    //
    const script = `foo.bar`;

    dir(cleanAST(acornParse(script)).body[0].expression);

    const ast = memberExpression(identifier("foo"), identifier("bar"));

    const code = serialize(ast);

    dir(script);
    dir(code);

    expect(tokenizer(script)).toMatchObject(tokenizer(code));
  });
});
