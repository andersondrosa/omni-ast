# OMNI-AST

OMNI-AST is a hybrid Abstract Syntax Tree (AST) representation that combines **native JSON structures** with **executable logic nodes** (based on ESTree AST). It enables building, simplifying, serializing, and reconstructing ASTs with full support for embedded logic and bidirectional transformation.

---

## ✨ Highlights

- ✔ Simplified ASTs in serializable JSON format
- ✔ Support for native data + executable expressions
- ✔ Bidirectional transformation: AST <-> JSON <-> Code
- ✔ Fully compatible with ESTree (used by Acorn, Babel, Esprima)
- ✔ Ideal for compilation, validation, transformers, or declarative DSLs

---

## 🔗 Installation

```bash
pnpm add omni-ast
```

---

## 🛠️ Core API

### `simplify(ast: Node): SimpleNode`
Converts a full ESTree AST into a simplified, JSON-compatible format.

### `parseAST(simple: SimpleNode): Node`
Reconstructs a full AST from a simplified JSON structure.

### `json(obj: JsonTypes): JsonExpression`
Creates a `JsonExpression`, representing native data inside an AST.

### `ast(node: Node): any`
Marks a piece of AST as executable logic inside a JSON object.

### `generate(node: Node | SimpleNode): string`
Generates source code from a full or simplified AST.

### `serialize(obj: JsonTypes | ASTHybrid): string`
Serializes a hybrid JSON object (with `#ast`) into readable JavaScript code.

### `jsonParseValue(node: Node): JsonTypes | { #ast }`
Converts an `ObjectExpression`, `Literal`, or `ArrayExpression` into a hybrid JSON object.

### `ObjectExpressionToJSON(expr: ObjectExpression): object`
Extracts an `ObjectExpression` into a native JSON object, supporting `computed` and `Spread`.

---

## 🧱 Builders

OMNI-AST provides a `builders` module to programmatically construct any supported AST node using clean and composable functions. These are ideal for generating ASTs manually or from UI builders.

### Example: Manual construction of `ChainExpression`
```ts
const expr = builders.assignmentExpression(
  "=",
  builders.identifier("value"),
  builders.chainExpression(
    builders.memberExpression(
      builders.memberExpression(
        builders.memberExpression(
          builders.memberExpression(
            builders.identifier("base"),
            builders.identifier("foo")
          ),
          builders.identifier("bar"),
          false,
          true
        ),
        builders.identifier("optional"),
        true,
        true
      ),
      builders.literal("strict"),
      true
    )
  )
);

const code = generate(expr);
```

This will produce the code:
```js
value = base.foo?.bar?.[optional]["strict"]
```

Builders follow the official AST node structure but with ergonomic wrappers.

---

## 📂 Hybrid Structure

OMNI-AST allows objects that mix native data and embedded logic:

```ts
json({
  user: "admin",
  config: ast({
    type: "CallExpression",
    callee: { type: "Identifier", name: "loadConfig" },
    arguments: []
  })
});
```

Expanded form:
```json
{
  "user": "admin",
  "config": {
    "#ast": "current",
    "body": {
      "type": "CallExpression",
      "callee": { "type": "Identifier", "name": "loadConfig" },
      "arguments": []
    }
  }
}
```

---

## ♻️ Bidirectional Flow

```ts
const code = `({ x: getValue() })`;
const ast = acornParse(code).body[0].expression; // external, like acorn

const simple = simplify(ast);
const backAST = parseAST(simple);
const codeAgain = generate(simple);
```

- `simplify` → reduces AST
- `parseAST` → reconstructs full AST
- `generate` → emits JavaScript code

---

## 🔹 Special Types

### `JsonExpression`
Allows embedding native JSON inside an AST.

### `#ast`
Special object marker to embed AST logic inside JSON:

```json
{
  "#ast": "current",
  "body": { "type": "Identifier", "name": "foo" }
}
```

---

## 📅 Usage Examples

### Example 1: Serialization with logic
```ts
serialize({
  name: "omni",
  handler: ast({
    type: "ArrowFunctionExpression",
    expression: true,
    params: [],
    body: { type: "Literal", value: "ok" }
  })
});
```

Output:
```js
{ name: "omni", handler: () => "ok" }
```

### Example 2: Round-trip conversion
```ts
const expr = b.assignmentExpression("=", b.identifier("a"), b.literal(42));
const jsonified = simplify(expr);
const restored = parseAST(jsonified);
expect(generate(restored)).toBe("a = 42");
```

### Example 3: Full hybrid usage
```ts
json({
  title: "Report",
  footer: ast({
    type: "FunctionExpression",
    id: null,
    params: [],
    body: {
      type: "BlockStatement",
      body: [
        {
          type: "ExpressionStatement",
          expression: {
            type: "CallExpression",
            callee: { type: "Identifier", name: "console.log" },
            arguments: [
              { type: "Literal", value: "Generated with OMNI-AST" }
            ]
          }
        }
      ]
    }
  })
});
```

### Example 4: Serialization with computed keys
```ts
const expr = {
  type: "ObjectExpression",
  properties: [
    {
      type: "Property",
      key: { type: "Identifier", name: "foo" },
      value: { type: "Literal", value: 123 },
      kind: "init",
      computed: false
    },
    {
      type: "Property",
      key: { type: "Identifier", name: "bar" },
      value: ast({
        type: "CallExpression",
        callee: { type: "Identifier", name: "fn" },
        arguments: []
      }),
      kind: "init",
      computed: false
    }
  ]
};

const result = ObjectExpressionToJSON(expr);
```

---

## 🚀 Use Cases

- Declarative execution engines (like FireAST)
- JSON-based DSLs with embedded logic
- AST transformation tools
- Visual editors or builders with code export
- ETL pipelines with dynamic JSON rules

---

## ✨ Roadmap
- Type validation per node
- Reversible generation with comments and location tracking
- Interactive AST + JSON visualizer

---

## 🐛 External Parsers
For testing, you can use any parser compatible with ESTree (such as Acorn, Espree, Babel). OMNI-AST does not depend on them directly.

---

## ⚖️ License
MIT

