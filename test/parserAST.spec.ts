import { describe, expect, it } from "vitest";
import { tokenizer } from "./utils/tokenizer";
import { acornParse } from "./utils/acornParse";
import {
  cleanAST,
  simplify,
  parseAST,
  builders,
  ast,
  json,
  generate,
} from "../src";

const { identifier, lit } = builders;
const b = builders;

const log = (x) => console.dir(x, { depth: 20 });

describe("Parsers test", () => {
  //
  it.skip("Should test simplified AST x complex AST", () => {
    //
    const script = `({ 
      json: "here", 
      jsonFunction: jsAgain({ json: "again" }) 
    })`;

    const acornAST = acornParse(script).body[0].expression;

    const cleanAcornAST = cleanAST(acornAST);

    const simpleAST = simplify(cleanAcornAST);

    expect(simpleAST).toMatchObject(
      json({
        json: "here",
        jsonFunction: ast({
          type: "CallExpression",
          callee: { type: "Identifier", name: "jsAgain" },
          arguments: [{ type: "JsonExpression", body: { json: "again" } }],
        }),
      })
    );

    const AST = parseAST(simpleAST);

    expect(AST).toMatchObject(cleanAcornAST);

    expect(AST).toMatchObject({
      type: "ObjectExpression",
      properties: [
        {
          type: "Property",
          key: identifier("json"),
          value: { type: "Literal", value: "here", raw: '"here"' },
          computed: false,
          kind: "init",
          method: false,
          shorthand: false,
        },
        {
          type: "Property",
          key: identifier("jsonFunction"),
          value: {
            type: "CallExpression",
            callee: identifier("jsAgain"),
            arguments: [
              {
                type: "ObjectExpression",
                properties: [
                  {
                    type: "Property",
                    key: identifier("json"),
                    value: lit("again"),
                    computed: false,
                    kind: "init",
                    method: false,
                    shorthand: false,
                  },
                ],
              },
            ],
          },
          computed: false,
          kind: "init",
          method: false,
          shorthand: false,
        },
      ],
    });
  });

  it.skip("Hybrid", () => {
    const script = `({ 
      json: "here", 
      jsonFunction: jsAgain({ json: "again" }) 
    })`;

    const realAST = acornParse(script).body[0].expression;

    expect(realAST).toMatchSnapshot();

    const cleanAcornAST = cleanAST(realAST);

    expect(cleanAcornAST).toMatchSnapshot();

    const omniAST = simplify(cleanAcornAST);

    const AST = parseAST(omniAST);

    // expect(AST).toMatchObject(cleanAcornAST);

    const generated = `(${generate(omniAST)})`;

    expect(tokenizer(script)).toMatchObject(tokenizer(generated));
  });

  it("Test", () => {
    //
    const AST = b.assignmentExpression(
      "=",
      b.identifier("script"),
      b.arrowFunctionExpression([], b.lit("ok"))
    );

    log(parseAST(AST));

    const acornAST = acornParse('script = () => "ok"').body[0].expression;

    log(acornAST);
  });
});
