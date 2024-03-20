import { describe, expect, it } from "vitest";
import { acornParse } from "./utils/acornParse";

describe("", () => {
  //
  it("AssignmentExpression", () => {
    const input = "const {a: renamedA, b: renamedB} = obj;";
    const ast = acornParse(input);
    const variableDeclaration = ast.body[0];
    const objectPattern = variableDeclaration.declarations[0].id;

    expect(objectPattern.type).toBe("ObjectPattern");
    expect(objectPattern.properties.length).toBe(2);

    const firstProperty = objectPattern.properties[0];
    expect(firstProperty.type).toBe("Property");
    expect(firstProperty.key.type).toBe("Identifier");
    expect(firstProperty.key.name).toBe("a");
    expect(firstProperty.value.type).toBe("Identifier");
    expect(firstProperty.value.name).toBe("renamedA");

    const secondProperty = objectPattern.properties[1];
    expect(secondProperty.type).toBe("Property");
    expect(secondProperty.key.type).toBe("Identifier");
    expect(secondProperty.key.name).toBe("b");
    expect(secondProperty.value.type).toBe("Identifier");
    expect(secondProperty.value.name).toBe("renamedB");
  });

  it("ArrayExpression", () => {
    const input = "[1, 2, a]";
    const ast = acornParse(input);
    const arrayExpression = ast.body[0].expression;

    expect(arrayExpression.type).toBe("ArrayExpression");
    expect(arrayExpression.elements.length).toBe(3);
    expect(arrayExpression.elements[2].type).toBe("Identifier");
    expect(arrayExpression.elements[2].name).toBe("a");
  });

  it("ArrayPattern", () => {
    const input = "const [a, b] = arr;";
    const ast = acornParse(input);
    const variableDeclaration = ast.body[0];
    const arrayPattern = variableDeclaration.declarations[0].id;

    expect(arrayPattern.type).toBe("ArrayPattern");
    expect(arrayPattern.elements.length).toBe(2);

    const firstElement = arrayPattern.elements[0];
    expect(firstElement.type).toBe("Identifier");
    expect(firstElement.name).toBe("a");

    const secondElement = arrayPattern.elements[1];
    expect(secondElement.type).toBe("Identifier");
    expect(secondElement.name).toBe("b");
  });

  it("ArrowFunctionExpression", () => {
    const input = "(x) => x + 1";
    const ast = acornParse(input);
    const arrowFunctionExpression = ast.body[0].expression;

    expect(arrowFunctionExpression.type).toBe("ArrowFunctionExpression");
    expect(arrowFunctionExpression.params[0].type).toBe("Identifier");
    expect(arrowFunctionExpression.body.type).toBe("BinaryExpression");
  });

  it("AwaitExpression", () => {
    const input = "async function f() { await something(); }";
    const ast = acornParse(input);
    const awaitExpression = ast.body[0].body.body[0].expression;

    expect(awaitExpression.type).toBe("AwaitExpression");
    expect(awaitExpression.argument.type).toBe("CallExpression");
  });

  it("BinaryExpression", () => {
    const input = "a + b";
    const ast = acornParse(input);
    const binaryExpression = ast.body[0].expression;

    expect(binaryExpression.type).toBe("BinaryExpression");
    expect(binaryExpression.operator).toBe("+");
    expect(binaryExpression.left.type).toBe("Identifier");
    expect(binaryExpression.right.type).toBe("Identifier");
  });

  it("BlockStatement", () => {
    const input = "{ a = 2; b = 3; }";
    const ast = acornParse(input);
    const blockStatement = ast.body[0];

    expect(blockStatement.type).toBe("BlockStatement");
    expect(blockStatement.body.length).toBe(2);
    expect(blockStatement.body[0].expression.type).toBe("AssignmentExpression");
    expect(blockStatement.body[1].expression.type).toBe("AssignmentExpression");
  });

  it("BreakStatement", () => {
    const input = "while (true) { break; }";
    const ast = acornParse(input);
    const breakStatement = ast.body[0].body.body[0];

    expect(breakStatement.type).toBe("BreakStatement");
  });

  it("CallExpression", () => {
    const input = "console.log(a, b);";
    const ast = acornParse(input);
    const callExpression = ast.body[0].expression;

    expect(callExpression.type).toBe("CallExpression");
    expect(callExpression.callee.type).toBe("MemberExpression");
    expect(callExpression.arguments.length).toBe(2);
  });

  it("CatchClause", () => {
    const input = "try { something(); } catch(e) { handleError(e); }";
    const ast = acornParse(input);
    const catchClause = ast.body[0].handler;

    expect(catchClause.type).toBe("CatchClause");
    expect(catchClause.param.type).toBe("Identifier");
    expect(catchClause.body.type).toBe("BlockStatement");
  });

  it("ChainExpression", () => {
    const input = "obj?.prop?.method();";
    const ast = acornParse(input);
    const chainExpression = ast.body[0].expression;

    expect(chainExpression.type).toBe("ChainExpression");
    expect(chainExpression.expression.type).toBe("CallExpression");
    expect(chainExpression.expression.optional).toBe(false);
  });

  it("ConditionalExpression", () => {
    const input = "a ? b : c;";
    const ast = acornParse(input);
    const conditionalExpression = ast.body[0].expression;

    expect(conditionalExpression.type).toBe("ConditionalExpression");
    expect(conditionalExpression.test.type).toBe("Identifier");
    expect(conditionalExpression.consequent.type).toBe("Identifier");
    expect(conditionalExpression.alternate.type).toBe("Identifier");
  });

  it("ContinueStatement", () => {
    const input = "while (true) { continue; }";
    const ast = acornParse(input);
    const continueStatement = ast.body[0].body.body[0];

    expect(continueStatement.type).toBe("ContinueStatement");
  });

  it("ExpressionStatement", () => {
    const input = "a = b;";
    const ast = acornParse(input);
    const expressionStatement = ast.body[0];

    expect(expressionStatement.type).toBe("ExpressionStatement");
    expect(expressionStatement.expression.type).toBe("AssignmentExpression");
  });

  it("ForInStatement", () => {
    const input = "for (var prop in object) { console.log(prop); }";
    const ast = acornParse(input);
    const forInStatement = ast.body[0];

    expect(forInStatement.type).toBe("ForInStatement");
    expect(forInStatement.left.type).toBe("VariableDeclaration");
    expect(forInStatement.right.type).toBe("Identifier");
    expect(forInStatement.body.type).toBe("BlockStatement");
  });

  it("ForOfStatement", () => {
    const input = "for (let item of array) { console.log(item); }";
    const ast = acornParse(input);
    const forOfStatement = ast.body[0];

    expect(forOfStatement.type).toBe("ForOfStatement");
    expect(forOfStatement.left.type).toBe("VariableDeclaration");
    expect(forOfStatement.right.type).toBe("Identifier");
    expect(forOfStatement.body.type).toBe("BlockStatement");
  });

  it("ForStatement", () => {
    const input = "for (let i = 0; i < 10; i++) { console.log(i); }";
    const ast = acornParse(input);
    const forStatement = ast.body[0];

    expect(forStatement.type).toBe("ForStatement");
    expect(forStatement.init.type).toBe("VariableDeclaration");
    expect(forStatement.test.type).toBe("BinaryExpression");
    expect(forStatement.update.type).toBe("UpdateExpression");
    expect(forStatement.body.type).toBe("BlockStatement");
  });

  it("FunctionDeclaration", () => {
    const input = "function myFunc(a, b) { return a + b; }";
    const ast = acornParse(input);
    const functionDeclaration = ast.body[0];

    expect(functionDeclaration.type).toBe("FunctionDeclaration");
    expect(functionDeclaration.id.name).toBe("myFunc");
    expect(functionDeclaration.params.length).toBe(2);
    expect(functionDeclaration.body.type).toBe("BlockStatement");
  });

  it("IfStatement", () => {
    const input =
      'if (a > b) { console.log("a is greater"); } else { console.log("b is greater"); }';
    const ast = acornParse(input);
    const ifStatement = ast.body[0];

    expect(ifStatement.type).toBe("IfStatement");
    expect(ifStatement.test.type).toBe("BinaryExpression");
    expect(ifStatement.consequent.type).toBe("BlockStatement");
    expect(ifStatement.alternate.type).toBe("BlockStatement");
  });

  it("FunctionExpression", () => {
    const input = "const myFunc = function(a, b) { return a + b; };";
    const ast = acornParse(input);
    const functionExpression = ast.body[0].declarations[0].init;

    expect(functionExpression.type).toBe("FunctionExpression");
    expect(functionExpression.params.length).toBe(2);
    expect(functionExpression.body.type).toBe("BlockStatement");
  });

  it("Identifier", () => {
    const input = "const a = 1;";
    const ast = acornParse(input);
    const identifier = ast.body[0].declarations[0].id;

    expect(identifier.type).toBe("Identifier");
    expect(identifier.name).toBe("a");
  });

  it("LogicalExpression", () => {
    const input = "a && b || c";
    const ast = acornParse(input);
    const logicalExpression = ast.body[0].expression;

    expect(logicalExpression.type).toBe("LogicalExpression");
    expect(logicalExpression.operator).toBe("||");
    expect(logicalExpression.left.type).toBe("LogicalExpression");
    expect(logicalExpression.right.type).toBe("Identifier");
  });

  it("MemberExpression", () => {
    const input = "console.log(a);";
    const ast = acornParse(input);
    const memberExpression = ast.body[0].expression.callee;

    expect(memberExpression.type).toBe("MemberExpression");
    expect(memberExpression.object.name).toBe("console");
    expect(memberExpression.property.name).toBe("log");
  });

  it("NewExpression", () => {
    const input = "const a = new MyClass();";
    const ast = acornParse(input);
    const newExpression = ast.body[0].declarations[0].init;

    expect(newExpression.type).toBe("NewExpression");
    expect(newExpression.callee.name).toBe("MyClass");
  });

  it("ObjectExpression", () => {
    const input = 'const obj = { key: "value", num: 123 };';
    const ast = acornParse(input);
    const objectExpression = ast.body[0].declarations[0].init;

    expect(objectExpression.type).toBe("ObjectExpression");
    expect(objectExpression.properties.length).toBe(2);
    expect(objectExpression.properties[0].key.name).toBe("key");
    expect(objectExpression.properties[1].key.name).toBe("num");
  });

  it("ObjectPattern", () => {
    const input = "const {a, b} = obj;";
    const ast = acornParse(input);
    const objectPattern = ast.body[0].declarations[0].id;

    expect(objectPattern.type).toBe("ObjectPattern");
    expect(objectPattern.properties.length).toBe(2);
  });

  it("Property", () => {
    const input = 'const obj = { key: "value" };';
    const ast = acornParse(input);
    const property = ast.body[0].declarations[0].init.properties[0];

    expect(property.type).toBe("Property");
    expect(property.key.type).toBe("Identifier");
    expect(property.value.type).toBe("Literal");
    expect(property.value.value).toBe("value");
  });

  it("ReturnStatement", () => {
    const input = "function test() { return true; }";
    const ast = acornParse(input);
    const returnStatement = ast.body[0].body.body[0];

    expect(returnStatement.type).toBe("ReturnStatement");
    expect(returnStatement.argument.type).toBe("Literal");
    expect(returnStatement.argument.value).toBe(true);
  });

  it("SwitchCase", () => {
    const input = "switch (a) { case 1: break; }";
    const ast = acornParse(input);
    const switchCase = ast.body[0].cases[0];

    expect(switchCase.type).toBe("SwitchCase");
    expect(switchCase.test.type).toBe("Literal");
    expect(switchCase.test.value).toBe(1);
    expect(switchCase.consequent[0].type).toBe("BreakStatement");
  });

  it("SwitchStatement", () => {
    const input = "switch (a) { case 1: break; default: break; }";
    const ast = acornParse(input);
    const switchStatement = ast.body[0];

    expect(switchStatement.type).toBe("SwitchStatement");
    expect(switchStatement.discriminant.type).toBe("Identifier");
    expect(switchStatement.cases.length).toBe(2);
  });

  it("TemplateElement", () => {
    const input = "const greeting = `Hello, ${name}!`;";
    const ast = acornParse(input);
    const templateLiteral = ast.body[0].declarations[0].init;

    expect(templateLiteral.type).toBe("TemplateLiteral");

    expect(templateLiteral.quasis[0].type).toBe("TemplateElement");
    expect(templateLiteral.quasis[0].value.raw).toBe("Hello, ");
    expect(templateLiteral.quasis[0].value.cooked).toBe("Hello, ");

    expect(templateLiteral.quasis[1].type).toBe("TemplateElement");
    expect(templateLiteral.quasis[1].value.raw).toBe("!");
    expect(templateLiteral.quasis[1].value.cooked).toBe("!");

    expect(templateLiteral.expressions[0].type).toBe("Identifier");
    expect(templateLiteral.expressions[0].name).toBe("name");
  });

  it("TemplateLiteral", () => {
    const input = "const str = `Hello, ${name}!`;";
    const ast = acornParse(input);
    const templateLiteral = ast.body[0].declarations[0].init;

    expect(templateLiteral.type).toBe("TemplateLiteral");
    expect(templateLiteral.expressions.length).toBe(1);
    expect(templateLiteral.quasis.length).toBe(2);
  });

  it("ThrowStatement", () => {
    const input = 'throw new Error("Something went wrong");';
    const ast = acornParse(input);
    const throwStatement = ast.body[0];

    expect(throwStatement.type).toBe("ThrowStatement");
    expect(throwStatement.argument.type).toBe("NewExpression");
  });

  it("TryStatement", () => {
    const input =
      "try { doSomething(); } catch (e) { handleError(e); } finally { cleanup(); }";
    const ast = acornParse(input);
    const tryStatement = ast.body[0];

    expect(tryStatement.type).toBe("TryStatement");
    expect(tryStatement.block.type).toBe("BlockStatement");
    expect(tryStatement.handler.type).toBe("CatchClause");
    expect(tryStatement.finalizer.type).toBe("BlockStatement");
  });

  it("UnaryExpression", () => {
    const input = "-a;";
    const ast = acornParse(input);
    const unaryExpression = ast.body[0].expression;

    expect(unaryExpression.type).toBe("UnaryExpression");
    expect(unaryExpression.operator).toBe("-");
    expect(unaryExpression.argument.type).toBe("Identifier");
  });

  it("UpdateExpression", () => {
    const input = "a++;";
    const ast = acornParse(input);
    const updateExpression = ast.body[0].expression;

    expect(updateExpression.type).toBe("UpdateExpression");
    expect(updateExpression.operator).toBe("++");
    expect(updateExpression.argument.type).toBe("Identifier");
  });

  it("VariableDeclaration", () => {
    const input = "let a = 1;";
    const ast = acornParse(input);
    const variableDeclaration = ast.body[0];

    expect(variableDeclaration.type).toBe("VariableDeclaration");
    expect(variableDeclaration.declarations.length).toBe(1);
    expect(variableDeclaration.kind).toBe("let");
  });

  it("VariableDeclarator", () => {
    const input = "const a = 1;";
    const ast = acornParse(input);
    const variableDeclarator = ast.body[0].declarations[0];

    expect(variableDeclarator.type).toBe("VariableDeclarator");
    expect(variableDeclarator.id.type).toBe("Identifier");
    expect(variableDeclarator.init.type).toBe("Literal");
    expect(variableDeclarator.init.value).toBe(1);
  });

  it("WhileStatement", () => {
    const input = "while (a < 10) { a++; }";
    const ast = acornParse(input);
    const whileStatement = ast.body[0];

    expect(whileStatement.type).toBe("WhileStatement");
    expect(whileStatement.test.type).toBe("BinaryExpression");
    expect(whileStatement.body.type).toBe("BlockStatement");
  });
});
