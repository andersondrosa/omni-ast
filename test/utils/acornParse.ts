const acorn = require("acorn");
const options = { ecmaVersion: "latest", sourceType: "script" };

export const acornParse = (code: string) => acorn.parse(code, options);
