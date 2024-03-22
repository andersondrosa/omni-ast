import * as t from "./types";
import { pick } from "./utils";

const has = (n) => {
  const r = {};
  for (const i in n) {
    if (n[i] == false) continue;
    r[i] = n[i];
  }
  return r;
};

export const simplify = (n) => {
  if (!n || typeof n != "object") return n;
  if (Array.isArray(n)) return n.map(simplify);
  return parsers[n.type]?.(n);
};

export const parsers = {
  ArrayExpression: (n: t.ArrayExpression): t.SimpleArrayExpression => ({
    type: "ArrayExpression",
    elements: simplify(n.elements || []),
  }),
  ArrayPattern: (n: t.ArrayPattern): t.SimpleArrayPattern => ({
    type: "ArrayPattern",
    elements: simplify(n.elements || []),
  }),
  ArrowFunctionExpression: (
    n: t.ArrowFunctionExpression
  ): t.SimpleArrowFunctionExpression => ({
    type: "ArrowFunctionExpression",
    params: simplify(n.params || []),
    body: simplify(n.body),
    ...has({ async: n.async }),
  }),
  AssignmentExpression: (
    n: t.AssignmentExpression
  ): t.SimpleAssignmentExpression => ({
    type: "AssignmentExpression",
    operator: n.operator,
    left: simplify(n.left),
    right: simplify(n.right),
  }),
  AssignmentProperty: (
    n: t.AssignmentProperty
  ): t.SimpleAssignmentProperty => ({
    type: "Property",
    key: simplify(n.key),
    value: simplify(n.value),
    ...has({ shorthand: n.shorthand }),
  }),
  AwaitExpression: (n: t.AwaitExpression): t.SimpleAwaitExpression => ({
    type: "AwaitExpression",
    argument: simplify(n.argument),
  }),
  BinaryExpression: (n: t.BinaryExpression): t.SimpleBinaryExpression => ({
    type: "BinaryExpression",
    operator: n.operator,
    left: simplify(n.left),
    right: simplify(n.right),
  }),
  BlockStatement: (n: t.BlockStatement): t.SimpleBlockStatement => ({
    type: "BlockStatement",
    body: simplify(n.body || []),
  }),
  BreakStatement: (n: t.BreakStatement): t.SimpleBreakStatement => ({
    type: "BreakStatement",
    ...has({ label: simplify(n.label) }),
  }),
  CallExpression: (
    n: t.SimpleCallExpression
  ): t.SimpleSimpleCallExpression => ({
    type: "CallExpression",
    callee: simplify(n.callee),
    arguments: simplify(n.arguments || []),
    ...has({ optional: n.optional }),
  }),
  CatchClause: (n: t.CatchClause): t.SimpleCatchClause => ({
    type: "CatchClause",
    param: simplify(n.param || []),
    body: simplify(n.body),
  }),
  ChainExpression: (n: t.ChainExpression): t.SimpleChainExpression => ({
    type: "ChainExpression",
    expression: simplify(n.expression),
  }),
  ConditionalExpression: (
    n: t.ConditionalExpression
  ): t.SimpleConditionalExpression => ({
    type: "ConditionalExpression",
    test: simplify(n.test),
    consequent: simplify(n.consequent),
    alternate: simplify(n.alternate),
  }),
  ContinueStatement: (n: t.ContinueStatement): t.SimpleContinueStatement => ({
    type: "ContinueStatement",
    ...has({ label: simplify(n.label) }),
  }),
  DoWhileStatement: (n: t.DoWhileStatement): t.SimpleDoWhileStatement => ({
    type: "DoWhileStatement",
    body: simplify(n.body),
    test: simplify(n.test),
  }),
  EmptyStatement: () => ({ type: "EmptyStatement" }),
  ExpressionStatement: (
    n: t.ExpressionStatement
  ): t.SimpleExpressionStatement => ({
    type: "ExpressionStatement",
    expression: simplify(n.expression),
  }),
  ForInStatement: (n: t.ForInStatement): t.SimpleForInStatement => ({
    type: "ForInStatement",
    left: simplify(n.left),
    right: simplify(n.right),
    body: simplify(n.body),
  }),
  ForOfStatement: (n: t.ForOfStatement): t.SimpleForOfStatement => ({
    type: "ForOfStatement",
    left: simplify(n.left),
    right: simplify(n.right),
    body: simplify(n.body),
    ...has({ await: n.await }),
  }),
  ForStatement: (n: t.ForStatement): t.SimpleForStatement => ({
    type: "ForStatement",
    body: simplify(n.body),
    ...has({
      init: simplify(n.init),
      test: simplify(n.test),
      update: simplify(n.update),
    }),
  }),
  FunctionDeclaration: (
    n: t.FunctionDeclaration
  ): t.SimpleFunctionDeclaration => ({
    type: "FunctionDeclaration",
    id: simplify(n.id),
    params: simplify(n.params || []),
    body: simplify(n.body),
    ...has(pick(n, ["async"])),
  }),
  FunctionExpression: (
    n: t.FunctionExpression
  ): t.SimpleFunctionExpression => ({
    type: "FunctionExpression",
    params: simplify(n.params || []),
    body: simplify(n.body),
    ...has({ id: n.id ? simplify(n.id) : false, sync: n.async }),
  }),
  Identifier: (n: t.Identifier): t.SimpleIdentifier => ({
    type: "Identifier",
    name: n.name,
  }),
  IfStatement: (n: t.IfStatement): t.SimpleIfStatement => ({
    type: "IfStatement",
    test: simplify(n.test),
    consequent: simplify(n.consequent),
    alternate: simplify(n.alternate),
  }),
  JsonExpression: (n: t.JsonExpression): t.SimpleJsonExpression => ({
    type: "JsonExpression",
    body: n.body,
  }),
  Literal: (n: t.Literal): t.SimpleLiteral => ({
    type: "Literal",
    value: n.value as any,
  }),
  LogicalExpression: (n: t.LogicalExpression): t.SimpleLogicalExpression => ({
    type: "LogicalExpression",
    operator: n.operator,
    left: simplify(n.left),
    right: simplify(n.right),
  }),
  MemberExpression: (n: t.MemberExpression): t.SimpleMemberExpression => ({
    type: "MemberExpression",
    object: simplify(n.object),
    property: simplify(n.property),
    ...has(pick(n, ["computed", "optional"])),
  }),
  NewExpression: (n: t.NewExpression): t.SimpleNewExpression => ({
    type: "NewExpression",
    callee: simplify(n.callee),
    arguments: simplify(n.arguments || []),
  }),
  ObjectExpression: (n: t.ObjectExpression): t.SimpleObjectExpression => ({
    type: "ObjectExpression",
    properties: simplify(n.properties || []),
  }),
  ObjectPattern: (n: t.ObjectPattern): t.SimpleObjectPattern => ({
    type: "ObjectPattern",
    properties: simplify(n.properties || []),
  }),
  Program: (n: t.Program): t.SimpleProgram => ({
    type: "Program",
    body: simplify(n.body),
  }),
  Property: (n: t.Property): t.SimpleProperty => ({
    type: "Property",
    key: simplify(n.key),
    value: simplify(n.value),
    ...has(pick(n, ["kind", "shorthand", "computed"])),
  }),
  ReturnStatement: (n: t.ReturnStatement): t.SimpleReturnStatement => ({
    type: "ReturnStatement",
    argument: simplify(n.argument),
  }),
  SwitchCase: (n: t.SwitchCase): t.SimpleSwitchCase => ({
    type: "SwitchCase",
    test: simplify(n.test),
    consequent: simplify(n.consequent),
  }),
  SwitchStatement: (n: t.SwitchStatement): t.SimpleSwitchStatement => ({
    type: "SwitchStatement",
    discriminant: simplify(n.discriminant),
    cases: simplify(n.cases),
  }),
  TemplateElement: (n: t.TemplateElement): t.SimpleTemplateElement => ({
    type: "TemplateElement",
    value: n.value,
    ...has({ tail: n.tail }),
  }),
  TemplateLiteral: (n: t.TemplateLiteral): t.SimpleTemplateLiteral => ({
    type: "TemplateLiteral",
    quasis: simplify(n.quasis),
    expressions: simplify(n.expressions),
  }),
  ThrowStatement: (n: t.ThrowStatement): t.SimpleThrowStatement => ({
    type: "ThrowStatement",
    argument: simplify(n.argument),
  }),
  TryStatement: (n: t.TryStatement): t.SimpleTryStatement => ({
    type: "TryStatement",
    block: simplify(n.block),
    handler: simplify(n.handler),
    finalizer: simplify(n.finalizer),
  }),
  UnaryExpression: (n: t.UnaryExpression): t.SimpleUnaryExpression => ({
    type: "UnaryExpression",
    operator: n.operator,
    argument: simplify(n.argument),
  }),
  UpdateExpression: (n: t.UpdateExpression): t.SimpleUpdateExpression => ({
    type: "UpdateExpression",
    operator: n.operator,
    argument: simplify(n.argument),
    ...has({ prefix: n.prefix }),
  }),
  VariableDeclaration: (
    n: t.VariableDeclaration
  ): t.SimpleVariableDeclaration => ({
    type: "VariableDeclaration",
    kind: n.kind,
    declarations: simplify(n.declarations || []),
  }),
  VariableDeclarator: (
    n: t.VariableDeclarator
  ): t.SimpleVariableDeclarator => ({
    type: "VariableDeclarator",
    id: simplify(n.id),
    init: simplify(n.init),
  }),
  WhileStatement: (n: t.WhileStatement): t.SimpleWhileStatement => ({
    type: "WhileStatement",
    test: simplify(n.test),
    body: simplify(n.body),
  }),
};
