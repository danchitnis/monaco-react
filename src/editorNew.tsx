import React, { useState, useEffect, useRef, useCallback } from 'react';
import { monaco } from '@monaco-editor/react';
import type * as MonacoEditor from 'monaco-editor/esm/vs/editor/editor.api';

type EditorType = {
  value?: string;
  language?: string;
  editorDidMount?: (
    editorCode: MonacoEditor.editor.IStandaloneCodeEditor | undefined,
    changedText: MonacoEditor.editor.IModelContentChangedEvent,
  ) => void;
  valueChanged?: (value: string | undefined) => void;
  theme?: string;
  line?: number;
  width?: string;
  height?: string;
  options?: object;
  className?: string;
  wrapperClassName?: string;
  overrideServices?: object;
};

const EditorNew = ({
  value,
  language,
  editorDidMount,
  valueChanged,
  theme,
  line,
  width,
  height,
  options,
  overrideServices,
  className,
  wrapperClassName,
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
      console.log('👌');
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

  /*editorDidMount = useCallback(() => {
    const monacoEvent = (e: MonacoEditor.editor.IModelContentChangedEvent) => {
      console.log('1->', e.changes);
      console.log('2->', editorCodeRef.current?.getValue());
    };
  }, []);*/

  /*useEffect(() => {
    if (editorRef.current && isMonacoMounted) {
      editorRef.current.setTheme(theme ? theme : 'vs-dark');
      const model = editorRef.current.createModel(value ? value : 'hello!');
      editorRef.current.setModelLanguage(
        model,
        language ? language : 'plaintext',
      );
      console.log(value);
      console.log(editorRef.current.getValue());
    }
  }, [isMonacoMounted, theme, language, value]);*/

  /*useEffect(() => {
    editorRef.current.updateOptions(options);
  }, [isEditorReady, options]);*/

  /*useUpdate(
    () => {
      if (
        editorRef.current.getOption(
          monacoRef.current.editor.EditorOption.readOnly,
        )
      ) {
        editorRef.current.setValue(value);
      } else {
        if (value !== editorRef.current.getValue()) {
          editorRef.current.executeEdits('', [
            {
              range: editorRef.current.getModel().getFullModelRange(),
              text: value,
            },
          ]);

          if (_isControlledMode) {
            const model = editorRef.current.getModel();

            model.forceTokenization(model.getLineCount());
          }

          editorRef.current.pushUndoStop();
        }
      }
    },
    [value],
    isEditorReady,
  );*/

  /*useUpdate(
    () => {
      monacoRef.current.editor.setModelLanguage(
        editorRef.current.getModel(),
        language,
      );
    },
    [language],
    isEditorReady,
  );

  useUpdate(
    () => {
      editorRef.current.setScrollPosition({ scrollTop: line });
    },
    [line],
    isEditorReady,
  );

  useUpdate(
    () => {
      monacoRef.current.editor.setTheme(theme);
    },
    [theme],
    isEditorReady,
  );*/

  /*const createEditor = useCallback(() => {
    editorRef.current = monacoRef.current.editor.create(
      containerRef.current,
      {
        value,
        language,
        automaticLayout: true,
        ...options,
      },
      overrideServices,
    );

    editorDidMount(
      editorRef.current.getValue.bind(editorRef.current),
      editorRef.current,
    );

    monacoRef.current.editor.defineTheme('dark', themes['night-dark']);
    monacoRef.current.editor.setTheme(theme);

    setIsEditorReady(true);
  }, [editorDidMount, language, options, overrideServices, theme, value]);*/

  /*useEffect(() => {
    !isMonacoMounting && !isEditorReady && createEditor();
  }, [isMonacoMounting, isEditorReady, createEditor]);*/

  //const disposeEditor = () => editorRef.current.dispose();

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
