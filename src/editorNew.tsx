import React, { useState, useEffect, useRef } from 'react';
import { monaco } from '@monaco-editor/react';
import type * as MonacoEditor from 'monaco-editor/esm/vs/editor/editor.api';

// https://www.gitmemory.com/issue/microsoft/monaco-editor/1423/530617327
interface MonarchLanguageConfiguration
  extends MonacoEditor.languages.IMonarchLanguage {
  keywords: string[];
}

type EditorType = {
  value?: string;
  language?: string;
  modelChangedContent?: (
    editorCode: MonacoEditor.editor.IStandaloneCodeEditor | undefined,
    changedText: MonacoEditor.editor.IModelContentChangedEvent,
  ) => void;
  valueChanged?: (value: string | undefined) => void;
  theme?: string;
  line?: number;
  width?: string;
  height?: string;
  options?: object;
};

const EditorNew = ({
  value,
  language,
  modelChangedContent: editorDidMount,
  valueChanged,
  theme,
  line,
  width,
  height,
  options,
}: EditorType) => {
  const [isMonacoReady, setIsMonacoReady] = useState(false);
  const [isEditorCodeMounted, setIsEditorCodeMounted] = useState(false);
  const editorCodeRef = useRef<MonacoEditor.editor.IStandaloneCodeEditor>();
  const editorRef = useRef<typeof MonacoEditor.editor>();
  const monacoRef = useRef<typeof MonacoEditor>();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const f = async () => {
      const monacoEditor = await monaco.init();
      monacoRef.current = monacoEditor;
      editorRef.current = monacoEditor.editor;

      monacoEditor.languages.register({ id: 'spice' });
      monacoEditor.languages.setMonarchTokensProvider('spice', {
        defaultToken: 'invalid',
        keywords: [
          'abstract',
          'continue',
          'for',
          'new',
          'switch',
          'assert',
          'goto',
          'do',
          'if',
          'private',
          'this',
          'break',
          'protected',
          'throw',
          'else',
          'public',
          'enum',
          'return',
          'catch',
          'try',
          'interface',
          'static',
          'class',
          'finally',
          'const',
          'super',
          'while',
          'true',
          'false',
        ],

        typeKeywords: [
          'boolean',
          'double',
          'byte',
          'int',
          'short',
          'char',
          'void',
          'long',
          'float',
        ],

        operators: [
          '=',
          '>',
          '<',
          '!',
          '~',
          '?',
          ':',
          '==',
          '<=',
          '>=',
          '!=',
          '&&',
          '||',
          '++',
          '--',
          '+',
          '-',
          '*',
          '/',
          '&',
          '|',
          '^',
          '%',
          '<<',
          '>>',
          '>>>',
          '+=',
          '-=',
          '*=',
          '/=',
          '&=',
          '|=',
          '^=',
          '%=',
          '<<=',
          '>>=',
          '>>>=',
        ],

        // we include these common regular expressions
        symbols: /[=><!~?:&|+\-*\/\^%]+/,

        // C# style strings
        escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,

        // The main tokenizer for our languages
        tokenizer: {
          root: [
            // identifiers and keywords
            [
              /[a-z_$][\w$]*/,
              {
                cases: {
                  '@typeKeywords': 'keyword',
                  '@keywords': 'keyword',
                  '@default': 'identifier',
                },
              },
            ],
            [/[A-Z][\w\$]*/, 'type.identifier'], // to show class names nicely

            // whitespace
            { include: '@whitespace' },

            // delimiters and operators
            [/[{}()\[\]]/, '@brackets'],
            [/[<>](?!@symbols)/, '@brackets'],
            [
              /@symbols/,
              { cases: { '@operators': 'operator', '@default': '' } },
            ],

            // @ annotations.
            // As an example, we emit a debugging log message on these tokens.
            // Note: message are supressed during the first load -- change some lines to see them.
            [
              /@\s*[a-zA-Z_\$][\w\$]*/,
              { token: 'annotation', log: 'annotation token: $0' },
            ],

            // numbers
            [/\d*\.\d+([eE][\-+]?\d+)?/, 'number.float'],
            [/0[xX][0-9a-fA-F]+/, 'number.hex'],
            [/\d+/, 'number'],

            // delimiter: after number because of .\d floats
            [/[;,.]/, 'delimiter'],

            // strings
            [/"([^"\\]|\\.)*$/, 'string.invalid'], // non-teminated string
            [/"/, { token: 'string.quote', bracket: '@open', next: '@string' }],

            // characters
            [/'[^\\']'/, 'string'],
            [/(')(@escapes)(')/, ['string', 'string.escape', 'string']],
            [/'/, 'string.invalid'],
          ],

          comment: [
            [/[^\/*]+/, 'comment'],
            [/\/\*/, 'comment', '@push'], // nested comment
            ['\\*/', 'comment', '@pop'],
            [/[\/*]/, 'comment'],
          ],

          string: [
            [/[^\\"]+/, 'string'],
            [/@escapes/, 'string.escape'],
            [/\\./, 'string.escape.invalid'],
            [/"/, { token: 'string.quote', bracket: '@close', next: '@pop' }],
          ],

          whitespace: [
            [/[ \t\r\n]+/, 'white'],
            [/\/\*/, 'comment', '@comment'],
            [/\/\/.*$/, 'comment'],
          ],
        },
      } as MonarchLanguageConfiguration);

      setIsMonacoReady(true);
    };
    f();
  }, []);

  useEffect(() => {
    if (monacoRef.current && containerRef.current) {
      editorCodeRef.current = monacoRef.current.editor.create(
        containerRef.current,
        {
          value:
            "// First line\nfunction hello() {\n\talert('Hello world!');\n}\n// Last line",
          language: 'javascript',
          roundedSelection: false,
          scrollBeyondLastLine: false,
          readOnly: false,
          theme: 'vs-dark',
          automaticLayout: true,
        },
      );

      setIsEditorCodeMounted(true);
    }
  }, [isMonacoReady, containerRef]);

  useEffect(() => {
    if (editorRef.current && editorCodeRef.current && isEditorCodeMounted) {
      console.log('🤩');

      console.log(editorCodeRef.current.getModel());
      const modelDefault = editorRef.current.createModel(
        'let a=0\n',
        language ? language : 'plaintext',
      );
      const model = editorCodeRef.current.getModel();
      editorRef.current.setModelLanguage(
        model ? model : modelDefault,
        language ? language : 'plaintext',
      );
      editorCodeRef.current.setValue(value ? value : 'hello!');
      editorCodeRef.current.onDidChangeModelContent(monacoEvent);
    }
  }, [isEditorCodeMounted, theme, language]);

  useEffect(() => {
    if (editorRef.current && editorCodeRef.current && isEditorCodeMounted) {
      //console.log('👌');
      ///////////otherwsie keeps refreshing and flickering///////////////?????? put and if with getValue == value

      const v = editorCodeRef.current.getValue();

      if (value != v && value) {
        editorCodeRef.current.setValue(value);
      }
    }
  }, [value]);

  const monacoEvent = (e: MonacoEditor.editor.IModelContentChangedEvent) => {
    const changedText = e;
    const editorCode = editorCodeRef.current;
    if (editorDidMount) {
      editorDidMount(editorCode, changedText);
    }
    if (valueChanged) {
      valueChanged(editorCode?.getValue());
    }
  };

  return (
    <div
      style={{
        display: 'block',
        height,
        width,
      }}
      ref={containerRef}
    ></div>
  );
};

export default EditorNew;
