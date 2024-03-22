const acorn = require("acorn");
const options = { ecmaVersion: "latest", sourceType: "module" };

export const acornParse = (code: string, opts = {}) =>
  acorn.parse(code, Object.assign({}, options, opts));
