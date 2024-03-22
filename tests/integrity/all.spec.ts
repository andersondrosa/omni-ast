import fs from "fs";
import { acornParse } from "../utils/acornParse";
import { describe, expect, it } from "vitest";
import { tokenizer } from "../utils/tokenizer";
import { buildersGenerate } from "../../src/buildersGenerate";
import { builders, clearAST, generate } from "../../src";

describe("Test all expressions", () => {
  //
  it("Should generate code correctly", async () => {
    //
    const script = fs.readFileSync(__dirname + "/../example.js").toString();

    const AST = clearAST(acornParse(script));

    console.dir(AST, { depth: 12 });

    const code = generate(AST);
    // console.log(code);

    // const { buildFunction, evaluate } = buildersGenerate();
    // const generatedFunction = buildFunction(AST);
    // console.log(generatedFunction);

    const generateAST = (b) =>
      b.program([
        b.variableDeclaration("let", [
          b.variableDeclarator(b.identifier("foo"), b.literal(42)),
        ]),
        b.variableDeclaration("const", [
          b.variableDeclarator(b.identifier("bar"), b.literal("Hello World")),
        ]),
        b.variableDeclaration("const", [
          b.variableDeclarator(
            b.identifier("regex"),
            b.literal(/[a-zA-Z_][a-zA-Z0-9_]+/g)
          ),
        ]),
        b.functionDeclaration(
          b.identifier("add"),
          [b.identifier("a"), b.identifier("b")],
          b.blockStatement([
            b.returnStatement(
              b.binaryExpression("+", b.identifier("a"), b.identifier("b"))
            ),
          ])
        ),
        b.ifStatement(
          b.binaryExpression(">", b.identifier("foo"), b.literal(10)),
          b.blockStatement([
            b.expressionStatement(
              b.callExpression(
                b.memberExpression(
                  b.identifier("console"),
                  b.identifier("log")
                ),
                [b.identifier("bar")]
              )
            ),
          ]),
          b.blockStatement([
            b.expressionStatement(
              b.callExpression(
                b.memberExpression(
                  b.identifier("console"),
                  b.identifier("log")
                ),
                [b.literal("foo is less than or equal to 10")]
              )
            ),
          ])
        ),
        b.forStatement(
          b.variableDeclaration("let", [
            b.variableDeclarator(b.identifier("i"), b.literal(0)),
          ]),
          b.binaryExpression("<", b.identifier("i"), b.literal(5)),
          b.updateExpression("++", b.identifier("i")),
          b.blockStatement([
            b.expressionStatement(
              b.callExpression(
                b.memberExpression(
                  b.identifier("console"),
                  b.identifier("log")
                ),
                [
                  b.templateLiteral(
                    [
                      b.templateElement({
                        raw: "Loop index: ",
                        cooked: "Loop index: ",
                      }),
                      b.templateElement({ raw: "", cooked: "" }, true),
                    ],
                    [b.identifier("i")]
                  ),
                ]
              )
            ),
          ])
        ),
        b.whileStatement(
          b.binaryExpression("<", b.identifier("foo"), b.literal(45)),
          b.blockStatement([
            b.expressionStatement(
              b.callExpression(
                b.memberExpression(
                  b.identifier("console"),
                  b.identifier("log")
                ),
                [b.literal("foo is less than 45")]
              )
            ),
            b.expressionStatement(
              b.updateExpression("++", b.identifier("foo"))
            ),
          ])
        ),
        b.tryStatement(
          b.blockStatement([
            b.expressionStatement(
              b.callExpression(b.identifier("nonExistentFunction"), [])
            ),
          ]),
          b.catchClause(
            b.identifier("error"),
            b.blockStatement([
              b.expressionStatement(
                b.callExpression(
                  b.memberExpression(
                    b.identifier("console"),
                    b.identifier("error")
                  ),
                  [b.literal("An error occurred")]
                )
              ),
            ])
          ),
          b.blockStatement([
            b.expressionStatement(
              b.callExpression(
                b.memberExpression(
                  b.identifier("console"),
                  b.identifier("log")
                ),
                [b.literal("Cleanup can go here")]
              )
            ),
          ])
        ),
        b.variableDeclaration("const", [
          b.variableDeclarator(
            b.identifier("obj"),
            b.objectExpression([
              b.property(b.identifier("key"), b.literal("value")),
              b.property(
                b.identifier("method"),
                b.functionExpression(
                  null,
                  [],
                  b.blockStatement([
                    b.expressionStatement(
                      b.callExpression(
                        b.memberExpression(
                          b.identifier("console"),
                          b.identifier("log")
                        ),
                        [b.literal("method called")]
                      )
                    ),
                  ])
                )
              ),
            ])
          ),
        ]),
        b.variableDeclaration("const", [
          b.variableDeclarator(
            b.identifier("date"),
            b.newExpression(b.identifier("Date"), [])
          ),
        ]),
        b.expressionStatement(
          b.callExpression(
            b.memberExpression(b.identifier("console"), b.identifier("log")),
            [
              b.callExpression(
                b.memberExpression(
                  b.identifier("date"),
                  b.identifier("getFullYear")
                ),
                []
              ),
            ]
          )
        ),
        b.variableDeclaration("let", [
          b.variableDeclarator(
            b.identifier("negation"),
            b.unaryExpression("-", b.identifier("foo"))
          ),
        ]),
        b.variableDeclaration("let", [
          b.variableDeclarator(
            b.identifier("sum"),
            b.binaryExpression("+", b.identifier("foo"), b.literal(5))
          ),
        ]),
        b.variableDeclaration("let", [
          b.variableDeclarator(
            b.identifier("logical"),
            b.logicalExpression(
              "&&",
              b.binaryExpression(">", b.identifier("foo"), b.literal(5)),
              b.binaryExpression("<", b.identifier("foo"), b.literal(50))
            )
          ),
        ]),
        b.variableDeclaration("const", [
          b.variableDeclarator(
            b.identifier("arrowFunc"),
            b.arrowFunctionExpression(
              [b.identifier("x")],
              b.binaryExpression("*", b.identifier("x"), b.literal(2))
            )
          ),
        ]),
        b.variableDeclaration("const", [
          b.variableDeclarator(
            b.identifier("arr"),
            b.arrayExpression([
              b.literal(1),
              b.literal(2),
              b.literal(3),
              b.callExpression(b.identifier("arrowFunc"), [b.literal(4)]),
            ])
          ),
        ]),
        b.variableDeclaration("const", [
          b.variableDeclarator(
            b.objectPattern([
              b.assignmentProperty(
                b.identifier("key"),
                b.identifier("keyValue")
              ),
            ]),
            b.identifier("obj")
          ),
        ]),
        b.variableDeclaration("const", [
          b.variableDeclarator(
            b.arrayPattern([b.identifier("firstElement")]),
            b.identifier("arr")
          ),
        ]),
        b.expressionStatement(
          b.assignmentExpression("=", b.identifier("foo"), b.literal(100))
        ),
        b.forOfStatement(
          b.variableDeclaration("const", [
            b.variableDeclarator(b.identifier("value")),
          ]),
          b.identifier("arr"),
          b.blockStatement([
            b.expressionStatement(
              b.callExpression(
                b.memberExpression(
                  b.identifier("console"),
                  b.identifier("log")
                ),
                [b.identifier("value")]
              )
            ),
          ])
        ),
        b.forInStatement(
          b.variableDeclaration("const", [
            b.variableDeclarator(b.identifier("key")),
          ]),
          b.identifier("obj"),
          b.blockStatement([
            b.ifStatement(
              b.callExpression(
                b.memberExpression(
                  b.memberExpression(
                    b.identifier("Object"),
                    b.identifier("hasOwnProperty")
                  ),
                  b.identifier("call")
                ),
                [b.identifier("obj"), b.identifier("key")]
              ),
              b.blockStatement([
                b.variableDeclaration("const", [
                  b.variableDeclarator(
                    b.identifier("element"),
                    b.memberExpression(
                      b.identifier("obj"),
                      b.identifier("key"),
                      true
                    )
                  ),
                ]),
                b.expressionStatement(
                  b.callExpression(
                    b.memberExpression(
                      b.identifier("console"),
                      b.identifier("log")
                    ),
                    [b.identifier("element")]
                  )
                ),
              ]),
              null
            ),
          ])
        ),
        b.switchStatement(b.identifier("foo"), [
          b.switchCase(b.literal(100), [
            b.expressionStatement(
              b.callExpression(
                b.memberExpression(
                  b.identifier("console"),
                  b.identifier("log")
                ),
                [b.literal("foo is 100")]
              )
            ),
            b.breakStatement(),
          ]),
          b.switchCase(null, [
            b.expressionStatement(
              b.callExpression(
                b.memberExpression(
                  b.identifier("console"),
                  b.identifier("log")
                ),
                [b.literal("default case")]
              )
            ),
          ]),
        ]),
        b.functionDeclaration(
          b.identifier("fetchData"),
          [],
          b.blockStatement([
            b.variableDeclaration("const", [
              b.variableDeclarator(
                b.identifier("data"),
                b.awaitExpression(
                  b.callExpression(b.identifier("fetch"), [
                    b.literal("https://example.com"),
                  ])
                )
              ),
            ]),
            b.returnStatement(
              b.callExpression(
                b.memberExpression(b.identifier("data"), b.identifier("json")),
                []
              )
            ),
          ]),
          false,
          true
        ),
        b.expressionStatement(
          b.callExpression(
            b.memberExpression(b.identifier("console"), b.identifier("log")),
            [
              b.callExpression(b.identifier("add"), [
                b.literal(3),
                b.literal(4),
              ]),
            ]
          )
        ),
        b.expressionStatement(
          b.callExpression(
            b.memberExpression(b.identifier("console"), b.identifier("log")),
            [
              b.chainExpression(
                b.callExpression(
                  b.memberExpression(
                    b.identifier("obj"),
                    b.identifier("method"),
                    false,
                    true
                  ),
                  [],
                  true
                )
              ),
            ]
          )
        ),
        b.variableDeclaration("const", [
          b.variableDeclarator(
            b.identifier("isFooLarge"),
            b.conditionalExpression(
              b.binaryExpression(">", b.identifier("foo"), b.literal(100)),
              b.literal("Large"),
              b.literal("Small")
            )
          ),
        ]),
        b.expressionStatement(
          b.callExpression(
            b.memberExpression(b.identifier("console"), b.identifier("log")),
            [
              b.templateLiteral(
                [
                  b.templateElement({ raw: "foo is ", cooked: "foo is " }),
                  b.templateElement({ raw: "", cooked: "" }, true),
                ],
                [b.identifier("isFooLarge")]
              ),
            ]
          )
        ),
      ]);

    const generatedAST = generateAST(builders);

    expect(generatedAST).toMatchObject(AST);

    const evaluatedCode = generate(generatedAST);
    // console.log(evaluatedCode);

    expect(evaluatedCode).toMatchObject(code);
  });
});
