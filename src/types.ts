export type JsonTypes = string | number | boolean | null | object | [];

export interface BaseNodeWithoutComments {
  type: string;
  loc?: SourceLocation | null | undefined;
  range?: [number, number] | undefined;
}

export interface BaseNode extends BaseNodeWithoutComments {
  leadingComments?: Comment[] | undefined;
  trailingComments?: Comment[] | undefined;
}

export interface NodeMap {
  JsonExpression: JsonExpression;
  AssignmentProperty: AssignmentProperty;
  CatchClause: CatchClause;
  Expression: Expression;
  Function: Function;
  Identifier: Identifier;
  Literal: Literal;
  Pattern: Pattern;
  Program: Program;
  Property: Property;
  PropertyDefinition: PropertyDefinition;
  SpreadElement: SpreadElement;
  Statement: Statement;
  SwitchCase: SwitchCase;
  VariableDeclarator: VariableDeclarator;
}

export type Node = NodeMap[keyof NodeMap];

export interface SourceLocation {
  source?: string | null | undefined;
  start: Position;
  end: Position;
}

export interface Position {
  line: number;
  column: number;
}

export interface Program extends BaseNode {
  type: "Program";
  sourceType: "script" | "module";
  body: Array<Directive | Statement>;
  comments?: Comment[] | undefined;
}

export interface Directive extends BaseNode {
  type: "ExpressionStatement";
  expression: Literal;
  directive: string;
}

export interface BaseFunction extends BaseNode {
  params: Pattern[];
  generator?: boolean | undefined;
  async?: boolean | undefined;
  body: BlockStatement | Expression;
}

export type Function =
  | FunctionDeclaration
  | FunctionExpression
  | ArrowFunctionExpression;

export type Statement =
  | ExpressionStatement
  | BlockStatement
  | StaticBlock
  | EmptyStatement
  | WithStatement
  | ReturnStatement
  | BreakStatement
  | ContinueStatement
  | IfStatement
  | SwitchStatement
  | ThrowStatement
  | TryStatement
  | WhileStatement
  | DoWhileStatement
  | ForStatement
  | ForInStatement
  | ForOfStatement
  | Declaration;

export type UnaryOperator =
  | "-"
  | "+"
  | "!"
  | "~"
  | "typeof"
  | "void"
  | "delete";

export type BinaryOperator =
  | "=="
  | "!="
  | "==="
  | "!=="
  | "<"
  | "<="
  | ">"
  | ">="
  | "<<"
  | ">>"
  | ">>>"
  | "+"
  | "-"
  | "*"
  | "/"
  | "%"
  | "**"
  | "|"
  | "^"
  | "&"
  | "in"
  | "instanceof";

export type LogicalOperator = "||" | "&&" | "??";

export type AssignmentOperator =
  | "="
  | "+="
  | "-="
  | "*="
  | "/="
  | "%="
  | "**="
  | "<<="
  | ">>="
  | ">>>="
  | "|="
  | "^="
  | "&="
  | "||="
  | "&&="
  | "??=";

export type UpdateOperator = "++" | "--";

export interface BaseStatement extends BaseNode {}

export interface EmptyStatement extends BaseStatement {
  type: "EmptyStatement";
}

export interface BlockStatement extends BaseStatement {
  type: "BlockStatement";
  body: Statement[];
  innerComments?: Comment[] | undefined;
}

export interface StaticBlock extends Omit<BlockStatement, "type"> {
  type: "StaticBlock";
}

export interface ExpressionStatement extends BaseStatement {
  type: "ExpressionStatement";
  expression: Expression;
}

export interface IfStatement extends BaseStatement {
  type: "IfStatement";
  test: Expression;
  consequent: Statement;
  alternate?: Statement | null | undefined;
}

export interface LabeledStatement extends BaseStatement {
  type: "LabeledStatement";
  label: Identifier;
  body: Statement;
}

export interface BreakStatement extends BaseStatement {
  type: "BreakStatement";
  label?: Identifier | null | undefined;
}

export interface ContinueStatement extends BaseStatement {
  type: "ContinueStatement";
  label?: Identifier | null | undefined;
}

export interface WithStatement extends BaseStatement {
  type: "WithStatement";
  object: Expression;
  body: Statement;
}

export interface SwitchStatement extends BaseStatement {
  type: "SwitchStatement";
  discriminant: Expression;
  cases: SwitchCase[];
}

