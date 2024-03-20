import { acornParse } from "../utils/acornParse";
import { builder, serialize } from "../../dist";
import { cleanAST, parseAST, parseOmniAST } from "../../src/utils";
import { describe, expect, it } from "vitest";

const log = false;
const dir = (x) => log && console.dir(x, { depth: 12 });

const { identifier, assignmentExpression, templateLiteral, templateElement } =
  builder;

describe("TemplateLiteral", () => {
  //
  it("Should Works", () => {
    //
    const script = "text = `start${foo}middle${`${bar}/${baz}`}\\end`";

    const acornAst = cleanAST(acornParse(script)).body[0];
    const omniAst = parseOmniAST(acornAst);

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

    const code = `${serialize(omniAST)}`;

    dir(script);
    dir(code);

    expect(script).toMatchObject(code);
  });
});
