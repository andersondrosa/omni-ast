import {
  Identifier,
  VariableDeclaration,
  MemberExpression,
  Pattern,
  Statement,
  ReturnStatement,
  Expression,
  BlockStatement,
  ArrowFunctionExpression,
  FunctionExpression,
  JsonExpression,
  Node,
  IfStatement,
  VariableDeclarator,
  ExpressionStatement,
  BinaryExpression,
  BinaryOperator,
  Literal,
  JsonTypes,
  SwitchStatement,
  SwitchCase,
  AssignmentExpression,
  AssignmentOperator,
  TryStatement,
  CatchClause,
  ThrowStatement,
  ForStatement,
  UpdateExpression,
  UpdateOperator,
  ForInStatement,
  ChainExpression,
  ChainElement,
  ConditionalExpression,
  UnaryExpression,
  UnaryOperator,
  ObjectExpression,
  Property,
  AwaitExpression,
  NewExpression,
  TemplateElement,
  TemplateLiteral,
  ObjectPattern,
  AssignmentProperty,
  ArrayPattern,
  BreakStatement,
  ContinueStatement,
  EmptyStatement,
  FunctionDeclaration,
  LogicalExpression,
  LogicalOperator,
  WhileStatement,
  Program,
  ArrayExpression,
  SimpleCallExpression,
  ForOfStatement,
  DoWhileStatement,
  SpreadElement,
  RestElement,
} from "./types";

export const ast = (body: Node) => ({ type: "#AST", body });

