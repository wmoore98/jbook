import "bulmaswatch/superhero/bulmaswatch.min.css";
import { useState } from "react";
import ReactDOM from "react-dom";
import bundle from "./bundler";
import CodeEditor from "./components/code-editor";
import Preview from "./components/preview";

const App: React.FC = () => {
  const [code, setCode] = useState("");
  const [input, setInput] = useState("");

  const onClick = async () => {
    console.log("click...");
    const parsedCode = await bundle(input);
    setCode(parsedCode);
  };

  return (
    <div>
      <CodeEditor
        onChange={(value) => {
          setInput(value);
        }}
        initialValue='const a="hello"'
      />
      <div>
        <button onClick={onClick}>Submit</button>
      </div>
      <Preview code={code} />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
