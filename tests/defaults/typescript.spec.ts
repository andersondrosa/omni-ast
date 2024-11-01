import { describe, expect, it } from "vitest";
import { acornParse } from "../utils/acornParse";
import * as fs from "fs";
import * as ts from "typescript";

const libDTSText = fs.readFileSync(__dirname + "/lib.d.ts").toString();

const options: ts.CompilerOptions = {
  noEmitOnError: true,
  noImplicitAny: true,
  target: ts.ScriptTarget.ES5,
  module: ts.ModuleKind.CommonJS,
};

const files = {
  "/lib.d.ts": libDTSText,

  "/node_modules/types.ts": `
    export type Props = { name: string };
    export type MapResponse = { name: string };
  `,
  "/node_modules/react.ts": `
    export type Props = { name: string };
    export type MapResponse = { name: string };
  `,
  "/mapper.ts": `
    import { MapResponse } from "types";
    const map = (): MapResponse => { return { name: "1" } };
    export { map };
  `,
  "/Component.ts": `
    import { Props } from "types";
    function Component(props: Props) { return "ok"; } ;
    export { Component }
  `,
  "/test.ts": `
    import { map } from "/mapper";
    import { Component } from "/Component";

    Component(map().na)
  `,
};

const getSourceFile = (fileName, languageVersion, onError) => {
  if (files[fileName])
    return ts.createSourceFile(
      fileName,
      files[fileName],
      ts.ScriptTarget.Latest,
      true
    );
  // console.log(">>> " + fileName);
  // Carregar outros arquivos conforme necessário
  return ts.createSourceFile(fileName, "", ts.ScriptTarget.Latest, true);
};

function createCompilerHost() {
  return {
    // Implementar verificação de existência de arquivo, se necessário
    fileExists: (fileName) => {
      // console.log("fileExists", fileName);
      return true;
    },
    // Implementar leitura de arquivo. Você pode usar fetch aqui para ler arquivos.
    readFile: (fileName) => {
      if (fileName == "/node_modules/types.ts") return "types.ts";
      // console.log("readFile", fileName);
      return "...";
    },
    // Implementar verificação de existência de diretório, se necessário
    directoryExists: (directoryName) => {
      // console.log("directoryExists", directoryName);
      return true;
    },
    // Retornar o diretório atual. No navegador, isso pode ser um valor fixo ou baseado em sua aplicação.
    getCurrentDirectory: () => "/",
    getDirectories: (path) => [],
    getCanonicalFileName: (fileName) => {
      // console.log("getCanonicalFileName", fileName);
      return fileName;
    },
    useCaseSensitiveFileNames: () => true,
    getNewLine: () => "\n",
    getDefaultLibFileName: () => {
      return "/lib.d.ts";
    },
    getSourceFile,
    writeFile: (fileName, content) => {
      // console.log(">>", fileName, content);
    },
  };
}

describe("", () => {
  //
  it("AssignmentExpression", () => {
    //
    async function compileTypeScript() {
      //
      // Compilar o programa com o arquivo de entrada e as definições padrão
      const program = ts.createProgram(
        ["/test.ts"],
        options,
        createCompilerHost()
      );
      // const emitResult = program.emit();
      // Coletar e retornar os diagnósticos
      // const allDiagnostics = ts
      //   .getPreEmitDiagnostics(program)
      //   .concat(emitResult.diagnostics);
      // const errors = allDiagnostics.map((diag) => ({
      //   message: ts.flattenDiagnosticMessageText(diag.messageText, "\n"),
      //   line:
      //     diag.file && diag.start
      //       ? diag.file.getLineAndCharacterOfPosition(diag.start).line
      //       : 0,
      // }));
      // return errors;

      const languageService = ts.createLanguageService({
        getScriptFileNames: () => ["/test"],
        getScriptVersion: () => "1",
        getScriptSnapshot: () =>
          ts.ScriptSnapshot.fromString(files["/test.ts"]),
        getCurrentDirectory: () => "",
        getCompilationSettings: () => program.getCompilerOptions(),
        getDefaultLibFileName: (options) => ts.getDefaultLibFilePath(options),
        fileExists: ts.sys.fileExists,
        readFile: ts.sys.readFile,
        readDirectory: ts.sys.readDirectory,
      });

      // Usar o serviço de linguagem para obter as completions no ponto especificado
      const completions = languageService.getCompletionsAtPosition(
        "/test.ts",
        100,
        {
          allowIncompleteCompletions: true,
          useLabelDetailsInCompletionEntries: true,
        }
      );

      // console.log(">>", completions);
      // Transformar as completions em um formato útil/legível
      return completions ? completions.entries.map((entry) => entry.name) : [];
    }

    compileTypeScript().then((errors) => {
      if (errors.length > 0) {
        // errors.forEach((error) => {
        //   console.error(`Error at line ${error.line}: ${error.message}`);
        // });
      } else {
        console.log("TypeScript compiled successfully!");
      }
    });
  });
});
