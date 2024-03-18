import { tokenizer as acornToken } from "acorn";

export function tokenizer(code: string) {
  const tokenizer = acornToken(code, { ecmaVersion: "latest" });
  let tokens: any[] = [];
  let token;
  while ((token = tokenizer.getToken())) {
    if (token.type.label == "eof") break;
    if (token.type.label == "string") tokens.push(`"${token.value}"`);
    else tokens.push(token.value || token.type.label);
  }
  return tokens;
}
