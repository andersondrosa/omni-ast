import { acornParse } from "../utils/acornParse";
import { builders, cleanAST, generate, parseAST, simplify } from "../../src";
import { describe, expect, it } from "vitest";

const { identifier, assignmentExpression, templateLiteral, templateElement } =
  builders;

describe("TemplateLiteral", () => {
  //
  it("Should generate code correctly", () => {
    //
    const script = "text = `start${foo}middle${`${bar}/${baz}`}\\end`";

    const acornAst = cleanAST(acornParse(script)).body[0];
    const omniAst = simplify(acornAst);

    expect(acornAst).toMatchObject(parseAST(omniAst));

    const omniAST = assignmentExpression(
      "=",
      identifier("text"),
      templateLiteral(
        [
          templateElement({ raw: "start", cooked: "start" }),
          templateElement({ raw: "middle", cooked: "middle" }),
          templateElement({ raw: "\\end", cooked: "end" }, true),
        ],
        [
          identifier("foo"),
          templateLiteral(
            [
              templateElement({ raw: "", cooked: "" }),
              templateElement({ raw: "/", cooked: "/" }),
              templateElement({ raw: "", cooked: "" }, true),
            ],
            [identifier("bar"), identifier("baz")]
          ),
        ]
      )
    );

    const code = `${generate(omniAST)}`;

    expect(script).toMatchObject(code);
  });
});
