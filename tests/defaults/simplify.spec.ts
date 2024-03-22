import { acornParse } from "../utils/acornParse";
import { clearAST, parseAST, simplify } from "../../src";
import { describe, expect, it } from "vitest";
import fs from "fs";

const script = fs.readFileSync("./tests/example.js").toString();

describe("Simplify AST", () => {
  //
  it.skip("Test 1", () => {
    const script = `(x, y) => x?.({ ["a"]:y })`;

    const AST = clearAST(acornParse(script).body[0]);
    console.dir(AST, { depth: 12 });

    const simpleAST = simplify(AST);
    console.dir(simpleAST, { depth: 12 });

    const restored = parseAST(simpleAST);
    console.dir(restored, { depth: 12 });

    expect(restored).toMatchObject(AST);
  });

  it("Test 2", () => {
    //
    const AST = clearAST(acornParse(script).body);
    console.dir(AST, { depth: 12 });

    const simpleAST = simplify(AST);
    // console.dir(simpleAST, { depth: 12 });

    const restored = parseAST(simpleAST);
    // console.dir(restored, { depth: 12 });

    expect(restored).toMatchObject(AST);
  });
});
