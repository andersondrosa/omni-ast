export type Node = NodeMap[keyof NodeMap];

interface ExpressionMap {
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
  JsonExpression: JsonExpression;
  ImportExpression: ImportExpression;
  Literal: Literal;
  LogicalExpression: LogicalExpression;
  MemberExpression: MemberExpression;
  MetaProperty: MetaProperty;
  NewExpression: NewExpression;
  ObjectExpression: ObjectExpression;
  SequenceExpression: SequenceExpression;
  TaggedTemplateExpression: TaggedTemplateExpression;
  TemplateLiteral: TemplateLiteral;
  ThisExpression: ThisExpression;
  UnaryExpression: UnaryExpression;
  UpdateExpression: UpdateExpression;
}
export interface NodeMap {
  AssignmentProperty: AssignmentProperty;
  CatchClause: CatchClause;
  Expression: Expression;
  Function: Function;
  Identifier: Identifier;
  Literal: Literal;
  MethodDefinition: MethodDefinition;
  Pattern: Pattern;
  Program: Program;
  Property: Property;
  PropertyDefinition: PropertyDefinition;
  SpreadElement: SpreadElement;
  Statement: Statement;
  SwitchCase: SwitchCase;
  TemplateElement: TemplateElement;
  VariableDeclarator: VariableDeclarator;
  ImportDeclaration: ImportDeclaration;
  ImportSpecifier: ImportSpecifier;
  ImportDefaultSpecifier: ImportDefaultSpecifier;
  ImportNamespaceSpecifier: ImportNamespaceSpecifier;
}

export type Expression = ExpressionMap[keyof ExpressionMap];
export type Statement =
  | ExpressionStatement
  | BlockStatement
  // | StaticBlock
  | EmptyStatement
  | DebuggerStatement
  // | WithStatement
  | ReturnStatement
  | LabeledStatement
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

export type CallExpression = SimpleCallExpression | NewExpression;
export type ChainElement = SimpleCallExpression | MemberExpression;
export type Declaration = FunctionDeclaration | VariableDeclaration;
export type Function =
  | ArrowFunctionExpression
  | FunctionDeclaration
  | FunctionExpression;
export type JsonTypes = string | number | boolean | null | object | [];
export type Literal = SimpleLiteral | RegExpLiteral | BigIntLiteral;
export type Pattern =
  | ArrayPattern
  | AssignmentPattern
  | Identifier
  | JsonExpression
  | MemberExpression
  | ObjectPattern
  | RestElement;

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
export type UnaryOperator =
  | "-"
  | "+"
  | "!"
  | "~"
  | "typeof"
  | "void"
  | "delete";
export type UpdateOperator = "++" | "--";

