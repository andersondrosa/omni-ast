import { describe, expect, it } from "vitest";
import { serialize } from "../../src/Serialize";
import { tokenizer } from "../utils/tokenizer";
import { identifier, memberExpression } from "../../src/builders";
import { cleanAST } from "../../src/utils";

const acorn = require("acorn");
const options = { ecmaVersion: "latest" };
const dir = (x) => console.dir(x, { depth: 12 });

describe("MemberExpression", () => {
  //
  it("Should Works", () => {
    //
    const script = `foo.bar`;

    // dir(cleanAST(acorn.parse(script, options)).body[0].expression);

    const ast = memberExpression(identifier("foo"), identifier("bar"));

    const code = serialize(ast);

    // console.log(script, "\n>>");
    // console.log(code);

    expect(tokenizer(script)).toMatchObject(tokenizer(code));
  });
});
