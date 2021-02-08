import * as esbuild from "esbuild-wasm";
import { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { unpkgPathPlugin, fetchPlugin } from "./plugins";

const App: React.FC = () => {
  const ref = useRef<any>();
  const iframe = useRef<any>();
  const [input, setInput] = useState("");

  const startService = async () => {
    ref.current = await esbuild.startService({
      worker: true,
      wasmURL: "http://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm",
    });
  };

  useEffect(() => {
    startService();
  }, []);

  const onClick = async () => {
    console.log("click...");
    if (!ref.current) {
      return;
    }

    iframe.current.srcdoc = html;

    const result = await ref.current.build({
      entryPoints: ["index.js"],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin(), fetchPlugin(input)],
      define: {
        "process.env.NODE_ENV": '"production"',
        global: "window",
      },
    });

    const parsedCode = result.outputFiles[0].text;
    iframe.current.contentWindow.postMessage(parsedCode, "*");
  };

  const html = `
    <html>
      <head></head>
      <body>
        <div id="root"></div>
        <script>
          window.addEventListener('message', (event) => {
            try {
              eval(event.data);
            } catch (err) {
              document.getElementById('root').innerHTML = \`<div style="color: red;"><h4>Runtime Error</h4>\${err}</div>\`;
              console.error(err);
            }
          }, false);
        </script>
      </body>
    </html>
  `;

  const cols = 60;
  const rows = 10;

  return (
    <div>
      <textarea
        onChange={(e) => setInput(e.target.value)}
        cols={cols}
        rows={rows}
        value={input}
      ></textarea>
      <div>
        <button onClick={onClick}>Submit</button>
      </div>
      <iframe
        title='frame1'
        ref={iframe}
        sandbox='allow-scripts'
        srcDoc={html}
      ></iframe>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
