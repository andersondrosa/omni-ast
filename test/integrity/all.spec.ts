import { acornParse } from "../utils/acornParse";
import { cleanAST, serialize } from "../../src";
import { describe, expect, it } from "vitest";
import { lint } from "../utils/eslint";
import fs from "fs";
import { buildersGenerate } from "../../src/generators";
import * as b from "../../src/builders";
import { parseAST } from "../../src/utils";




describe("Test all expressions", () => {
  //
  it("Should works", async () => {
    //
    const script = fs.readFileSync(__dirname + "/example.js").toString();

    expect(script).toMatchSnapshot();

    const AST = cleanAST(acornParse(script));

    console.log(AST.body[1]);

    expect(AST).toMatchSnapshot();

    const generatedCode = serialize(AST);

    expect(generatedCode).toMatchSnapshot();

    const { build } = buildersGenerate("b");

    const generatedBuilders = build(AST);

    expect(generatedBuilders).toMatchSnapshot();

    const getAST = eval("(b) => " + generatedBuilders);

    const generatedAST = getAST(b);

    expect(AST).toMatchObject(generatedAST);

    const generatedCode2 = serialize(generatedAST);

    expect(generatedCode).toEqual(generatedCode2);
  });
});