// BUILDERS
export const arrayExpression = (
  elements: Array<Expression | SpreadElement | null>
): ArrayExpression => {
  return { type: "ArrayExpression", elements };
};
/* -------------------------------------------------------------------------- */
export const arrayPattern = (elements: Array<Pattern | null>): ArrayPattern => {
  return { type: "ArrayPattern", elements };
};
/* -------------------------------------------------------------------------- */
export const arrowFunctionExpression = (
  params: Pattern[],
  body: Expression | BlockStatement,
  async?: boolean
): ArrowFunctionExpression => {
  const node = {
    type: "ArrowFunctionExpression",
    params,
    body,
  } as ArrowFunctionExpression;
  if (async) node.async = true;
  if (body.type != "BlockStatement") node.expression = true;
  return node;
};
/* -------------------------------------------------------------------------- */
export const assignmentExpression = (
  operator: AssignmentOperator,
  left: Pattern,
  right: Expression
): AssignmentExpression => {
  return { type: "AssignmentExpression", operator, left, right };
};
/* -------------------------------------------------------------------------- */
export const assignmentProperty = (
  key: Expression,
  value?: Pattern,
  shorthand?: Boolean
): AssignmentProperty => {
  const node = { type: "Property", key, kind: "init" } as AssignmentProperty;
  if (value) node.value = value;
  if (shorthand) node.shorthand = Boolean(shorthand);
  return node;
};
/* -------------------------------------------------------------------------- */
export const awaitExpression = (
  argument: Expression | null | undefined
): AwaitExpression => {
  return { type: "AwaitExpression", argument };
};
/* -------------------------------------------------------------------------- */
export const binaryExpression = (
  operator: BinaryOperator,
  left: Expression,
  right: Expression
): BinaryExpression => {
  return { type: "BinaryExpression", left, right, operator };
};
/* -------------------------------------------------------------------------- */
export const blockStatement = (body: Statement[]): BlockStatement => {
  return { type: "BlockStatement", body };
};
/* -------------------------------------------------------------------------- */
export const breakStatement = (label?: Identifier | null): BreakStatement => {
  if (label) return { type: "BreakStatement", label };
  return { type: "BreakStatement" };
};
/* -------------------------------------------------------------------------- */
export const callExpression = (
  callee,
  args: Array<Expression | SpreadElement>,
  optional?: boolean
): SimpleCallExpression => {
  const node: SimpleCallExpression = {
    type: "CallExpression",
    callee,
    arguments: args,
    optional: optional || false,
  };
  return node;
};
/* -------------------------------------------------------------------------- */
export const catchClause = (
  param: Pattern | null,
  body: BlockStatement
): CatchClause => {
  return { type: "CatchClause", param, body };
};
/* -------------------------------------------------------------------------- */
export const chainExpression = (expression: ChainElement): ChainExpression => {
  return { type: "ChainExpression", expression };
};
/* -------------------------------------------------------------------------- */
export const conditionalExpression = (
  test: Expression,
  consequent: Expression,
  alternate: Expression
): ConditionalExpression => {
  return { type: "ConditionalExpression", test, consequent, alternate };
};
/* -------------------------------------------------------------------------- */
export const continueStatement = (
  label: Identifier | null | undefined
): ContinueStatement => {
  return { type: "ContinueStatement", label };
};
/* -------------------------------------------------------------------------- */
export const doWhileStatement = (
  body: Statement,
  test: Expression
): DoWhileStatement => {
  return { type: "DoWhileStatement", body, test };
};
/* -------------------------------------------------------------------------- */
export const emptyStatement = (): EmptyStatement => {
  return { type: "EmptyStatement" };
};
/* -------------------------------------------------------------------------- */
export const expressionStatement = (
  expression: Expression
): ExpressionStatement => {
  return { type: "ExpressionStatement", expression };
};
/* -------------------------------------------------------------------------- */
export const forInStatement = (
  left: Pattern | VariableDeclaration,
  right: Expression,
  body: Statement
): ForInStatement => {
  return { type: "ForInStatement", body, left, right };
};
/* -------------------------------------------------------------------------- */
export const forOfStatement = (
  left: Pattern | VariableDeclaration,
  right: Expression,
  body: Statement,
  _await?: boolean
): ForOfStatement => {
  const node: ForOfStatement = {
    type: "ForOfStatement",
    body,
    left,
    right,
    await: _await || false,
  };
  return node;
};
/* -------------------------------------------------------------------------- */
export const forStatement = (
  init: VariableDeclaration | Expression | null | undefined,
  test: Expression | null | undefined,
  update: Expression | null | undefined,
  body: Statement
): ForStatement => {
  return { type: "ForStatement", init, test, update, body };
};
/* -------------------------------------------------------------------------- */
export const functionDeclaration = (
  id: Identifier,
  params: Pattern[],
  body: BlockStatement,
  async?: boolean
): FunctionDeclaration => {
  const node: FunctionDeclaration = {
    type: "FunctionDeclaration",
    id,
    params,
    body,
  };
  if (async === true) node.async = async;
  return node;
};
/* -------------------------------------------------------------------------- */
export const functionExpression = (
  id: Identifier | null | undefined,
  params: Pattern[],
  body: BlockStatement,
  async?: boolean | undefined
): FunctionExpression => {
  const node: FunctionExpression = { type: "FunctionExpression", params, body };
  if (id) node.id = id;
  if (async == true) node.async = async;
  return node;
};
/* -------------------------------------------------------------------------- */
export const identifier = (name: string): Identifier => {
  return { type: "Identifier", name };
};
/* -------------------------------------------------------------------------- */
export const ifStatement = (
  test: Expression,
  consequent: Statement,
  alternate?: Statement | null | undefined
): IfStatement => {
  const node: IfStatement = { type: "IfStatement", test, consequent };
  if (node) node.alternate = alternate;
  return node;
};
/* -------------------------------------------------------------------------- */
export const logicalExpression = (
  operator: LogicalOperator,
  left: Expression,
  right: Expression
): LogicalExpression => {
  return { type: "LogicalExpression", operator, left, right };
};
/* -------------------------------------------------------------------------- */
export const jsonExpression = (body: JsonTypes): JsonExpression => {
  return { type: "JsonExpression", body };
};
/* -------------------------------------------------------------------------- */
export const literal = (
  value: string | boolean | number | null | RegExp
): Literal => {
  if (value === undefined)
    return { type: "Literal", value, raw: "undefined" } as Literal;
  if (value === null) return { type: "Literal", value, raw: "null" } as Literal;
  if (value instanceof RegExp)
    return {
      type: "Literal",
      value,
      raw: String(value),
      regex: { pattern: value.source, flags: value.flags },
    };
  const node: Literal = { type: "Literal", value };
  switch (typeof value) {
    case "bigint":
      node.raw = String(value) + "n";
      node["bigint"] = String(value);
      break;
    case "string":
      node.raw = `"${value}"`;
      break;
    default:
      node.raw = String(value);
  }
  return node;
};
/* -------------------------------------------------------------------------- */
export const memberExpression = (
  object,
  property,
  computed?: boolean | null,
  optional?: boolean | null
): MemberExpression => {
  const node: MemberExpression = {
    type: "MemberExpression",
    object,
    property,
    computed: computed || false,
    optional: optional || false,
  };
  return node;
};
/* -------------------------------------------------------------------------- */
export const newExpression = (
  callee,
  args: Array<Expression | SpreadElement>
): NewExpression => {
  return { type: "NewExpression", callee, arguments: args };
};
/* -------------------------------------------------------------------------- */
export const objectExpression = (
  properties: Array<Property | SpreadElement>
): ObjectExpression => {
  return { type: "ObjectExpression", properties };
};
/* -------------------------------------------------------------------------- */
export const objectPattern = (
  properties: Array<AssignmentProperty | RestElement>
): ObjectPattern => {
  return { type: "ObjectPattern", properties };
};
/* -------------------------------------------------------------------------- */
export const program = (body: Statement[]): Program => {
  return { type: "Program", body, sourceType: "script" };
};
/* -------------------------------------------------------------------------- */
export const property = (
  key: Expression,
  value: Expression | Pattern | AssignmentProperty,
  shorthand?: boolean
): Property => {
  const node: Property = { type: "Property", key, kind: "init", value };
  if (shorthand) node.shorthand = shorthand;
  return node;
};
/* -------------------------------------------------------------------------- */
export const returnStatement = (
  argument: Expression | null | undefined
): ReturnStatement => {
  return { type: "ReturnStatement", argument };
};
/* -------------------------------------------------------------------------- */
export const switchCase = (
  test: Expression | null | undefined,
  consequent: Statement[]
): SwitchCase => {
  return { type: "SwitchCase", consequent, test };
};
/* -------------------------------------------------------------------------- */
export const switchStatement = (
  discriminant: Expression,
  cases: SwitchCase[]
): SwitchStatement => {
  return { type: "SwitchStatement", cases, discriminant };
};
/* -------------------------------------------------------------------------- */
export const templateElement = (
  value: { cooked?: string | null | undefined; raw: string },
  tail?: boolean
): TemplateElement => {
  return { type: "TemplateElement", value, tail: tail || false };
};
/* -------------------------------------------------------------------------- */
export const templateLiteral = (
  quasis: TemplateElement[],
  expressions: Expression[]
): TemplateLiteral => {
  return { type: "TemplateLiteral", quasis, expressions };
};
/* -------------------------------------------------------------------------- */
export const throwStatement = (argument: Expression): ThrowStatement => {
  return { type: "ThrowStatement", argument };
};
/* -------------------------------------------------------------------------- */
export const tryStatement = (
  block: BlockStatement,
  handler: CatchClause | null | undefined,
  finalizer?: BlockStatement | null | undefined
): TryStatement => {
  const node: TryStatement = { type: "TryStatement", block, handler };
  if (finalizer) node.finalizer = finalizer;
  return node;
};
/* -------------------------------------------------------------------------- */
export const unaryExpression = (
  operator: UnaryOperator,
  argument: Expression
): UnaryExpression => {
  return { type: "UnaryExpression", operator, argument, prefix: true };
};
/* -------------------------------------------------------------------------- */
export const updateExpression = (
  operator: UpdateOperator,
  argument: Expression,
  prefix?: boolean
): UpdateExpression => {
  const node = {
    type: "UpdateExpression",
    operator,
    argument,
  } as UpdateExpression;
  if (prefix) node.prefix = Boolean(prefix);
  return node;
};
/* -------------------------------------------------------------------------- */
export const variableDeclaration = (
  kind: "var" | "let" | "const",
  declarations: VariableDeclarator[]
): VariableDeclaration => {
  return { type: "VariableDeclaration", declarations, kind };
};
/* -------------------------------------------------------------------------- */
export const variableDeclarator = (
  id: Pattern,
  init?: Expression | null
): VariableDeclarator => {
  const node: VariableDeclarator = { type: "VariableDeclarator", id };
  if (init) node.init = init;
  return node;
};
/* -------------------------------------------------------------------------- */
export const whileStatement = (
  test: Expression,
  body: Statement
): WhileStatement => {
  return { type: "WhileStatement", test, body };
};

/** ALIASES ================================================================= */
export const lit = literal;
export const json = jsonExpression;
export const constantDeclaration = (id): VariableDeclaration =>
  variableDeclaration("const", [variableDeclarator(identifier(id))]);
export const letDeclaration = (id): VariableDeclaration =>
  variableDeclaration("let", [variableDeclarator(identifier(id))]);
