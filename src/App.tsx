import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import Editor from '@monaco-editor/react';

interface AppProps {}

function App({}: AppProps) {
  // Create the count state.

  // Create the counter (+1 every second).

  // Return the App component.
  return (
    <div className="App">
      <Editor theme="vs-dark" height="90vh" language="javascript" />
    </div>
  );
}

export default App;
