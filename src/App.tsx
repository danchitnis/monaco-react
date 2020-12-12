import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import { monaco } from '@monaco-editor/react';
import EditorNew from './editorNew';
import type * as monacoEditor from 'monaco-editor/esm/vs/editor/editor.api';

interface AppProps {}

function App({}: AppProps) {
  // Create the count state.
  const editorRef = React.useRef<monacoEditor.editor.IStandaloneCodeEditor>();

  // Create the counter (+1 every second).
  /*function handleEditorDidMount(
    getValue: () => string,
    editor: monacoEditor.editor.IStandaloneCodeEditor,
  ): string {
    return '';
  }*/

  const handleEditorDidMount = (): string => {
    return '';
  };
  // Return the App component.
  return (
    <>
      <EditorNew
        //value="loloello"
        theme="vs-dark"
        height="50vh"
        language="javascript"
        editorDidMount={handleEditorDidMount}
      />
    </>
  );
}

export default App;
