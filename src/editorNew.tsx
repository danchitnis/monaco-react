import React, { useState, useEffect, useRef } from 'react';
import { monaco } from '@monaco-editor/react';
import type * as MonacoEditor from 'monaco-editor/esm/vs/editor/editor.api';

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