export interface ArrayExpression extends BaseExpression {
  type: "ArrayExpression";
  elements: Array<Expression | SpreadElement | null>;
}
export interface ArrayPattern extends BasePattern {
  type: "ArrayPattern";
  elements: Array<Pattern | null>;
}
export interface ArrowFunctionExpression extends BaseExpression, BaseFunction {
  type: "ArrowFunctionExpression";
  expression: boolean;
  body: BlockStatement | Expression;
}
export interface AssignmentExpression extends BaseExpression {
  type: "AssignmentExpression";
  operator: AssignmentOperator;
  left: Pattern | MemberExpression;
  right: Expression;
}
export interface AssignmentPattern extends BasePattern {
  type: "AssignmentPattern";
  left: Pattern;
  right: Expression;
}
export interface AssignmentProperty extends Property {
  value: Pattern;
  kind: "init";
  method: boolean;
}
export interface AwaitExpression extends BaseExpression {
  type: "AwaitExpression";
  argument: Expression;
}
export interface BaseCallExpression extends BaseExpression {
  callee: Expression;
  arguments: Array<Expression | SpreadElement>;
}
export interface BaseDeclaration extends BaseStatement {}
export interface BaseExpression extends BaseNode {}
export interface BaseForXStatement extends BaseStatement {
  left: VariableDeclaration | Pattern;
  right: Expression;
  body: Statement;
}
export interface BaseFunction extends BaseNode {
  params: Pattern[];
  generator?: boolean | undefined;
  async?: boolean | undefined;
  body: BlockStatement | Expression;
}
export interface BaseNode extends BaseNodeWithoutComments {
  leadingComments?: Comment[] | undefined;
  trailingComments?: Comment[] | undefined;
}
export interface BaseNodeWithoutComments {
  type: string;
  loc?: SourceLocation | null | undefined;
  range?: [number, number] | undefined;
}
export interface BasePattern extends BaseNode {}
export interface BaseStatement extends BaseNode {}
export interface BigIntLiteral extends BaseNode, BaseExpression {
  type: "Literal";
  value?: bigint | null | undefined;
  bigint: string;
  raw?: string | undefined;
}
export interface BinaryExpression extends BaseExpression {
  type: "BinaryExpression";
  operator: BinaryOperator;
  left: Expression;
  right: Expression;
}
export interface BlockStatement extends BaseStatement {
  type: "BlockStatement";
  body: Statement[];
  innerComments?: Comment[] | undefined;
}
export interface BreakStatement extends BaseStatement {
  type: "BreakStatement";
  label?: Identifier | null | undefined;
}
export interface CatchClause extends BaseNode {
  type: "CatchClause";
  param: Pattern | null;
  body: BlockStatement;
}
export interface ChainExpression extends BaseExpression {
  type: "ChainExpression";
  expression: ChainElement;
}
export interface Comment extends BaseNodeWithoutComments {
  type: "Line" | "Block";
  value: string;
}
export interface ConditionalExpression extends BaseExpression {
  type: "ConditionalExpression";
  test: Expression;
  alternate: Expression;
  consequent: Expression;
}
export interface ContinueStatement extends BaseStatement {
  type: "ContinueStatement";
  label?: Identifier | null | undefined;
}
export interface DebuggerStatement extends BaseStatement {
  type: "DebuggerStatement";
}
export interface Directive extends BaseNode {
  type: "ExpressionStatement";
  expression: Literal;
  directive: string;
}
export interface DoWhileStatement extends BaseStatement {
  type: "DoWhileStatement";
  body: Statement;
  test: Expression;
}
export interface EmptyStatement extends BaseStatement {
  type: "EmptyStatement";
}
export interface ExpressionStatement extends BaseStatement {
  type: "ExpressionStatement";
  expression: Expression;
}
export interface ForInStatement extends BaseForXStatement {
  type: "ForInStatement";
}
export interface ForOfStatement extends BaseForXStatement {
  type: "ForOfStatement";
  await: boolean;
}
export interface ForStatement extends BaseStatement {
  type: "ForStatement";
  init?: VariableDeclaration | Expression | null | undefined;
  test?: Expression | null | undefined;
  update?: Expression | null | undefined;
  body: Statement;
}
export interface FunctionDeclaration extends MaybeNamedFunctionDeclaration {
  id: Identifier;
}
export interface FunctionExpression extends BaseFunction, BaseExpression {
  id?: Identifier | null | undefined;
  type: "FunctionExpression";
  body: BlockStatement;
}
export interface Identifier extends BaseNode, BaseExpression, BasePattern {
  type: "Identifier";
  name: string;
}
export interface IfStatement extends BaseStatement {
  type: "IfStatement";
  test: Expression;
  consequent: Statement;
  alternate?: Statement | null | undefined;
}
export interface JsonExpression extends BaseNode, BaseExpression, BasePattern {
  type: "JsonExpression";
  body: JsonTypes;
}
export interface LabeledStatement extends BaseStatement {
  type: "LabeledStatement";
  label: Identifier;
  body: Statement;
}
export interface LogicalExpression extends BaseExpression {
  type: "LogicalExpression";
  operator: LogicalOperator;
  left: Expression;
  right: Expression;
}
export interface MaybeNamedFunctionDeclaration
  extends BaseFunction,
    BaseDeclaration {
  type: "FunctionDeclaration";
  id: Identifier | null;
  body: BlockStatement;
}
export interface MemberExpression extends BaseExpression, BasePattern {
  type: "MemberExpression";
  object: Expression;
  property: Expression;
  computed?: boolean;
  optional?: boolean;
}
export interface MetaProperty extends BaseExpression {
  type: "MetaProperty";
  meta: Identifier;
  property: Identifier;
}
export type ModuleDeclaration = ImportDeclaration;
// | ExportNamedDeclaration
// | ExportDefaultDeclaration
// | ExportAllDeclaration;
export interface BaseModuleDeclaration extends BaseNode {}

export type ModuleSpecifier =
  | ImportSpecifier
  | ImportDefaultSpecifier
  | ImportNamespaceSpecifier;
// | ExportSpecifier;
export interface BaseModuleSpecifier extends BaseNode {
  local: Identifier;
}

