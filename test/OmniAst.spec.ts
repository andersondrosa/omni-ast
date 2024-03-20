import { acornParse } from "./utils/acornParse";
import { builder, generate } from "../src";
import { cleanAST, find, mutate, parseAST, parseOmniAST } from "../src/utils";
import { describe, expect, it } from "vitest";
import { Node } from "../src/types";
import { serialize } from "../src/generators";
import { tokenizer } from "./utils/tokenizer";
import {
  arrayPattern,
  assignmentProperty,
  expressionStatement,
  functionExpression,
  lit,
  objectExpression,
  objectPattern,
  templateElement,
  templateLiteral,
  variableDeclaration,
  variableDeclarator,
} from "../src/builders";

const log = false;
const dir = (x) => log && console.dir(x, { depth: 12 });

const {
  arrowFunctionExpression,
  ast,
  json,
  blockStatement,
  callExpression,
  identifier,
  jsonExpression,
  returnStatement,
} = builder;

describe("OmniAST", () => {
  //
  it("Should Works", () => {
    //
    const script = `fn({ aaa: "bar" })`;

    const AST = cleanAST(acornParse(script)).body[0].expression;
    dir(AST);

    const omniAST = {
      type: "CallExpression",
      callee: identifier("fn"),
      arguments: [{ type: "JsonExpression", body: { aaa: "bar" } }],
      optional: false,
    };

    const code = serialize(omniAST);

    dir(script);
    dir(code);

    expect(tokenizer(script)).toMatchObject(tokenizer(code));
  });

  it.skip("Render test", () => {
    const script = `({ 
      json: "here", 
      myFunc: jsAgain({ json: "again" }) 
    })`;

    const realAST = acornParse(script).body[0].expression;
    const cleanAcornAST = cleanAST(realAST);

    dir(cleanAcornAST);

    const omniAst = parseOmniAST(cleanAcornAST as Node);

    dir(omniAst);

    const generated = `(${serialize(omniAst)})`;

    dir(generated);
  });

  it.skip("Hybrid", () => {
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

    dir(tokenizer(script));
    dir(tokenizer(generated));

    expect(tokenizer(script)).toMatchObject(tokenizer(generated));
  });

  it.skip("Test", () => {
    const script = `({ myVar: myFn(['value']) })`;

    const ast = acornParse(script).body[0].expression;

    const AST = parseOmniAST(cleanAST(ast));

    const generated = `(${serialize(AST)})`;

    expect(tokenizer(script)).toMatchObject(tokenizer(generated));
  });

  it.skip("Test generate", () => {
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

    dir(data);
    const generated = generate({ data });

    dir(generated);

    const is = (key, val) => (x) => x[key] == val;
    const id = (id) => is("#id", id);

    const _data = mutate(data, id("main"), (x) => ({ ...x, name: "Shigeru" }));

    const modified = find(_data, id("main"));

    dir(modified);

    const novo = mutate(data, is("#id", "main"), (state) => ({
      ...state,
      callback: ast(arrowFunctionExpression([], identifier("id"))),
    }));

    // console.dir(cleanAST(acornParse(`({aaa})=>null`).body[0]), { depth: 12 });

    const element = (div, props: {}, children?) =>
      callExpression(identifier("element"), [
        lit(div),
        json(props),
        !children
          ? null
          : Array.isArray(children)
          ? arrayPattern(children)
          : children,
      ]);

    console.dir({ novo: ast(identifier("myvar")) }, { depth: 12 });
    console.dir(
      generate(
        ast(
          arrowFunctionExpression(
            [
              objectPattern([
                assignmentProperty(
                  identifier("React"),
                  objectPattern([
                    assignmentProperty(
                      identifier("createElement"),
                      identifier("element")
                    ),
                    assignmentProperty(
                      identifier("useState"),
                      identifier("useState"),
                      true
                    ),
                  ])
                ),
              ]),
            ],
            blockStatement([
              returnStatement(
                functionExpression(
                  identifier("Component"),
                  [identifier("props")],
                  blockStatement([
                    variableDeclaration("const", [
                      variableDeclarator(
                        arrayPattern([
                          identifier("name"),
                          identifier("setName"),
                        ]),
                        callExpression(identifier("useState"), [lit("")])
                      ),
                    ]),
                    returnStatement(
                      element(
                        "div",
                        { className: "p-4 bg-slate-100" },
                        element("ul", { className: "p-4 bg-slate-100" }, [
                          element(
                            "li",
                            { className: "p-4 bg-slate-100" },
                            templateLiteral(
                              [
                                templateElement({ raw: "Meu nome é " }),
                                templateElement({ raw: ";" }, true),
                              ],
                              [identifier("name")]
                            )
                          ),
                          element(
                            "li",
                            { className: "p-4 bg-slate-100" },
                            element("button", {
                              onClick: ast(
                                arrowFunctionExpression(
                                  [],
                                  callExpression(identifier("setName"), [
                                    lit("Ninja!!"),
                                  ])
                                )
                              ),
                            })
                          ),
                        ])
                      )
                    ),
                  ])
                )
              ),
            ])
          )
        )
      )
    );
  });
});
