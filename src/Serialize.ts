import * as Types from "./types";
import { stringify } from "./JsonGenerate";
import { BaseNode } from "./types";

// (data: JsonTypes | BaseNode) {
//   if (!data || typeof data != "object") return JSON.stringify(data);

//   if (Array.isArray(data)) return data.map((x) => generate(x)).join("; ");

//   if (data.hasOwnProperty("type") && (data as any).type) {
//     const node = data as BaseNode;
//     if (nodes.hasOwnProperty(node.type)) return nodes[node.type](node);
//     throw Error("Unknown type: " + node.type);
//   }
// }

export const serialize = (node: BaseNode) => {
  if (!node) return "";
  if (!node.type) return JSON.stringify(node);
  if (nodes.hasOwnProperty(node.type)) return nodes[node.type](node);
  throw Error("Unknown type: " + node.type);
};

export const generate = serialize;

const comma = ", ";

export const JsonExpression = (node) => {
  return stringify(node.body);
};

export const Identifier = (node: Types.Identifier) => {
  return node.name;
};

export const Literal = (node) => {
  return typeof node.value == "string" ? node.raw : String(node.value);
};

export const BlockStatement = (node: Types.BlockStatement) => {
  const statements = node.body.map(serialize).join("; ");
  return `{ ${statements} }`;
};

export const ExpressionStatement = (node: Types.ExpressionStatement) => {
  return serialize(node.expression);
};

export const MemberExpression = (node: Types.MemberExpression) => {
  return serialize(node.object) + "." + serialize(node.property);
};

export const CallExpression = (node: Types.CallExpression) => {
  return `${serialize(node.callee)}(${node.arguments
    .map(serialize)
    .join(comma)})`;
};

export const ArrayExpression = (node: Types.ArrayExpression) => {
  return `[${node.elements.map(serialize).join(comma)}]`;
};

export const ArrowFunctionExpression = (
  node: Types.ArrowFunctionExpression
) => {
  const params = node.params.map(Identifier as any).join(comma);
  return `(${params}) => ${serialize(node.body)}`;
};

export const FunctionExpression = (node: Types.FunctionExpression) => {
  const params = node.params.map(Identifier as any).join(comma);
  return `function ${serialize(node.id)}(${params}) ${serialize(node.body)}`;
};

export const VariableDeclaration = (stmt: Types.VariableDeclaration) => {
  return `${stmt.kind} ${stmt.declarations.map(VariableDeclarator).join(", ")}`;
};

export const VariableDeclarator = (stmt: Types.VariableDeclarator) => {
  if (!stmt.init) return serialize(stmt.id);
  return `${serialize(stmt.id)} = ${serialize(stmt.init)}`;
};

export const ReturnStatement = (stmt: Types.ReturnStatement) => {
  return "return " + serialize(stmt.argument);
};

export const IfStatement = (stmt: Types.IfStatement) => {
  let code = `if (${serialize(stmt.test)}) ${serialize(stmt.consequent)}`;
  if (stmt.alternate) {
    code += ` else ${serialize(stmt.alternate)}`;
  }
  return code;
};

export const BreakStatement = () => {
  return "break";
};

export const ContinueStatement = (node) => {
  return "continue";
};

export const ThrowStatement = (node: Types.ThrowStatement) => {
  return "throw " + serialize(node.argument);
};

export const TryStatement = (node: Types.TryStatement) => {
  let code = `try { ${serialize(node.block)} }`;
  if (node.handler) {
    code += `catch (${serialize(node.handler.param)}) { ${serialize(
      node.handler.body
    )} }`;
  }
  if (node.finalizer) return code + `finally { ${serialize(node.finalizer)} }`;
  return code;
};

export const ForStatement = (node: Types.ForStatement) => {
  return `for (${serialize(node.init)}; ${serialize(node.test)}; ${serialize(
    node.update
  )}) { ${serialize(node.body)} }`;
};

export const ForInStatement = (node: Types.ForInStatement) => {
  return `for (${serialize(node.left)} in ${serialize(
    node.right
  )}) { ${serialize(node.body)} }`;
};

export const ForOfStatement = (node: Types.ForOfStatement) => {
  return `for (${serialize(node.left)} of ${serialize(
    node.right
  )}) { ${serialize(node.body)} }`;
};

export const WhileStatement = (node: Types.WhileStatement) => {
  return `while (${serialize(node.test)}) { ${serialize(node.body)} }`;
};

export const SwitchStatement = (node: Types.SwitchStatement) => {
  return `switch (${serialize(node.discriminant)}) { ${node.cases
    .map(serialize)
    .join("; ")} }`;
};

export const SwitchCase = (node: Types.SwitchCase) => {
  return (
    (node.test ? `case ${serialize(node.test)}: ` : " default: ") +
    node.consequent.map(serialize).join("; ")
  );
};

export const AssignmentExpression = (node: Types.AssignmentExpression) => {
  const left = serialize(node.left);
  const right = serialize(node.right);
  return `${left} ${node.operator} ${right}`;
};

export const BinaryExpression = (node: Types.BinaryExpression) => {
  const left = serialize(node.left);
  const right = serialize(node.right);
  return `(${left} ${node.operator} ${right})`;
};

export const nodes = {
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
};
