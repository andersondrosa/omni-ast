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
import { cleanAST, parseOmniAST } from "../src/utils";
import { stringify } from "../src";
import { VariableDeclaration } from "../src/types";

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

  it.skip("Hybrid", () => {
    const script = `({ 
      "json": "here", 
      "value": { "myFunc": jsAgain({ "json": "again" }) }
    })`;

    const acornAST = acorn.parse(script, options).body[0].expression;

    const AST = parseOmniAST(cleanAST(acornAST));

    const generated = `(${stringify({ type: "json:ast", body: AST })})`;

    expect(tokenizer(script)).toMatchObject(tokenizer(generated));
  });

  it.skip("Test", () => {
    const script = `({ myVar: myFn(['value']) })`;

    const ast = acorn.parse(script, options).body[0].expression;

    const AST = parseOmniAST(cleanAST(ast));

    const generated = `(${serialize(AST)})`;

    expect(tokenizer(script)).toMatchObject(tokenizer(generated));
  });

  it.skip("Test stringify", () => {
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
    const generated = stringify({ data });

    console.log(generated);
    // const id = (id) => (x) => x["#id"] == id;

    // const _data = mutate(data, id("main"), assoc("name", "Shigeru"));

    // const modified = find(_data, id("main"));

    // log(modified);

    // mutate(data, ["#id", "main"], (state) => {
    //   return state;
    // });

    // const generated = stringify({ data });

    // log(generated);
  });
});