export interface MethodDefinition extends BaseNode {
  type: "MethodDefinition";
  key: Expression;
  value: FunctionExpression;
  kind: "constructor" | "method" | "get" | "set";
  computed?: boolean;
  static: boolean;
}
export interface NewExpression extends BaseCallExpression {
  type: "NewExpression";
}
export interface ObjectExpression extends BaseExpression {
  type: "ObjectExpression";
  properties: Array<Property | SpreadElement>;
}
export interface ObjectPattern extends BasePattern {
  type: "ObjectPattern";
  properties: Array<AssignmentProperty | RestElement>;
}
export interface Position {
  line: number;
  column: number;
}
export interface Program extends BaseNode {
  type: "Program";
  sourceType: "script" | "module";
  body: Array<Directive | Statement | ModuleDeclaration>;
  comments?: Comment[] | undefined;
}
export interface Property extends BaseNode {
  type: "Property";
  key: Expression;
  value: Expression | Pattern | AssignmentProperty;
  kind: "init" | "get" | "set";
  method?: boolean;
  shorthand?: boolean;
  computed?: boolean;
}
export interface PropertyDefinition extends BaseNode {
  type: "PropertyDefinition";
  key: Expression;
  value?: Expression | null | undefined;
  computed?: boolean;
  static: boolean;
}
export interface RegExpLiteral extends BaseNode, BaseExpression {
  type: "Literal";
  value?: RegExp | null | undefined;
  regex: { pattern: string; flags: string };
  raw?: string | undefined;
}
export interface RestElement extends BasePattern {
  type: "RestElement";
  argument: Pattern;
}
export interface ReturnStatement extends BaseStatement {
  type: "ReturnStatement";
  argument?: Expression | null | undefined;
}
export interface SequenceExpression extends BaseExpression {
  type: "SequenceExpression";
  expressions: Expression[];
}
export interface SimpleCallExpression extends BaseCallExpression {
  type: "CallExpression";
  optional?: boolean;
}
export interface SimpleLiteral extends BaseNode, BaseExpression {
  type: "Literal";
  value: string | boolean | number | null;
  raw?: string | undefined;
}
export interface SourceLocation {
  source?: string | null | undefined;
  start: Position;
  end: Position;
}
export interface SpreadElement extends BaseNode {
  type: "SpreadElement";
  argument: Expression;
}
export interface SwitchCase extends BaseNode {
  type: "SwitchCase";
  test?: Expression | null | undefined;
  consequent: Statement[];
}
export interface SwitchStatement extends BaseStatement {
  type: "SwitchStatement";
  discriminant: Expression;
  cases: SwitchCase[];
}
export interface TaggedTemplateExpression extends BaseExpression {
  type: "TaggedTemplateExpression";
  tag: Expression;
  quasi: TemplateLiteral;
}
export interface TemplateElement extends BaseNode {
  type: "TemplateElement";
  tail: boolean;
  value: { cooked?: string | null | undefined; raw: string };
}
export interface TemplateLiteral extends BaseExpression {
  type: "TemplateLiteral";
  quasis: TemplateElement[];
  expressions: Expression[];
}
export interface ThisExpression extends BaseExpression {
  type: "ThisExpression";
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
export interface UnaryExpression extends BaseExpression {
  type: "UnaryExpression";
  operator: UnaryOperator;
  prefix: true;
  argument: Expression;
}
export interface UpdateExpression extends BaseExpression {
  type: "UpdateExpression";
  operator: UpdateOperator;
  argument: Expression;
  prefix: boolean;
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
export interface WhileStatement extends BaseStatement {
  type: "WhileStatement";
  test: Expression;
  body: Statement;
}

export interface ImportDeclaration extends BaseModuleDeclaration {
  type: "ImportDeclaration";
  specifiers: Array<
    ImportSpecifier | ImportDefaultSpecifier | ImportNamespaceSpecifier
  >;
  source: Literal;
}

export interface ImportSpecifier extends BaseModuleSpecifier {
  type: "ImportSpecifier";
  imported: Identifier;
}

export interface ImportExpression extends BaseExpression {
  type: "ImportExpression";
  source: Expression;
}

export interface ImportDefaultSpecifier extends BaseModuleSpecifier {
  type: "ImportDefaultSpecifier";
}

export interface ImportNamespaceSpecifier extends BaseModuleSpecifier {
  type: "ImportNamespaceSpecifier";
}

export type SimpleArrayExpression = Partial<ArrayExpression>;
export type SimpleArrayPattern = Partial<ArrayPattern>;
export type SimpleArrowFunctionExpression = Partial<ArrowFunctionExpression>;
export type SimpleAssignmentExpression = Partial<AssignmentExpression>;
export type SimpleAssignmentPattern = Partial<AssignmentPattern>;
export type SimpleAssignmentProperty = Partial<AssignmentProperty>;
export type SimpleAwaitExpression = Partial<AwaitExpression>;
export type SimpleBaseCallExpression = Partial<BaseCallExpression>;
export type SimpleBaseDeclaration = Partial<BaseDeclaration>;
export type SimpleBaseExpression = Partial<BaseExpression>;
export type SimpleBaseForXStatement = Partial<BaseForXStatement>;
export type SimpleBaseFunction = Partial<BaseFunction>;
export type SimpleBaseNode = Partial<BaseNode>;
export type SimpleBaseNodeWithoutComments = Partial<BaseNodeWithoutComments>;
export type SimpleBasePattern = Partial<BasePattern>;
export type SimpleBaseStatement = Partial<BaseStatement>;
export type SimpleBigIntLiteral = Partial<BigIntLiteral>;
export type SimpleBinaryExpression = Partial<BinaryExpression>;
export type SimpleBlockStatement = Partial<BlockStatement>;
export type SimpleBreakStatement = Partial<BreakStatement>;
export type SimpleCatchClause = Partial<CatchClause>;
export type SimpleChainExpression = Partial<ChainExpression>;
export type SimpleComment = Partial<Comment>;
export type SimpleConditionalExpression = Partial<ConditionalExpression>;
export type SimpleContinueStatement = Partial<ContinueStatement>;
export type SimpleDoWhileStatement = Partial<DoWhileStatement>;
export type SimpleEmptyStatement = Partial<EmptyStatement>;
export type SimpleExpressionStatement = Partial<ExpressionStatement>;
export type SimpleForInStatement = Partial<ForInStatement>;
export type SimpleForOfStatement = Partial<ForOfStatement>;
export type SimpleForStatement = Partial<ForStatement>;
export type SimpleFunctionDeclaration = Partial<FunctionDeclaration>;
export type SimpleFunctionExpression = Partial<FunctionExpression>;
export type SimpleIdentifier = Partial<Identifier>;
export type SimpleIfStatement = Partial<IfStatement>;
export type SimpleJsonExpression = Partial<JsonExpression>;
export type SimpleLabeledStatement = Partial<LabeledStatement>;
export type SimpleLogicalExpression = Partial<LogicalExpression>;
export type SimpleMemberExpression = Partial<MemberExpression>;
export type SimpleMethodDefinition = Partial<MethodDefinition>;
export type SimpleNewExpression = Partial<NewExpression>;
export type SimpleObjectExpression = Partial<ObjectExpression>;
export type SimpleObjectPattern = Partial<ObjectPattern>;
export type SimplePosition = Partial<Position>;
export type SimpleProgram = Partial<Program>;
export type SimpleProperty = Partial<Property>;
export type SimplePropertyDefinition = Partial<PropertyDefinition>;
export type SimpleRegExpLiteral = Partial<RegExpLiteral>;
export type SimpleRestElement = Partial<RestElement>;
export type SimpleReturnStatement = Partial<ReturnStatement>;
export type SimpleSequenceExpression = Partial<SequenceExpression>;
export type SimpleSimpleCallExpression = Partial<SimpleCallExpression>;
export type SimpleSimpleLiteral = Partial<SimpleLiteral>;
export type SimpleSourceLocation = Partial<SourceLocation>;
export type SimpleSpreadElement = Partial<SpreadElement>;
export type SimpleSwitchCase = Partial<SwitchCase>;
export type SimpleSwitchStatement = Partial<SwitchStatement>;
export type SimpleTemplateElement = Partial<TemplateElement>;
export type SimpleTemplateLiteral = Partial<TemplateLiteral>;
export type SimpleThisExpression = Partial<ThisExpression>;
export type SimpleThrowStatement = Partial<ThrowStatement>;
export type SimpleTryStatement = Partial<TryStatement>;
export type SimpleUnaryExpression = Partial<UnaryExpression>;
export type SimpleUpdateExpression = Partial<UpdateExpression>;
export type SimpleVariableDeclaration = Partial<VariableDeclaration>;
export type SimpleVariableDeclarator = Partial<VariableDeclarator>;
export type SimpleWhileStatement = Partial<WhileStatement>;
