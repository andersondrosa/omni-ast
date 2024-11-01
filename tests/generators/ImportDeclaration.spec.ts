import { acornParse } from "../utils/acornParse";
import { builders as b, clearAST, generate, generateBuilders } from "../../src";
import { describe, expect, it } from "vitest";
import { tokenizer } from "../utils/tokenizer";
import { importSpecifier, literal } from "../../src/builders";

describe("ImportDeclaration", () => {
  //
  it("Should generate code correctly", () => {
    //
    const script = [
      `import { foo, bar as Bar } from "baz";`,
      `import * as Ramda from "ramda";`,
      `import main from "main";`,
      `import "dotenv/config";`,
      "const arrow = () => {}",
    ].join("\n");

    const acornAST = acornParse(script);

    const cleanAcornAST = clearAST(acornAST);

    const { buildFunction } = generateBuilders();

    const generatedBuilders = buildFunction(cleanAcornAST);

    // console.log(generatedBuilders);

    const ast = b.program([
      b.importDeclaration(
        [
          b.importSpecifier(b.identifier("foo"), b.identifier("foo")),
          b.importSpecifier(b.identifier("bar"), b.identifier("Bar")),
        ],
        b.literal("baz")
      ),
      b.importDeclaration(
        [b.importNamespaceSpecifier(b.identifier("Ramda"))],
        b.literal("ramda")
      ),
      b.importDeclaration(
        [b.importDefaultSpecifier(b.identifier("main"))],
        b.literal("main")
      ),
      b.importDeclaration([], b.literal("dotenv/config")),
      b.variableDeclaration("const", [
        b.variableDeclarator(
          b.identifier("arrow"),
          b.arrowFunctionExpression([], b.blockStatement([]))
        ),
      ]),
    ]);

    // console.dir(ast, { depth: 5 });

    const code = generate(ast);
    // console.log(code);

    expect(tokenizer(script)).toMatchObject(tokenizer(code));
  });
});
