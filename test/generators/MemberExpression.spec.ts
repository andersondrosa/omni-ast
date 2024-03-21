import { generate } from "../../src";
import { describe, expect, it } from "vitest";
import { identifier, memberExpression } from "../../src/builders";
import { tokenizer } from "../utils/tokenizer";

describe("MemberExpression", () => {
  //
  it("Should generate code correctly", () => {
    //
    const script = `foo.bar`;

    const ast = memberExpression(identifier("foo"), identifier("bar"));

    const code = generate(ast);

    expect(tokenizer(script)).toMatchObject(tokenizer(code));
  });
});
