import { Node, Property } from "./types";
import { identifier, objectExpression } from "./builders";
import * as types from "./types";
import * as b from "./builders";

export function parseAST(jsonAst: Record<string, any>) {
  //
  const restore = (
    simpleAst: Record<string, any>,
    visited = new WeakMap<object, boolean>()
  ) => {
    if (typeof simpleAst != "object") throw Error("AST must be object");

    if (visited.has(simpleAst))
      throw new Error("Detected a circular AST reference");

    visited.set(simpleAst, true);

    if (Array.isArray(simpleAst)) {
      visited.delete(simpleAst);
      return simpleAst.map((x) => restore(x, visited));
    }

    if (simpleAst.type == "JsonExpression") {
      visited.delete(simpleAst);
      return fromJson(simpleAst.body);
    }

    visited.delete(simpleAst);
    return parsers[simpleAst.type](simpleAst);
  };

  const fromJson = (value, visited = new WeakMap<object, boolean>()) => {
    //
    if (visited.has(value))
      throw new Error("Detected a circular AST reference");

    if (typeof value != "object") return b.literal(value);

    if (Array.isArray(value)) {
      const response = {
        type: "ArrayExpression",
        elements: value.map((x) => fromJson(x, visited)),
      };
      visited.delete(value);
      return response;
    }

    if (value.type == "#AST") {
      visited.delete(value);
      return restore(value.body);
    }

    const properties: Property[] = Object.entries(value).map(
      ([key, value]: any) => ({
        type: "Property",
        key: identifier(key),
        value:
          typeof value != "object" || value === null
            ? b.literal(value)
            : fromJson(value),
        computed: false,
        kind: "init",
        method: false,
        shorthand: false,
      })
    );

    visited.delete(value);
    return objectExpression(properties);
  };

  return restore(jsonAst);
}

export const parse = (n: types.Node | types.Node[]) => {
  if (typeof n != "object") return n;
  if (n == null || n instanceof RegExp) return n;
  if (Array.isArray(n)) return n.map(parse);
  return parsers[n.type](n);
};