export interface ReturnStatement extends BaseStatement {
  type: "ReturnStatement";
  argument?: Expression | null | undefined;
}

export interface ThrowStatement extends BaseStatement {
  type: "ThrowStatement";
  argument: Expression;
}

export interface TryStatement extends BaseStatement {
  type: "TryStatement";
  block: BlockStatement;
  handler?: CatchClause | null | undefined;
  finalizer?: BlockStatement | null | undefined;
}

export interface WhileStatement extends BaseStatement {
  type: "WhileStatement";
  test: Expression;
  body: Statement;
}

export interface DoWhileStatement extends BaseStatement {
  type: "DoWhileStatement";
  body: Statement;
  test: Expression;
}

export interface ForStatement extends BaseStatement {
  type: "ForStatement";
  init?: VariableDeclaration | Expression | null | undefined;
  test?: Expression | null | undefined;
  update?: Expression | null | undefined;
  body: Statement;
}

export interface BaseForXStatement extends BaseStatement {
  left: VariableDeclaration | Pattern;
  right: Expression;
  body: Statement;
}

export interface ForInStatement extends BaseForXStatement {
  type: "ForInStatement";
}

export interface DebuggerStatement extends BaseStatement {
  type: "DebuggerStatement";
}

export type Declaration = FunctionDeclaration | VariableDeclaration;

export interface BaseDeclaration extends BaseStatement {}

export interface MaybeNamedFunctionDeclaration
  extends BaseFunction,
    BaseDeclaration {
  type: "FunctionDeclaration";
  id: Identifier | null;
  body: BlockStatement;
}

export interface FunctionDeclaration extends MaybeNamedFunctionDeclaration {
  id: Identifier;
}

export interface VariableDeclaration extends BaseDeclaration {
  type: "VariableDeclaration";
  declarations: VariableDeclarator[];
  kind: "var" | "let" | "const";
}

export interface VariableDeclarator extends BaseNode {
  type: "VariableDeclarator";
  id: Pattern;
  init?: Expression | null | undefined;
}

export interface ExpressionMap {
  ArrayExpression: ArrayExpression;
  ArrowFunctionExpression: ArrowFunctionExpression;
  AssignmentExpression: AssignmentExpression;
  AwaitExpression: AwaitExpression;
  BinaryExpression: BinaryExpression;
  CallExpression: CallExpression;
  ChainExpression: ChainExpression;
  ConditionalExpression: ConditionalExpression;
  FunctionExpression: FunctionExpression;
  Identifier: Identifier;
  Literal: Literal;
  LogicalExpression: LogicalExpression;
  MemberExpression: MemberExpression;
  NewExpression: NewExpression;
  ObjectExpression: ObjectExpression;
  SequenceExpression: SequenceExpression;
  TaggedTemplateExpression: TaggedTemplateExpression;
  TemplateLiteral: TemplateLiteral;
  ThisExpression: ThisExpression;
  UnaryExpression: UnaryExpression;
  UpdateExpression: UpdateExpression;
}

export type Expression = ExpressionMap[keyof ExpressionMap];

export interface BaseExpression extends BaseNode {}

export type ChainElement = SimpleCallExpression | MemberExpression;

export interface ChainExpression extends BaseExpression {
  type: "ChainExpression";
  expression: ChainElement;
}

export interface ThisExpression extends BaseExpression {
  type: "ThisExpression";
}

export interface ArrayExpression extends BaseExpression {
  type: "ArrayExpression";
  elements: Array<Expression | null>; // SpreadElement
}

export interface ObjectExpression extends BaseExpression {
  type: "ObjectExpression";
  properties: Property[]; // SpreadElement
}

export interface Property extends BaseNode {
  type: "Property";
  key: Expression;
  value: Expression | Pattern; // Could be an AssignmentProperty
  kind: "init" | "get" | "set";
  method: boolean;
  shorthand: boolean;
  computed: boolean;
}

export interface PropertyDefinition extends BaseNode {
  type: "PropertyDefinition";
  key: Expression;
  value?: Expression | null | undefined;
  computed: boolean;
  static: boolean;
}

export interface FunctionExpression extends BaseFunction, BaseExpression {
  id?: Identifier | null | undefined;
  type: "FunctionExpression";
  body: BlockStatement;
}

export interface SequenceExpression extends BaseExpression {
  type: "SequenceExpression";
  expressions: Expression[];
}

