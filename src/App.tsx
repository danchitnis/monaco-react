import React, { useState, useEffect, useCallback } from 'react';
import logo from './logo.svg';
import './App.css';
import EditorNew from './editorNew';
import type * as monacoEditor from 'monaco-editor/esm/vs/editor/editor.api';

function App() {
  // Create the count state.
  const editorRef = React.useRef<monacoEditor.editor.IStandaloneCodeEditor>();
  const [value, setValue] = useState('Start...');

  const modelChagedContent = useCallback(() => {
    //console.log('3->');
  }, []);

  const valueChanged = useCallback((v: string | undefined) => {
    //console.log('4->', v);
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
        modelChagedContent={modelChagedContent}
        valueChanged={valueChanged}
      />
      <button onClick={btClick}>Click Me! 😉</button>
      <br />
      <textarea rows={10} value={value}></textarea>
    </>
  );
}

export default App;
