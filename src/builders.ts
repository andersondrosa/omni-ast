import {
  Identifier,
  VariableDeclaration,
  MemberExpression,
  CallExpression,
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
  RestElement,
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
} from "./types";

export const ast = (body: Node) => ({ type: "#AST", body });

// BUILDERS
export const arrayPattern = (elements: Pattern[]): ArrayPattern => {
  return { type: "ArrayPattern", elements };
};
/* -------------------------------------------------------------------------- */
export const arrayExpression = (elements: Expression[]): ArrayExpression => {
  return { type: "ArrayExpression", elements };
};
/* -------------------------------------------------------------------------- */
export const arrowFunctionExpression = (
  params: Pattern[],
  body: Expression | BlockStatement,
  async?: boolean
): ArrowFunctionExpression => {
  const node: ArrowFunctionExpression = {
    type: "ArrowFunctionExpression",
    expression: body.type != "BlockStatement",
    params,
    body,
  };
  if (async) node.async = true;
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
  shorthand = false
): AssignmentProperty => {
  return {
    type: "Property",
    key,
    value,
    kind: "init",
    method: false,
    shorthand,
  };
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
  args: Expression[],
  optional?: boolean
): SimpleCallExpression => {
  const node: SimpleCallExpression = {
    type: "CallExpression",
    callee,
    arguments: args,
  };
  if (optional) node.optional = optional;
  return node;
};
/* -------------------------------------------------------------------------- */
export const catchClause = (
  param: Pattern,
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
export const continueExpression = (label: Identifier): ContinueStatement => {
  return { type: "ContinueStatement", label };
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
  _await: boolean
): ForOfStatement => {
  return { type: "ForOfStatement", body, left, right, await: _await || false };
};
/* -------------------------------------------------------------------------- */
export const forStatement = (
  init: Expression | VariableDeclaration | null | undefined,
  test: Expression,
  update: Expression | null | undefined,
  body: Statement
): ForStatement => {
  return { type: "ForStatement", init, test, update, body };
};
/* -------------------------------------------------------------------------- */
export const functionDeclaration = (
  id: Identifier,
  args: Pattern[],
  body: BlockStatement,
  async?: true
): FunctionDeclaration => {
  const node: FunctionDeclaration = {
    type: "FunctionDeclaration",
    id,
    expression: false,
    params: args,
    body,
  };
  if (async) node.async = async;
  return node;
};
/* -------------------------------------------------------------------------- */
export const functionExpression = (
  id: Identifier | null | undefined,
  args: Pattern[],
  body: BlockStatement,
  async?: true
): FunctionExpression => {
  const node: FunctionExpression = {
    type: "FunctionExpression",
    expression: false,
    params: args,
    body,
  };
  if (id) node.id = id;
  if (async) node.async = async;
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
  alternate?: Statement | null
): IfStatement => {
  return {
    type: "IfStatement",
    test,
    consequent,
    alternate: alternate ?? null,
  };
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
export const literal = (value: string | boolean | number | null): Literal => {
  return {
    type: "Literal",
    value,
    raw: typeof value === "string" ? `"${value}"` : String(value),
  };
};
/* -------------------------------------------------------------------------- */
export const memberExpression = (
  object,
  property,
  computed?: boolean | null,
  optional?: boolean | null
): MemberExpression => {
  const node: MemberExpression = { type: "MemberExpression", object, property };
  if (computed) node.computed = computed;
  if (optional) node.optional = optional;
  return node;
};
/* -------------------------------------------------------------------------- */
export const newExpression = (callee, args: Expression[]): NewExpression => {
  return { type: "NewExpression", callee, arguments: args };
};
/* -------------------------------------------------------------------------- */
export const objectExpression = (properties: Property[]): ObjectExpression => {
  return { type: "ObjectExpression", properties };
};
/* -------------------------------------------------------------------------- */
export const objectPattern = (
  properties: AssignmentProperty[]
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
  value: Expression | Pattern
): Property => {
  return {
    type: "Property",
    key,
    kind: "init",
    method: false,
    shorthand: false,
    value,
  };
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
  value: { raw: string; cooked?: string },
  tail = false
): TemplateElement => {
  return { type: "TemplateElement", value, tail };
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
  handler: CatchClause,
  finalizer?: BlockStatement
): TryStatement => {
  return { type: "TryStatement", block, handler, finalizer };
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
  prefix: boolean = false
): UpdateExpression => {
  return { type: "UpdateExpression", operator, argument, prefix };
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
  return { type: "VariableDeclarator", id, init: init ?? null };
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

/** ========================================================================= */

export const destructure = (json): Pattern => {
  const properties: any[] = [];
  for (const name in json) {
    if (json[name] === true)
      properties.push([
        {
          type: "Property",
          shorthand: true,
          key: { type: "Identifier", name },
          kind: "init",
          value: { type: "Identifier", name },
        },
      ]);
    else
      properties.push([
        {
          type: "Property",
          shorthand: false,
          key: { type: "Identifier", name },
          kind: "init",
          value: { type: "Identifier", name: destructure(json[name]) },
        },
      ]);
  }
  return { type: "ObjectPattern", properties };
};
/* -------------------------------------------------------------------------- */
