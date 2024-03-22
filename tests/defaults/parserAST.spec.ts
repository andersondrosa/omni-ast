import { describe, expect, it } from "vitest";
import { tokenizer } from "../utils/tokenizer";
import { acornParse } from "../utils/acornParse";
import {
  clearAST,
  simplify,
  parseAST,
  builders,
  ast,
  json,
  generate,
} from "../../src";

const { identifier } = builders;
const b = builders;

const log = (x) => console.dir(x, { depth: 20 });

describe("Parsers test", () => {
  //
  it("Should test simplified AST x complex AST", () => {
    //
    const script = `({ 
      json: "here", 
      jsonFunction: jsAgain({ json: "again" }) 
    })`;

    const acornAST = acornParse(script).body[0].expression;

    const cleanAcornAST = clearAST(acornAST);

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
                    value: b.literal("again"),
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

  it("Hybrid", () => {
    const script = `({ 
      json: "here", 
      jsonFunction: jsAgain({ json: "again" }) 
    })`;

    const realAST = acornParse(script).body[0].expression;

    expect(realAST).toMatchSnapshot();

    const cleanAcornAST = clearAST(realAST);

    expect(cleanAcornAST).toMatchSnapshot();

    const omniAST = simplify(cleanAcornAST);

    const AST = parseAST(omniAST);

    // expect(AST).toMatchObject(cleanAcornAST);

    const generated = `(${generate(omniAST)})`;

    expect(tokenizer(script)).toMatchObject(tokenizer(generated));
  });

  it("AssignmentExpression", () => {
    //
    const AST = b.assignmentExpression(
      "=",
      b.identifier("script"),
      b.arrowFunctionExpression([], b.literal("ok"))
    );

    const simpleAST = simplify(AST);

    expect(simpleAST).toEqual({
      left: { name: "script", type: "Identifier" },
      operator: "=",
      right: {
        body: { raw: '"ok"', type: "Literal", value: "ok" },
        expression: true,
        params: [],
        type: "ArrowFunctionExpression",
      },
      type: "AssignmentExpression",
    });

    expect(parseAST(simpleAST)).toMatchObject(AST);
  });

  it("FunctionExpression", () => {
    //
    const AST = b.functionExpression(
      b.identifier("name"),
      [],
      b.blockStatement([b.expressionStatement(b.identifier("script"))]),
      true
    );

    const simpleAST = simplify(AST);
    log(simpleAST);

    expect(simpleAST).toEqual({
      type: "FunctionExpression",
      params: [],
      body: {
        type: "BlockStatement",
        body: [
          {
            type: "ExpressionStatement",
            expression: { type: "Identifier", name: "script" },
          },
        ],
      },
      id: { type: "Identifier", name: "name" },
      async: true,
    });

    expect(parseAST(simpleAST)).toMatchObject(AST);
  });

  it("MemberExpression", () => {
    //
    const AST = b.memberExpression(b.identifier("name"), b.literal("value"));

    log(AST);

    const simpleAST = simplify(AST);

    log(simpleAST);
    expect(simpleAST).toEqual({
      type: "MemberExpression",
      object: { type: "Identifier", name: "name" },
      property: { type: "Literal", value: "value", raw: '"value"' },
    });

    const restored = parseAST(simpleAST);
    log(restored);

    expect(restored).toMatchObject(AST);
  });
});
