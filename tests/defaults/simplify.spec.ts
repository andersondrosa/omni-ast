import { acornParse } from "../utils/acornParse";
import {
  ast,
  clearAST,
  generate,
  json,
  parseAST,
  serialize,
  simplify,
} from "../../src";
import * as b from "../../src/builders";
import { describe, expect, it } from "vitest";
import fs from "fs";
import * as ramda from "ramda";
import { Node } from "../../src/types";
import { produce } from "immer";
import { mutate } from "../../src/utils";

const script = fs.readFileSync("./tests/example.js").toString();

function omniParse(code: string) {
  const acornAST = acornParse(`(${code})`);
  const AST = clearAST(acornAST.body[0]);
  const simpleAST = simplify(AST.expression);
  return simpleAST;
}

describe("Simplify AST", () => {
  //
  it("Test Omni parser", () => {
    const script = [
      `() => {
        const { pick } = ramda;
        const data = { "#json": "data", "name": "John Doe" };
        return {
          "common": "value", 
          "result": pick(["name"])(data)
        }
      }`,
    ].join("");

    const params = clearAST(
      acornParse(`(({ ramda }) => null)`).body[0].expression.params
    );
    // console.dir(params, { depth: 12 });

    // const AST = omniParse(script);
    const acornAST = acornParse(`(${script})`);
    let AST = clearAST(acornAST.body[0]);
    AST = simplify(AST.expression);

    // console.dir(AST, { depth: 12 });

    let scoped = b.arrowFunctionExpression(params, AST);
    // console.dir(scoped, { depth: 12 });

    const id = (key, value) => (x) => x[key] == value;
    const modify = ramda.flip(ramda.curryN(2, produce));

    scoped = mutate(
      scoped,
      id("#json", "data"),
      modify((x) => {
        x.name = "Other Name";
      })
    );

    const code = generate(scoped);

    // console.dir(code, { depth: 12 });

    // const fn = eval(code)({ ramda });

    // console.log(fn());
    // const restored = parseAST(simpleAST);
    // console.dir(restored, { depth: 12 });

    // expect(restored).toMatchObject(AST);
  });
  // it("Test Main", () => {
  //   const script = `({ "#json": "main", myFunc: y() })`;
  //   const _AST = clearAST(acornParse(script).body[0]);

  //   console.dir(_AST, { depth: 12 });

  //   const simpleAST = simplify(_AST.expression);
  //   console.dir(simpleAST, { depth: 12 });

  //   // const restored = parseAST(simpleAST);
  //   // console.dir(restored, { depth: 12 });

  //   // expect(restored).toMatchObject(AST);
  // });
});