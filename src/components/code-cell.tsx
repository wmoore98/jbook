import { useState } from "react";
import bundle from "../bundler";
import CodeEditor from "./code-editor";
import Preview from "./preview";
import Resizable from "./resizable";

const CodeCell: React.FC = () => {
  const [code, setCode] = useState("");
  const [input, setInput] = useState("");

  const onClick = async () => {
    console.log("click...");
    const parsedCode = await bundle(input);
    setCode(parsedCode);
  };

  return (
    <Resizable direction='vertical'>
      <div style={{ height: "100%", display: "flex", flexDirection: "row" }}>
        <Resizable direction='horizontal'>
          <CodeEditor
            onChange={(value) => {
              setInput(value);
            }}
            initialValue='const a="hello"'
          />
        </Resizable>
        <Preview code={code} />
      </div>
    </Resizable>
  );
};

export default CodeCell;
