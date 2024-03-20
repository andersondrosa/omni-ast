import * as Types from "./types";
import { BaseNode } from "./types";
import { generate } from "./JsonGenerate";
import * as builder from "./builders";

const comma = ", ";

export const serialize = (node: BaseNode) => {
  if (!node) return "";
  if (!node.type) return JSON.stringify(node);
  if (nodes.hasOwnProperty(node.type)) return nodes[node.type](node);
  throw Error("Unknown type: " + node.type);
};

const paren = (str: string) => `(${str})`;

export const ArrayExpression = (node: Types.ArrayExpression) => {
  return `[${node.elements.map(serialize).join(comma)}]`;
};

export const ArrayPattern = (node: Types.ArrayPattern) => {
  return `[${node.elements.map(serialize).join(comma)}]`;
};

export const ArrowFunctionExpression = (
  node: Types.ArrowFunctionExpression
) => {
  const params = node.params.map(serialize).join(comma);
  const body =
    node.body.type == "AssignmentExpression" ||
    node.body.type == "BinaryExpression" ||
    node.body.type == "ObjectExpression" ||
    node.body.type == "JsonExpression" ||
    false
      ? paren(serialize(node.body))
      : serialize(node.body);
  return `${node.async ? "async " : ""}(${params}) => ${body}`;
};

export const AssignmentExpression = (node: Types.AssignmentExpression) => {
  const left = serialize(node.left);
  const right = serialize(node.right);
  return `${left} ${node.operator} ${right}`;
};

export const AwaitExpression = (node: Types.AwaitExpression) => {
  return "await " + serialize(node.argument);
};

export const BinaryExpression = (node: Types.BinaryExpression) => {
  const left = serialize(node.left);
  const right = serialize(node.right);
  return `${left} ${node.operator} ${right}`;
};

export const BlockStatement = (node: Types.BlockStatement) => {
  const statements = node.body
    .map(serialize)
    .filter((x) => x != ";")
    .join("; ");
  return `{ ${statements ? statements + "; " : ""}}`;
};

export const BreakStatement = () => {
  return "break";
};

export const CallExpression = (node: Types.CallExpression) => {
  return `${serialize(node.callee)}(${node.arguments
    .map(serialize)
    .join(comma)})`;
};

export const ChainExpression = (node: Types.ChainExpression) => {
  return serialize(node.expression);
};

export const ConditionalExpression = (node: Types.ConditionalExpression) => {
  return `${serialize(node.test)} ? ${serialize(node.consequent)} : ${serialize(
    node.alternate
  )}`;
};

export const ContinueStatement = () => {
  return "continue";
};

export const ExpressionStatement = (node: Types.ExpressionStatement) => {
  return serialize(node.expression);
};

export const EmptyStatement = (node: Types.EmptyStatement) => {
  return ";";
};

export const DoWhileStatement = (node: Types.DoWhileStatement) => {
  return `do ${serialize(node.body)} while (${serialize(node.test)})`;
};

export const ForInStatement = (node: Types.ForInStatement) => {
  return `for (${serialize(node.left)} in ${serialize(node.right)}) ${serialize(
    node.body
  )}`;
};

export const ForOfStatement = (node: Types.ForOfStatement) => {
  return `for (${serialize(node.left)} of ${serialize(node.right)}) ${serialize(
    node.body
  )}`;
};

export const ForStatement = (node: Types.ForStatement) => {
  return `for (${serialize(node.init)}; ${serialize(node.test)}; ${serialize(
    node.update
  )}) ${serialize(node.body)}`;
};

export const FunctionDeclaration = (node: Types.FunctionExpression) => {
  const params = node.params.map(Identifier as any).join(comma);
  return `${node.async ? "async " : ""}function ${serialize(
    node.id
  )}(${params}) ${serialize(node.body)}`;
};

export const FunctionExpression = (node: Types.FunctionExpression) => {
  const params = node.params.map(serialize).join(comma);
  return `${node.async ? "async " : ""}function ${serialize(
    node.id
  )}(${params}) ${serialize(node.body)}`;
};

export const Identifier = (node: Types.Identifier) => {
  return node.name;
};

export const IfStatement = (node: Types.IfStatement) => {
  return `if (${serialize(node.test)}) ${serialize(node.consequent)}${
    node.alternate ? ` else ${serialize(node.alternate)}` : ""
  }`;
};

export const JsonExpression = (node) => {
  return generate(node.body);
};

export const Literal = (node) => {
  return typeof node.value == "string" || node.bigint
    ? node.raw
    : String(node.value);
};

export const LogicalExpression = (node: Types.LogicalExpression) => {
  return `${serialize(node.left)} ${node.operator} ${serialize(node.right)}`;
};

export const MemberExpression = (node: Types.MemberExpression) => {
  let str = [serialize(node.object)];
  if (node.optional) str.push(node.computed ? "?." : "?");
  str.push(node.computed ? "[" : ".");
  str.push(serialize(node.property));
  if (node.computed) str.push("]");
  return str.join("");
};

export const NewExpression = (node: Types.NewExpression) => {
  return `new ${serialize(node.callee)}(${node.arguments
    .map(serialize)
    .join(comma)})`;
};

