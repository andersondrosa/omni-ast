import { acornParse } from "./utils/acornParse";
import { builder, cleanAST } from "../src";
import { parseAST, parseOmniAST } from "../src/utils";
import { describe, expect, it } from "vitest";
import { Node } from "../src/types";
import { serialize } from "../src/generators";
import { tokenizer } from "./utils/tokenizer";
import { identifier } from "../src/builders";

describe("OmniAST", () => {
  //
  it("Should works", () => {
    //
    const script = `fn({ aaa: "bar" })`;

    const AST = cleanAST(acornParse(script)).body[0].expression;

    const omniAST = {
      type: "CallExpression",
      callee: identifier("fn"),
      arguments: [{ type: "JsonExpression", body: { aaa: "bar" } }],
      optional: false,
    };

    const code = serialize(omniAST);

    expect(tokenizer(script)).toMatchObject(tokenizer(code));
  });

  it("Render test", () => {
    const script = `({ 
      json: "here", 
      myFunc: jsAgain({ json: "again" }) 
    })`;

    const realAST = acornParse(script).body[0].expression;
    const cleanAcornAST = cleanAST(realAST);

    const omniAst = parseOmniAST(cleanAcornAST as Node);

    const generated = `(${serialize(omniAst)})`;
  });

  it("Hybrid", () => {
    const script = `({ 
      json: "here", 
      myFunc: jsAgain({ json: "again" }) 
    })`;

    const realAST = acornParse(script).body[0].expression;

    expect(realAST).toMatchSnapshot();

    const cleanAcornAST = cleanAST(realAST);

    expect(cleanAcornAST).toMatchSnapshot();

    const omniAst = parseOmniAST(cleanAcornAST as Node);

    const AST = parseAST(omniAst);

    // expect(AST).toMatchObject(cleanAcornAST);

    const generated = `(${serialize(omniAst)})`;

    expect(tokenizer(script)).toMatchObject(tokenizer(generated));
  });

  it("Test", () => {
    const script = `({ myVar: myFn(['value']) })`;

    const ast = acornParse(script).body[0].expression;

    const AST = parseOmniAST(cleanAST(ast));

    const generated = `(${serialize(AST)})`;

    expect(tokenizer(script)).toMatchObject(tokenizer(generated));
  });
});