export const parsers = {
  ArrayExpression: (n: types.ArrayExpression) =>
    b.arrayExpression(parse(n.elements || [])),
  ArrayPattern: (n: types.ArrayPattern) =>
    b.arrayPattern(parse(n.elements || [])),
  ArrowFunctionExpression: (n: types.ArrowFunctionExpression) =>
    b.arrowFunctionExpression(
      parse(n.params || []),
      parse(n.body),
      n.async || false,
      n.generator || false
    ),
  AssignmentExpression: (n: types.AssignmentExpression) =>
    b.assignmentExpression(n.operator, parse(n.left), parse(n.right)),
  AssignmentProperty: (n: types.AssignmentProperty) =>
    b.assignmentProperty(parse(n.key), parse(n.value), n.shorthand || false),
  AwaitExpression: (n: types.AwaitExpression) =>
    b.awaitExpression(parse(n.argument)),
  BinaryExpression: (n: types.BinaryExpression) =>
    b.binaryExpression(n.operator, parse(n.left), parse(n.right)),
  BlockStatement: (n: types.BlockStatement) =>
    b.blockStatement(parse(n.body || [])),
  BreakStatement: (n: types.BreakStatement) => b.breakStatement(parse(n.label)),
  CallExpression: (n: types.SimpleCallExpression) =>
    b.callExpression(
      parse(n.callee),
      parse(n.arguments || []),
      n.optional || false
    ),
  CatchClause: (n: types.CatchClause) =>
    b.catchClause(parse(n.param || []), parse(n.body)),
  ChainExpression: (n: types.ChainExpression) =>
    b.chainExpression(parse(n.expression)),
  ConditionalExpression: (n: types.ConditionalExpression) =>
    b.conditionalExpression(
      parse(n.test),
      parse(n.consequent),
      parse(n.alternate)
    ),
  ContinueStatement: (n: types.ContinueStatement) =>
    b.continueStatement(parse(n.label)),
  DoWhileStatement: (n: types.DoWhileStatement) =>
    b.doWhileStatement(parse(n.body), parse(n.test)),
  EmptyStatement: () => b.emptyStatement(),
  ExpressionStatement: (n: types.ExpressionStatement) =>
    b.expressionStatement(parse(n.expression)),
  ForInStatement: (n: types.ForInStatement) =>
    b.forInStatement(parse(n.left), parse(n.right), parse(n.body)),
  ForOfStatement: (n: types.ForOfStatement) =>
    b.forOfStatement(
      parse(n.left),
      parse(n.right),
      parse(n.body),
      n.await || false
    ),
  ForStatement: (n: types.ForStatement) =>
    b.forStatement(
      parse(n.init),
      parse(n.test),
      parse(n.update),
      parse(n.body)
    ),
  FunctionDeclaration: (n: types.FunctionDeclaration) =>
    b.functionDeclaration(
      parse(n.id),
      parse(n.params || []),
      parse(n.body),
      n.generator || undefined,
      n.async || undefined
    ),
  FunctionExpression: (n: types.FunctionExpression) =>
    b.functionExpression(
      parse(n.id),
      parse(n.params || []),
      parse(n.body),
      n.async || undefined
    ),
  Identifier: (n: types.Identifier) => b.identifier(n.name),
  IfStatement: (n: types.IfStatement) =>
    b.ifStatement(parse(n.test), parse(n.consequent), parse(n.alternate)),
  JsonExpression: (n: types.JsonExpression) => b.jsonExpression(n.body),
  Literal: (n: types.Literal) => b.literal(n.value as any),
  LogicalExpression: (n: types.LogicalExpression) =>
    b.logicalExpression(n.operator, parse(n.left), parse(n.right)),
  MemberExpression: (n: types.MemberExpression) =>
    b.memberExpression(
      parse(n.object),
      parse(n.property),
      n.computed || false,
      n.optional || false
    ),
  NewExpression: (n: types.NewExpression) =>
    b.newExpression(parse(n.callee), parse(n.arguments || [])),
  ObjectExpression: (n: types.ObjectExpression) =>
    b.objectExpression(parse(n.properties || [])),
  ObjectPattern: (n: types.ObjectPattern) =>
    b.objectPattern(parse(n.properties || [])),
  Program: (n: types.Program) => b.program(parse(n.body)),
  Property: (n: types.Property) =>
    b.property(
      parse(n.key),
      parse(n.value),
      n.shorthand || false,
      n.computed || false
    ),
  ReturnStatement: (n: types.ReturnStatement) =>
    b.returnStatement(parse(n.argument)),
  SwitchCase: (n: types.SwitchCase) =>
    b.switchCase(parse(n.test), parse(n.consequent)),
  SwitchStatement: (n: types.SwitchStatement) =>
    b.switchStatement(parse(n.discriminant), parse(n.cases)),
  TemplateElement: (n: types.TemplateElement) =>
    b.templateElement(n.value, n.tail || false),
  TemplateLiteral: (n: types.TemplateLiteral) =>
    b.templateLiteral(parse(n.quasis), parse(n.expressions)),
  ThrowStatement: (n: types.ThrowStatement) =>
    b.throwStatement(parse(n.argument)),
  TryStatement: (n: types.TryStatement) =>
    b.tryStatement(parse(n.block), parse(n.handler), parse(n.finalizer)),
  UnaryExpression: (n: types.UnaryExpression) =>
    b.unaryExpression(n.operator, parse(n.argument)),
  UpdateExpression: (n: types.UpdateExpression) =>
    b.updateExpression(n.operator, parse(n.argument), n.prefix),
  VariableDeclaration: (n: types.VariableDeclaration) =>
    b.variableDeclaration(n.kind, parse(n.declarations || [])),
  VariableDeclarator: (n: types.VariableDeclarator) =>
    b.variableDeclarator(parse(n.id), parse(n.init)),
  WhileStatement: (n: types.WhileStatement) =>
    b.whileStatement(parse(n.test), parse(n.body)),
};
