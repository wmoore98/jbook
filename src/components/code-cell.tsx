import { useState } from "react";
import bundle from "../bundler";
import CodeEditor from "./code-editor";
import Preview from "./preview";

const CodeCell: React.FC = () => {
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

export default CodeCell;
