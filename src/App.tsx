import React, { useState, useEffect, useCallback } from 'react';
import logo from './logo.svg';
import './App.css';
import EditorNew from './editorNew';
import type * as monacoEditor from 'monaco-editor/esm/vs/editor/editor.api';

interface AppProps {}

function App({}: AppProps) {
  // Create the count state.
  const editorRef = React.useRef<monacoEditor.editor.IStandaloneCodeEditor>();
  const [value, setValue] = useState('Start...');

  // Create the counter (+1 every second).
  /*function handleEditorDidMount(
    getValue: () => string,
    editor: monacoEditor.editor.IStandaloneCodeEditor,
  ): string {
    return '';
  }*/

  const handleEditorDidMount = useCallback(() => {
    console.log('3->');
  }, []);

  const valueChanged = useCallback((v: string | undefined) => {
    console.log('4->', v);
    v ? setValue(v) : {};
  }, []);

  const btClick = () => {
    setValue(`let a=0;\nconsole.log(a);\n`);
  };
  // Return the App component.
  return (
    <>
      <EditorNew
        value={value}
        theme="vs-dark"
        height="50vh"
        language="javascript"
        editorDidMount={handleEditorDidMount}
        valueChanged={valueChanged}
      />
      <button onClick={btClick}>Click Me! 😉</button>
    </>
  );
}

export default App;
