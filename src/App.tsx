import React, {
  useState,
  useEffect,
  useCallback,
  ChangeEventHandler,
  TextareaHTMLAttributes,
} from 'react';
import './App.css';
import Editor from './editor';
import type * as monacoEditor from 'monaco-editor/esm/vs/editor/editor.api';

function App() {
  const defaultCode = `const person = {
    firstName: "John",
    lastName: "Doe",
    age: 50,
    eyeColor: "blue"
  };
  
  let id = Symbol('id');
  person.id = 140353;`;
  // Create the count state.
  const editorRef = React.useRef<monacoEditor.editor.IStandaloneCodeEditor>();
  const [value, setValue] = useState(defaultCode);
  const [textAreaUpdate, setTextAreaUpdate] = useState(
    'Write something here and click update ✍',
  );

  const modelChangedContent = useCallback(() => {
    //console.log('3->');
  }, []);

  const valueChanged = useCallback((v: string | undefined) => {
    //console.log('4->', v);
    v ? setValue(v) : {};
  }, []);

  const btClick = () => {
    setValue(textAreaUpdate);
  };

  const handleTextAreaUpdate = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextAreaUpdate(e.target.value);
  };
  // Return the App component.
  return (
    <>
      <Editor
        value={value}
        theme="vs-dark"
        height="50vh"
        language="javascript"
        modelChangedContent={modelChangedContent}
        valueChanged={valueChanged}
      />

      <br />
      <div style={{}}>
        <div style={{ width: '40%' }}>
          <button onClick={btClick}>Update 🔼</button>
          <textarea
            rows={10}
            defaultValue={textAreaUpdate}
            onChange={handleTextAreaUpdate}
            style={{ width: '100%' }}
          ></textarea>
        </div>
        <div style={{ width: '40%' }}>
          <span>Monitor</span>
          <textarea
            rows={10}
            value={value}
            readOnly={true}
            style={{ width: '100%' }}
          ></textarea>
        </div>
      </div>
    </>
  );
}

export default App;