export const ObjectExpression = (node: Types.ObjectExpression) => {
  const code = node.properties.map(serialize).join(", ");
  return code.length == 0 ? "{}" : `{ ${code} }`;
};

export const ObjectPattern = (node: Types.ObjectPattern) => {
  const code = node.properties.map(serialize).join(", ");
  return code.length == 0 ? "{ }" : `{ ${code} }`;
};

export const Program = (node: Types.Program) => {
  return node.body.map(serialize).join("; ");
};

export const Property = (node: Types.Property) => {
  return `${
    node.computed ? `[${serialize(node.key)}]` : serialize(node.key)
  }: ${serialize(node.value)}`;
};

export const ReturnStatement = (node: Types.ReturnStatement) => {
  return "return " + serialize(node.argument);
};

export const SwitchCase = (node: Types.SwitchCase) => {
  return (
    (node.test ? `case ${serialize(node.test)}: ` : " default: ") +
    node.consequent.map(serialize).join("; ")
  );
};

export const SwitchStatement = (node: Types.SwitchStatement) => {
  return `switch (${serialize(node.discriminant)}) { ${node.cases
    .map(serialize)
    .join("; ")}; }`;
};

export const TemplateElement = (node: Types.TemplateElement) => {
  return node.value.raw;
};

export const TemplateLiteral = (node: Types.TemplateLiteral) => {
  return (
    "`" +
    node.quasis
      .map(
        (x, i) =>
          serialize(x) +
          (x.tail ? "" : "${" + serialize(node.expressions[i]) + "}")
      )
      .join("") +
    "`"
  );
};

export const ThrowStatement = (node: Types.ThrowStatement) => {
  return "throw " + serialize(node.argument);
};

export const TryStatement = (node: Types.TryStatement) => {
  let code = `try ${serialize(node.block)}`;
  if (node.handler)
    code += ` catch (${serialize(node.handler.param)}) ${serialize(
      node.handler.body
    )}`;
  return code + (node.finalizer ? `finally ${serialize(node.finalizer)}` : "");
};

export const UnaryExpression = (node: Types.UnaryExpression) => {
  return (
    node.operator +
    (node.operator.length == 1 ? "" : " ") +
    serialize(node.argument)
  );
};

export const UpdateExpression = (node: Types.UpdateExpression) => {
  return node.prefix == true
    ? node.operator + serialize(node.argument)
    : serialize(node.argument) + node.operator;
};

export const VariableDeclaration = (node: Types.VariableDeclaration) => {
  return `${node.kind} ${node.declarations.map(VariableDeclarator).join(", ")}`;
};

export const VariableDeclarator = (node: Types.VariableDeclarator) => {
  if (!node.init) return serialize(node.id);
  return `${serialize(node.id)} = ${serialize(node.init)}`;
};

export const WhileStatement = (node: Types.WhileStatement) => {
  return `while (${serialize(node.test)}) ${serialize(node.body)}`;
};

const nodes = {
  serialize,
  ArrayExpression,
  ArrayPattern,
  ArrowFunctionExpression,
  AssignmentExpression,
  AwaitExpression,
  BinaryExpression,
  BlockStatement,
  BreakStatement,
  CallExpression,
  ChainExpression,
  ConditionalExpression,
  ContinueStatement,
  EmptyStatement,
  ExpressionStatement,
  ForInStatement,
  ForOfStatement,
  ForStatement,
  FunctionDeclaration,
  FunctionExpression,
  Identifier,
  IfStatement,
  JsonExpression,
  Literal,
  LogicalExpression,
  MemberExpression,
  NewExpression,
  ObjectExpression,
  ObjectPattern,
  Program,
  Property,
  ReturnStatement,
  SwitchCase,
  SwitchStatement,
  TemplateElement,
  TemplateLiteral,
  ThrowStatement,
  TryStatement,
  UnaryExpression,
  UpdateExpression,
  VariableDeclaration,
  VariableDeclarator,
  WhileStatement,
  DoWhileStatement,
};

export const buildersGenerate = (prefix = "b") => {
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

  const evaluate = (generatedFunction: string) =>
    eval(generatedFunction)(builder);

  const helper = (parent: Types.Node, name: string, ...params) => {
    const args = [];
    let has = false;
    params.reverse().forEach((x) => {
      if (x === undefined) {
        if (has) args.push("null");
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
      helper(n, "assignmentProperty", n.key, n.value, n.shorthand),
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
        n.async || undefined
      ),
    FunctionExpression: (n: Types.FunctionExpression, parent: Node) =>
      helper(
        n,
        "functionExpression",
        n.id || undefined,
        n.params,
        n.body,
        n.async || undefined
      ),
    Identifier: (n: Types.Identifier, parent: Node) =>
      helper(n, "identifier", n.name),
    IfStatement: (n: Types.IfStatement, parent: Node) =>
      helper(n, "ifStatement", n.test, n.consequent, n.alternate),
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
        return helper(n, "assignmentProperty", n.key, n.value, n.shorthand);
      }
      if (parent.type === "ObjectExpression")
        return helper(n, "property", n.key, n.value, n.shorthand);
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
      helper(n, "variableDeclarator", n.id, n.init),
    WhileStatement: (n: Types.WhileStatement, parent: Node) =>
      helper(n, "whileStatement", n.test, n.body),
  };

  return { build, buildFunction, evaluate, builders };
};
