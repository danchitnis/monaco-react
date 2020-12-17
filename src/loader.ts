/**
 * Monaco Loader
 * https://github.com/microsoft/monaco-editor-samples/blob/master/browser-amd-shared-model/index.html
 * https://github.com/suren-atoyan/monaco-react/blob/master/src/utils/monaco.js
 */
import type * as MonacoEditor from 'monaco-editor/esm/vs/editor/editor.api';

const loadMonaco = (): Promise<typeof MonacoEditor> => {
  return new Promise((resolve) => {
    const loaded2 = (e: CustomEvent) => {
      console.log('script2->', 'loaded', e.detail);
      resolve(e.detail);
    };

    document.addEventListener('jsEvent2', loaded2 as EventListener);

    const script3 = document.createElement('script') as HTMLScriptElement;
    //script3.async = true;
    //script3.src = 'https://cdnjs.cloudflare.com/ajax/libs/require.js/2.3.5/require.min.js';
    script3.async = true;
    script3.src =
      'https://cdn.jsdelivr.net/npm/monaco-editor@0.21.2/min/vs/loader.js';

    script3.crossOrigin = 'anonymous';
    const sload = () => {
      console.log('sload');
      document.body.appendChild(script2);
    };
    script3.addEventListener('load', sload);
    document.body.appendChild(script3);

    const script2 = document.createElement('script') as HTMLScriptElement;
    script2.async = true;
    //script2.type = 'module';
    script2.innerHTML = `
    require.config({"paths":{"vs":"https://cdn.jsdelivr.net/npm/monaco-editor@0.21.2/min/vs"}});
    require(['vs/editor/editor.main'], function() {
      document.dispatchEvent(new CustomEvent('jsEvent2', {detail: monaco}));
    });

    console.log("loaded");
    `;
  });
};

export default loadMonaco;
