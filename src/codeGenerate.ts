import * as Types from "./types";
import { BaseNode } from "./types";
import { serialize } from "./JsonGenerate";

const comma = ", ";

export const generate = (node: BaseNode | BaseNode[]) => {
  if (!node) return "";
  if (Array.isArray(node)) return node.map(generate).join(comma);
  if (!node.type) return JSON.stringify(node);
  if (nodes.hasOwnProperty(node.type)) return nodes[node.type](node);
  throw Error("Unknown type: " + node.type);
};

const paren = (str: string) => `(${str})`;

export const ArrayExpression = (node: Types.ArrayExpression) => {
  return `[${generate(node.elements)}]`;
};

export const ArrayPattern = (node: Types.ArrayPattern) => {
  return `[${generate(node.elements)}]`;
};

export const ArrowFunctionExpression = (
  node: Types.ArrowFunctionExpression
) => {
  const params = generate(node.params);
  const body =
    node.body.type == "AssignmentExpression" ||
    node.body.type == "BinaryExpression" ||
    node.body.type == "ObjectExpression" ||
    node.body.type == "JsonExpression" ||
    false
      ? paren(generate(node.body))
      : generate(node.body);
  return `${node.async ? "async " : ""}(${params}) => ${body}`;
};

export const AssignmentExpression = (node: Types.AssignmentExpression) => {
  const left = generate(node.left);
  const right = generate(node.right);
  return `${left} ${node.operator} ${right}`;
};

export const AwaitExpression = (node: Types.AwaitExpression) => {
  return "await " + generate(node.argument);
};

export const BinaryExpression = (node: Types.BinaryExpression) => {
  const left = generate(node.left);
  const right = generate(node.right);
  return `${left} ${node.operator} ${right}`;
};

export const BlockStatement = (node: Types.BlockStatement) => {
  const statements = node.body
    .map(generate)
    .filter((x) => x != ";")
    .join("; ");
  return `{ ${statements ? statements + "; " : ""}}`;
};

export const BreakStatement = () => {
  return "break";
};

export const CallExpression = (node: Types.CallExpression) => {
  return `${generate(node.callee)}(${generate(node.arguments)})`;
};

export const ChainExpression = (node: Types.ChainExpression) => {
  return generate(node.expression);
};

export const ConditionalExpression = (node: Types.ConditionalExpression) => {
  return `${generate(node.test)} ? ${generate(node.consequent)} : ${generate(
    node.alternate
  )}`;
};

export const ContinueStatement = () => {
  return "continue";
};

export const ExpressionStatement = (node: Types.ExpressionStatement) => {
  return generate(node.expression);
};

export const EmptyStatement = (node: Types.EmptyStatement) => {
  return ";";
};

export const DoWhileStatement = (node: Types.DoWhileStatement) => {
  return `do ${generate(node.body)} while (${generate(node.test)})`;
};

export const ForInStatement = (node: Types.ForInStatement) => {
  return `for (${generate(node.left)} in ${generate(node.right)}) ${generate(
    node.body
  )}`;
};

export const ForOfStatement = (node: Types.ForOfStatement) => {
  return `for (${generate(node.left)} of ${generate(node.right)}) ${generate(
    node.body
  )}`;
};

export const ForStatement = (node: Types.ForStatement) => {
  return `for (${generate(node.init)}; ${generate(node.test)}; ${generate(
    node.update
  )}) ${generate(node.body)}`;
};

export const FunctionDeclaration = (node: Types.FunctionExpression) => {
  const params = node.params.map(Identifier as any).join(comma);
  return `${node.async ? "async " : ""}function ${generate(
    node.id
  )}(${params}) ${generate(node.body)}`;
};

export const FunctionExpression = (node: Types.FunctionExpression) => {
  const params = generate(node.params);
  return `${node.async ? "async " : ""}function ${generate(
    node.id
  )}(${params}) ${generate(node.body)}`;
};

export const Identifier = (node: Types.Identifier) => {
  return node.name;
};

export const IfStatement = (node: Types.IfStatement) => {
  return `if (${generate(node.test)}) ${generate(node.consequent)}${
    node.alternate ? ` else ${generate(node.alternate)}` : ""
  }`;
};

export const JsonExpression = (node) => {
  return serialize(node.body);
};

export const Literal = (node) => {
  return typeof node.value == "string" || node.bigint
    ? node.raw
    : String(node.value);
};

export const LogicalExpression = (node: Types.LogicalExpression) => {
  return `${generate(node.left)} ${node.operator} ${generate(node.right)}`;
};

export const MemberExpression = (node: Types.MemberExpression) => {
  let str = [generate(node.object)];
  if (node.optional) str.push(node.computed ? "?." : "?");
  str.push(node.computed ? "[" : ".");
  str.push(generate(node.property));
  if (node.computed) str.push("]");
  return str.join("");
};

export const NewExpression = (node: Types.NewExpression) => {
  return `new ${generate(node.callee)}(${generate(node.arguments)})`;
};

export const ObjectExpression = (node: Types.ObjectExpression) => {
  const code = node.properties.map(generate).join(", ");
  return code.length == 0 ? "{}" : `{ ${code} }`;
};

export const ObjectPattern = (node: Types.ObjectPattern) => {
  const code = node.properties.map(generate).join(", ");
  return code.length == 0 ? "{ }" : `{ ${code} }`;
};

export const Program = (node: Types.Program) => {
  return node.body.map(generate).join("; ");
};

export const Property = (node: Types.Property) => {
  return `${
    node.computed ? `[${generate(node.key)}]` : generate(node.key)
  }: ${generate(node.value)}`;
};

export const ReturnStatement = (node: Types.ReturnStatement) => {
  return "return " + generate(node.argument);
};

export const SwitchCase = (node: Types.SwitchCase) => {
  return (
    (node.test ? `case ${generate(node.test)}: ` : " default: ") +
    node.consequent.map(generate).join("; ")
  );
};

export const SwitchStatement = (node: Types.SwitchStatement) => {
  return `switch (${generate(node.discriminant)}) { ${node.cases
    .map(generate)
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
          generate(x) +
          (x.tail ? "" : "${" + generate(node.expressions[i]) + "}")
      )
      .join("") +
    "`"
  );
};

export const ThrowStatement = (node: Types.ThrowStatement) => {
  return "throw " + generate(node.argument);
};

export const TryStatement = (node: Types.TryStatement) => {
  let code = `try ${generate(node.block)}`;
  if (node.handler)
    code += ` catch (${generate(node.handler.param)}) ${generate(
      node.handler.body
    )}`;
  return code + (node.finalizer ? `finally ${generate(node.finalizer)}` : "");
};

export const UnaryExpression = (node: Types.UnaryExpression) => {
  return (
    node.operator +
    (node.operator.length == 1 ? "" : " ") +
    generate(node.argument)
  );
};

export const UpdateExpression = (node: Types.UpdateExpression) => {
  return node.prefix == true
    ? node.operator + generate(node.argument)
    : generate(node.argument) + node.operator;
};

export const VariableDeclaration = (node: Types.VariableDeclaration) => {
  return `${node.kind} ${node.declarations.map(VariableDeclarator).join(", ")}`;
};

export const VariableDeclarator = (node: Types.VariableDeclarator) => {
  if (!node.init) return generate(node.id);
  return `${generate(node.id)} = ${generate(node.init)}`;
};

export const WhileStatement = (node: Types.WhileStatement) => {
  return `while (${generate(node.test)}) ${generate(node.body)}`;
};

const nodes = {
  generate,
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
