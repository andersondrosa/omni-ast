import * as b from "../../src/builders";
import fs from "fs";
import { acornParse } from "../utils/acornParse";
import { generateBuilders } from "../../src/generateBuilders";

import { clearAST, generate } from "../../src";
import { describe, expect, it } from "vitest";

const dir = (x) => console.dir(x, { depth: 20 });

describe("Test all expressions", () => {
  //
  it("Should generate code correctly", async () => {
    //
    const script = fs.readFileSync(__dirname + "/react.js").toString();

    expect(script).toMatchSnapshot();

    const acornAST = acornParse(script).body[0];

    const AST = clearAST(acornAST);

    expect(AST).toMatchSnapshot();

    const generatedCode = generate(AST);

    expect(generatedCode).toMatchSnapshot();

    const { build } = generateBuilders("b");

    const generatedBuilders = build(AST);

    expect(generatedBuilders).toMatchSnapshot();

    const getAST = eval("(b) => " + generatedBuilders);

    const generatedAST = getAST(b);

    expect(generatedAST).toMatchObject(AST);

    const generatedCode2 = generate(generatedAST);

    expect(generatedCode).toEqual(generatedCode2);
  });
});
