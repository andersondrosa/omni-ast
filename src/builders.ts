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
  ObjectPattern,
  AssignmentProperty,
  RestElement,
  ObjectExpression,
  Property,
} from "./types";

export type TypeAST = { type: "#AST"; body: Node };

export const ast = (body: Node): TypeAST => ({ type: "#AST", body });

export const jsonExpression = (body: JsonTypes): JsonExpression => {
  return { type: "JsonExpression", body };
};

export const identifier = (name: string): Identifier => {
  return { type: "Identifier", name };
};

export const assignmentExpression = (
  operator: AssignmentOperator,
  left: Pattern,
  right: Expression
): AssignmentExpression => {
  return { type: "AssignmentExpression", operator, left, right };
};

export const lit = (value: string | boolean | number | null): Literal => {
  return {
    type: "Literal",
    value,
    raw: typeof value === "string" ? `"${value}"` : String(value),
  };
};

export const objectExpression = (properties: Property[]): ObjectExpression => {
  return { type: "ObjectExpression", properties };
};

// export const assignmentProperty = (
//   properties: ""
// ): AssignmentProperty => {
//   return { type: "Property",  };
// };

export const blockStatement = (body: Statement[]): BlockStatement => {
  return { type: "BlockStatement", body };
};

export const chainExpression = (expression: ChainElement): ChainExpression => {
  return { type: "ChainExpression", expression };
};

export const arrowFunctionExpression = (
  params: Pattern[],
  body,
  async?: true
): ArrowFunctionExpression => ({
  type: "ArrowFunctionExpression",
  expression: false,
  params,
  body,
  async,
});

export const functionExpression = (
  id: Identifier | null | undefined,
  args: Pattern[],
  body: BlockStatement,
  async?: true
): FunctionExpression => {
  return { type: "FunctionExpression", id, params: args, body, async };
};

export const returnStatement = (
  argument: Expression | null | undefined
): ReturnStatement => {
  return { type: "ReturnStatement", argument };
};

export const tryStatement = (
  block: BlockStatement,
  handler: CatchClause,
  finalizer?: BlockStatement
): TryStatement => {
  return { type: "TryStatement", block, handler, finalizer };
};

export const catchStatement = (
  param: Pattern,
  body: BlockStatement
): CatchClause => {
  return { type: "CatchClause", param, body };
};

export const throwStatement = (argument: Expression): ThrowStatement => {
  return { type: "ThrowStatement", argument };
};

export const callExpression = (callee, args: Expression[]): CallExpression => ({
  type: "CallExpression",
  callee,
  arguments: args,
  optional: false,
});

export const memberExpression = (
  object,
  property,
  computed: boolean = false,
  optional: boolean = false
): MemberExpression => ({
  type: "MemberExpression",
  object,
  property,
  computed,
  optional,
});

export const constantDeclaration = (id, init): VariableDeclaration => ({
  type: "VariableDeclaration",
  kind: "const",
  declarations: [{ type: "VariableDeclarator", id, init }],
});

export const letDeclaration = (name, init): VariableDeclaration => ({
  type: "VariableDeclaration",
  kind: "let",
  declarations: [{ type: "VariableDeclarator", id: identifier(name), init }],
});

export const ifStatement = (
  test: Expression,
  consequent: Statement,
  alternate?: Statement | null
): IfStatement => ({
  type: "IfStatement",
  test,
  consequent,
  alternate: alternate ?? null,
});

export const forStatement = (
  init: Expression | VariableDeclaration | null | undefined,
  test: Expression,
  update: Expression | null | undefined,
  body: Statement
): ForStatement => {
  return { type: "ForStatement", init, test, update, body };
};

export const forInStatement = (
  left: Pattern | VariableDeclaration,
  right: Expression,
  body: Statement
): ForInStatement => {
  return { type: "ForInStatement", body, left, right };
};

export const updateExpression = (
  operator: UpdateOperator,
  argument: Expression,
  prefix: boolean = false
): UpdateExpression => {
  return { type: "UpdateExpression", operator, argument, prefix };
};

export const switchStatement = (
  discriminant: Expression,
  cases: SwitchCase[]
): SwitchStatement => {
  return { type: "SwitchStatement", cases, discriminant };
};

export const switchCase = (
  test: Expression | null | undefined,
  consequent: Statement[]
): SwitchCase => {
  return { type: "SwitchCase", consequent, test };
};

export const variableDeclaration = (
  kind: "var" | "let" | "const",
  declarations: VariableDeclarator[]
): VariableDeclaration => {
  return { type: "VariableDeclaration", declarations, kind };
};

export const variableDeclarator = (
  id: Pattern,
  init?: Expression | null
): VariableDeclarator => ({
  type: "VariableDeclarator",
  id,
  init: init ?? null,
});

export const binaryExpression = (
  operator: BinaryOperator,
  left: Expression,
  right: Expression
): BinaryExpression => ({ type: "BinaryExpression", left, right, operator });

export const expressionStatement = (
  expression: Expression
): ExpressionStatement => ({ type: "ExpressionStatement", expression });

export const unaryExpression = (
  operator: UnaryOperator,
  argument: Expression
): UnaryExpression => {
  return { type: "UnaryExpression", operator, argument, prefix: true };
};

export const conditionalExpression = (
  test: Expression,
  consequent: Expression,
  alternate: Expression
): ConditionalExpression => {
  return { type: "ConditionalExpression", test, consequent, alternate };
};

export const destructure = (json): Pattern => {
  const properties: any[] = [];
  for (const name in json) {
    if (json[name] === true)
      properties.push([
        {
          type: "Property",
          shorthand: true,
          computed: false,
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
          computed: false,
          key: { type: "Identifier", name },
          kind: "init",
          value: { type: "Identifier", name: destructure(json[name]) },
        },
      ]);
  }
  return { type: "ObjectPattern", properties };
};

export const func = (args: Pattern[], blocks: Statement[]) => {
  return functionExpression(null, args, blockStatement(blocks));
};
