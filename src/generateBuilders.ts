import * as Types from "./types";
import { BaseNode } from "./types";
import * as builder from "./builders";

export const generateBuilders = (prefix = "b") => {
  //
  function TextWrapper(text) {
    this.text = text;
  }

  const build = (node: BaseNode, parent?: BaseNode) => {
    if (typeof node != "object") {
      if (typeof node === "string") return `"${node}"`;
      if (typeof node == "bigint") return `${node}n`;
      return String(node);
    }
    if (!node) return "null";
    if (node instanceof RegExp) return node;

    if (Array.isArray(node))
      return `[${node.map((n) => build(n, parent)).join(", ")}]`;

    if (!node.type) {
      if (node instanceof TextWrapper) return node["text"];
      return `${prefix}.jsonExpression(${JSON.stringify(node)})`;
    }
    if (builders.hasOwnProperty(node.type))
      return builders[node.type](node, parent);

    throw Error("Unknown type: " + node.type);
  };

  const buildFunction = (node: BaseNode) => `(${prefix}) => ${build(node)}`;

  const safeEval = (codeJs: string) =>
    new Function("b", `return ${codeJs}`)(builder);

  const helper = (parent: Types.Node, name: string, ...params) => {
    const args: any[] = [];
    let has = false;
    params.reverse().forEach((x) => {
      if (x === undefined) {
        if (has) args.push("false");
      } else {
        args.push(build(x, parent));
        has = true;
      }
    });
    return `${prefix}.${name}(${args.reverse().join(", ")})`;
  };

  const builders = {
    ArrayExpression: (n: Types.ArrayExpression, parent: Node) =>
      helper(n, "arrayExpression", n.elements),
    ArrayPattern: (n: Types.ArrayPattern, parent: Node) =>
      helper(n, "arrayPattern", n.elements),
    ArrowFunctionExpression: (n: Types.ArrowFunctionExpression, parent: Node) =>
      helper(
        n,
        "arrowFunctionExpression",
        n.params,
        n.body,
        n.async || undefined
      ),
    AssignmentExpression: (n: Types.AssignmentExpression, parent: Node) =>
      helper(n, "assignmentExpression", n.operator, n.left, n.right),
    AssignmentProperty: (n: Types.AssignmentProperty, parent: Node) =>
      helper(
        n,
        "assignmentProperty",
        n.key,
        n.value || undefined,
        n.shorthand || undefined
      ),
    AwaitExpression: (n: Types.AwaitExpression, parent: Node) =>
      helper(n, "awaitExpression", n.argument),
    BinaryExpression: (n: Types.BinaryExpression, parent: Node) =>
      helper(n, "binaryExpression", n.operator, n.left, n.right),
    BlockStatement: (n: Types.BlockStatement, parent: Node) =>
      helper(n, "blockStatement", n.body),
    BreakStatement: (n: Types.BreakStatement, parent: Node) => {
      if (n.label) return helper(n, "breakStatement", n.label);
      return helper(n, "breakStatement");
    },
    CallExpression: (n: Types.SimpleCallExpression, parent: Node) =>
      helper(
        n,
        "callExpression",
        n.callee,
        n.arguments,
        n.optional || undefined
      ),
    CatchClause: (n: Types.CatchClause, parent: Node) =>
      helper(n, "catchClause", n.param, n.body),
    ChainExpression: (n: Types.ChainExpression, parent: Node) =>
      helper(n, "chainExpression", n.expression),
    ConditionalExpression: (n: Types.ConditionalExpression, parent: Node) =>
      helper(n, "conditionalExpression", n.test, n.consequent, n.alternate),
    ContinueStatement: (n: Types.ContinueStatement, parent: Node) =>
      helper(n, "continueStatement", n.label),
    DoWhileStatement: (n: Types.DoWhileStatement, parent: Node) =>
      helper(n, "doWhileStatement", n.body, n.test),
    EmptyStatement: (n, parent: Node) => helper(n, "emptyStatement"),
    ExpressionStatement: (n: Types.ExpressionStatement, parent: Node) =>
      helper(n, "expressionStatement", n.expression),
    ForInStatement: (n: Types.ForInStatement, parent: Node) =>
      helper(n, "forInStatement", n.left, n.right, n.body),
    ForOfStatement: (n: Types.ForOfStatement, parent: Node) =>
      helper(n, "forOfStatement", n.left, n.right, n.body),
    ForStatement: (n: Types.ForStatement, parent: Node) =>
      helper(n, "forStatement", n.init, n.test, n.update, n.body),
    FunctionDeclaration: (n: Types.FunctionDeclaration, parent: Node) =>
      helper(
        n,
        "functionDeclaration",
        n.id,
        n.params,
        n.body,
        n.generator || undefined,
        n.async || undefined
      ),
    FunctionExpression: (n: Types.FunctionExpression, parent: Node) =>
      helper(
        n,
        "functionExpression",
        n.id || null,
        n.params,
        n.body,
        n.generator || undefined,
        n.async || undefined
      ),
    Identifier: (n: Types.Identifier, parent: Node) =>
      helper(n, "identifier", n.name),
    IfStatement: (n: Types.IfStatement, parent: Node) =>
      helper(n, "ifStatement", n.test, n.consequent, n.alternate),
    ImportDeclaration: (n: Types.ImportDeclaration, parent: Node) =>
      helper(n, "importDeclaration", n.specifiers, n.source),
    ImportDefaultSpecifier: (n: Types.ImportDefaultSpecifier, parent: Node) =>
      helper(n, "importDefaultSpecifier", n.local),
    ImportNamespaceSpecifier: (
      n: Types.ImportNamespaceSpecifier,
      parent: Node
    ) => helper(n, "importNamespaceSpecifier", n.local),
    ImportSpecifier: (n: Types.ImportSpecifier, parent: Node) =>
      helper(n, "importSpecifier", n.imported, n.local),
    JsonExpression: (n: Types.JsonExpression, parent: Node) =>
      helper(n, "jsonExpression", JSON.stringify(n.body)),
    Literal: (n: Types.Literal, parent: Node) => {
      if (n.hasOwnProperty("bigint") && n["bigint"])
        return helper(n, "literal", n.value);
      return helper(n, "literal", n.value);
    },
    LogicalExpression: (n: Types.LogicalExpression, parent: Node) =>
      helper(n, "logicalExpression", n.operator, n.left, n.right),
    MemberExpression: (n: Types.MemberExpression, parent: Node) =>
      helper(
        n,
        "memberExpression",
        n.object,
        n.property,
        n.computed || undefined,
        n.optional || undefined
      ),
    NewExpression: (n: Types.NewExpression, parent: Node) =>
      helper(n, "newExpression", n.callee, n.arguments),
    ObjectExpression: (n: Types.ObjectExpression, parent: Node) =>
      helper(n, "objectExpression", n.properties),
    ObjectPattern: (n: Types.ObjectPattern, parent: Node) =>
      helper(n, "objectPattern", n.properties),
    Program: (n: Types.Program, parent: Node) => helper(n, "program", n.body),
    Property: (
      n: Types.Property,
      parent: Types.ObjectExpression | Types.ObjectPattern
    ) => {
      if (parent.type === "ObjectPattern") {
        return helper(
          n,
          "assignmentProperty",
          n.key,
          n.value,
          n.shorthand || undefined
        );
      }
      if (parent.type === "ObjectExpression")
        return helper(
          n,
          "property",
          n.key,
          n.value,
          n.shorthand || undefined,
          n.computed || undefined
        );
    },
    ReturnStatement: (n: Types.ReturnStatement, parent: Node) =>
      helper(n, "returnStatement", n.argument),
    SwitchCase: (n: Types.SwitchCase, parent: Node) =>
      helper(n, "switchCase", n.test, n.consequent),
    SwitchStatement: (n: Types.SwitchStatement, parent: Node) =>
      helper(n, "switchStatement", n.discriminant, n.cases),
    TemplateElement: (n: Types.TemplateElement, parent: Node) => {
      if (n.tail == true)
        return helper(
          n,
          "templateElement",
          new TextWrapper(JSON.stringify(n.value)),
          true
        );
      return helper(
        n,
        "templateElement",
        new TextWrapper(JSON.stringify(n.value))
      );
    },
    TemplateLiteral: (n: Types.TemplateLiteral, parent: Node) =>
      helper(n, "templateLiteral", n.quasis, n.expressions),
    ThrowStatement: (n: Types.ThrowStatement, parent: Node) =>
      helper(n, "throwStatement", n.argument),
    TryStatement: (n: Types.TryStatement, parent: Node) =>
      helper(n, "tryStatement", n.block, n.handler, n.finalizer),
    UnaryExpression: (n: Types.UnaryExpression, parent: Node) =>
      helper(n, "unaryExpression", n.operator, n.argument),
    UpdateExpression: (n: Types.UpdateExpression, parent: Node) =>
      n.prefix == true
        ? helper(n, "updateExpression", n.operator, n.argument, true)
        : helper(n, "updateExpression", n.operator, n.argument),
    VariableDeclaration: (n: Types.VariableDeclaration, parent: Node) =>
      helper(n, "variableDeclaration", n.kind, n.declarations),
    VariableDeclarator: (n: Types.VariableDeclarator, parent: Node) =>
      helper(n, "variableDeclarator", n.id, n.init || undefined),
    WhileStatement: (n: Types.WhileStatement, parent: Node) =>
      helper(n, "whileStatement", n.test, n.body),
  };

  return { build, buildFunction, safeEval, builders };
};
