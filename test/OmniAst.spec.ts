import { describe, expect, it } from "vitest";
import { serialize } from "../src/Serialize";
import { tokenizer } from "./utils/tokenizer";
import {
  arrowFunctionExpression,
  ast,
  blockStatement,
  callExpression,
  constantDeclaration,
  functionExpression,
  identifier,
  jsonExpression,
  memberExpression,
  returnStatement,
} from "../src/builders";
import { cleanAST, parseAST, parseOmniAST } from "../src/utils";
import { generate } from "../src";
import { Node, VariableDeclaration } from "../src/types";

const acorn = require("acorn");
const options = { ecmaVersion: "latest" };
const dir = (x) => console.dir(x, { depth: 12 });

describe("OmniAST", () => {
  //
  it("Should Works", () => {
    //
    const script = `fn({ aaa: "bar" })`;

    const AST = cleanAST(acorn.parse(script, options)).body[0].expression;

    // const omniAST = parseOmniAST(AST);
    // dir(omniAST);

    const omniAST = {
      type: "CallExpression",
      callee: { type: "Identifier", name: "fn" },
      arguments: [{ type: "JsonExpression", body: { aaa: "bar" } }],
      optional: false,
    };

    const code = serialize(omniAST);

    // console.log(script, "\n>>");
    // console.log(code);

    expect(tokenizer(script)).toMatchObject(tokenizer(code));
  });

  //

  it("Render test", () => {
    const script = `({ 
      json: "here", 
      myFunc: jsAgain({ json: "again" }) 
    })`;

    const realAST = acorn.parse(script, options).body[0].expression;
    const cleanAcornAST = cleanAST(realAST);

    dir(cleanAcornAST);
    
    const omniAst = parseOmniAST(cleanAcornAST as Node);

    dir(omniAst);

    const generated = `(${serialize(omniAst)})`;

    console.log(generated);
  });

  it("Hybrid", () => {
    const script = `({ 
      json: "here", 
      myFunc: jsAgain({ json: "again" }) 
    })`;

    const realAST = acorn.parse(script, options).body[0].expression;

    expect(realAST).toMatchSnapshot();

    const cleanAcornAST = cleanAST(realAST);

    expect(cleanAcornAST).toMatchSnapshot();

    const omniAst = parseOmniAST(cleanAcornAST as Node);

    const AST = parseAST(omniAst);

    // expect(AST).toMatchObject(cleanAcornAST);

    const generated = `(${serialize(omniAst)})`;

    // console.log(tokenizer(script), "\n>>");
    console.log(tokenizer(generated));

    // expect(tokenizer(script)).toMatchObject(tokenizer(generated));
  });

  it("Test", () => {
    const script = `({ myVar: myFn(['value']) })`;

    const ast = acorn.parse(script, options).body[0].expression;

    const AST = parseOmniAST(cleanAST(ast));

    const generated = `(${serialize(AST)})`;

    expect(tokenizer(script)).toMatchObject(tokenizer(generated));
  });

  it("Test generate", () => {
    //
    const data = ast(
      arrowFunctionExpression(
        [identifier("alpha")],
        blockStatement([
          returnStatement(
            callExpression(identifier("test"), [
              jsonExpression({ "#id": "main", name: "Anderson" }),
              identifier(""),
            ])
          ),
        ])
      )
    );

    console.dir(data, { depth: 10 });
    const generated = generate({ data });

    console.log(generated);
    // const id = (id) => (x) => x["#id"] == id;

    // const _data = mutate(data, id("main"), assoc("name", "Shigeru"));

    // const modified = find(_data, id("main"));

    // log(modified);

    // mutate(data, ["#id", "main"], (state) => {
    //   return state;
    // });

    // const generated = generate({ data });

    // log(generated);
  });
});
