import * as Types from "./types";
import { generate } from "./JsonGenerate";
import { BaseNode } from "./types";

const comma = ", ";

export const serialize = (node: BaseNode) => {
  if (!node) return "";
  if (!node.type) return JSON.stringify(node);
  if (nodes.hasOwnProperty(node.type)) return nodes[node.type](node);
  throw Error("Unknown type: " + node.type);
};

export const ArrayExpression = (node: Types.ArrayExpression) => {
  return `[${node.elements.map(serialize).join(comma)}]`;
};

export const ArrowFunctionExpression = (
  node: Types.ArrowFunctionExpression
) => {
  const params = node.params.map(Identifier as any).join(comma);
  return `${node.async ? "async " : ""}(${params}) => ${serialize(node.body)}`;
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
  const statements = node.body.map(serialize).join("; ");
  return `{ ${statements}; }`;
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

export const ForExpression = (node: Types.ForStatement) => {
  return `for (${serialize(node.init)}; ${serialize(node.test)}; ${serialize(
    node.update
  )}) ${node.body}`;
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

export const FunctionExpression = (node: Types.FunctionExpression) => {
  const params = node.params.map(Identifier as any).join(comma);
  return `${node.async ? "async " : ""}function ${serialize(
    node.id
  )}(${params}) ${serialize(node.body)}`;
};

export const Identifier = (node: Types.Identifier) => {
  return node.name;
};

export const IfStatement = (node: Types.IfStatement) => {
  return `if (${serialize(node.test)}) ${serialize(node.consequent)} ${
    node.alternate ? ` else ${serialize(node.alternate)}` : ""
  }`;
};

export const JsonExpression = (node) => {
  return generate(node.body);
};

export const Literal = (node) => {
  return typeof node.value == "string" ? node.raw : String(node.value);
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
  return code.length == 0 ? "{ }" : `{ ${code} }`;
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
  return node.prefix
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
  return `while (${serialize(node.test)}) { ${serialize(node.body)} }`;
};

const nodes = {
  serialize,
  JsonExpression,
  AssignmentExpression,
  ExpressionStatement,
  Identifier,
  Literal,
  BlockStatement,
  ArrowFunctionExpression,
  FunctionExpression,
  CallExpression,
  MemberExpression,
  ArrayExpression,
  VariableDeclaration,
  VariableDeclarator,
  ReturnStatement,
  IfStatement,
  BreakStatement,
  ContinueStatement,
  ThrowStatement,
  TryStatement,
  ForStatement,
  ForInStatement,
  ForOfStatement,
  WhileStatement,
  SwitchStatement,
  SwitchCase,
  BinaryExpression,
  UpdateExpression,
  ForExpression,
  ChainExpression,
  ConditionalExpression,
  LogicalExpression,
  UnaryExpression,
  ObjectExpression,
  Property,
  AwaitExpression,
  NewExpression,
  TemplateLiteral,
  TemplateElement,
};
