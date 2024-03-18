import { describe, expect, it } from "vitest";
import { serialize } from "../../src/generators";
import { tokenizer } from "../utils/tokenizer";
import {
  identifier,
  assignmentExpression,
  templateLiteral,
  templateElement,
} from "../../src/builders";
import { cleanAST, parseAST, parseOmniAST } from "../../src/utils";

const acorn = require("acorn");
const options = { ecmaVersion: "latest" };
const dir = (x) => console.dir(x, { depth: 12 });

describe("TemplateLiteral", () => {
  //
  it("Should Works", () => {
    //
    const script = "text = `start${foo}middle${`${bar}/${baz}`}\\end`";

    const acornAst = cleanAST(acorn.parse(script, options)).body[0];
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

    console.log(script, "\n>>");
    console.log(code);

    expect(script).toMatchObject(code);
  });
});
