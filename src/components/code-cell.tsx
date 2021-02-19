import { time } from "console";
import { useEffect, useState } from "react";
import bundle from "../bundler";
import CodeEditor from "./code-editor";
import Preview from "./preview";
import Resizable from "./resizable";

const CodeCell: React.FC = () => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [input, setInput] = useState("");

  useEffect(() => {
    const timer = setTimeout(async () => {
      const { code, error } = await bundle(input);
      setCode(code);
      setError(error);
    }, 1000);

    return () => clearTimeout(timer);
  }, [input]);

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
        <Preview code={code} error={error} />
      </div>
    </Resizable>
  );
};

export default CodeCell;