export interface UnaryExpression extends BaseExpression {
  type: "UnaryExpression";
  operator: UnaryOperator;
  prefix: true;
  argument: Expression;
}

export interface BinaryExpression extends BaseExpression {
  type: "BinaryExpression";
  operator: BinaryOperator;
  left: Expression;
  right: Expression;
}

export interface AssignmentExpression extends BaseExpression {
  type: "AssignmentExpression";
  operator: AssignmentOperator;
  left: Pattern | MemberExpression;
  right: Expression;
}

export interface UpdateExpression extends BaseExpression {
  type: "UpdateExpression";
  operator: UpdateOperator;
  argument: Expression;
  prefix: boolean;
}

export interface LogicalExpression extends BaseExpression {
  type: "LogicalExpression";
  operator: LogicalOperator;
  left: Expression;
  right: Expression;
}

export interface ConditionalExpression extends BaseExpression {
  type: "ConditionalExpression";
  test: Expression;
  alternate: Expression;
  consequent: Expression;
}

export interface BaseCallExpression extends BaseExpression {
  callee: Expression;
  arguments: Array<Expression | SpreadElement>;
}
export type CallExpression = SimpleCallExpression | NewExpression;

export interface SimpleCallExpression extends BaseCallExpression {
  type: "CallExpression";
  optional: boolean;
}

export interface NewExpression extends BaseCallExpression {
  type: "NewExpression";
}

export interface MemberExpression extends BaseExpression, BasePattern {
  type: "MemberExpression";
  object: Expression;
  property: Expression;
  computed: boolean;
  optional: boolean;
}

export type Pattern =
  | Identifier
  | RestElement
  | AssignmentPattern
  | MemberExpression
  | ObjectPattern
  | JsonExpression;

export interface BasePattern extends BaseNode {}

export interface SwitchCase extends BaseNode {
  type: "SwitchCase";
  test?: Expression | null | undefined;
  consequent: Statement[];
}

export interface CatchClause extends BaseNode {
  type: "CatchClause";
  param: Pattern | null;
  body: BlockStatement;
}

export interface JsonExpression extends BaseNode, BaseExpression, BasePattern {
  type: "JsonExpression";
  body: JsonTypes;
}

export interface Identifier extends BaseNode, BaseExpression, BasePattern {
  type: "Identifier";
  name: string;
}

export type Literal = SimpleLiteral | RegExpLiteral | BigIntLiteral;

export interface SimpleLiteral extends BaseNode, BaseExpression {
  type: "Literal";
  value: string | boolean | number | null;
  raw?: string | undefined;
}

export interface RegExpLiteral extends BaseNode, BaseExpression {
  type: "Literal";
  value?: RegExp | null | undefined;
  regex: {
    pattern: string;
    flags: string;
  };
  raw?: string | undefined;
}

export interface BigIntLiteral extends BaseNode, BaseExpression {
  type: "Literal";
  value?: bigint | null | undefined;
  bigint: string;
  raw?: string | undefined;
}
export interface ForOfStatement extends BaseForXStatement {
  type: "ForOfStatement";
  await: boolean;
}

export interface SpreadElement extends BaseNode {
  type: "SpreadElement";
  argument: Expression;
}

export interface ArrowFunctionExpression extends BaseExpression, BaseFunction {
  type: "ArrowFunctionExpression";
  expression: boolean;
  body: BlockStatement | Expression;
}

export interface TemplateLiteral extends BaseExpression {
  type: "TemplateLiteral";
  quasis: TemplateElement[];
  expressions: Expression[];
}

export interface TaggedTemplateExpression extends BaseExpression {
  type: "TaggedTemplateExpression";
  tag: Expression;
  quasi: TemplateLiteral;
}

export interface TemplateElement extends BaseNode {
  type: "TemplateElement";
  tail: boolean;
  value: {
    cooked?: string | null | undefined;
    raw: string;
  };
}

export interface AssignmentProperty extends Property {
  value: Pattern;
  kind: "init";
  method: boolean;
}

export interface ObjectPattern extends BasePattern {
  type: "ObjectPattern";
  properties: Array<AssignmentProperty | RestElement>;
}

export interface RestElement extends BasePattern {
  type: "RestElement";
  argument: Pattern;
}

export interface AssignmentPattern extends BasePattern {
  type: "AssignmentPattern";
  left: Pattern;
  right: Expression;
}

export interface AwaitExpression extends BaseExpression {
  type: "AwaitExpression";
  argument: Expression;
}
