import MonacoEditor, { EditorDidMount } from "@monaco-editor/react";
import prettier from "prettier";
import parser from "prettier/parser-babel";
import { useRef } from "react";

interface CodeEditorProps {
  onChange(value: string): void;
  initialValue?: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  onChange,
  initialValue = "",
}) => {
  const editorRef = useRef<any>();

  const onEditorDidMount: EditorDidMount = (getEditorValue, editor) => {
    editorRef.current = editor;
    editor.onDidChangeModelContent(() => {
      onChange(getEditorValue());
    });

    editor.getModel()?.updateOptions({ tabSize: 2 });
  };

  const onClickFormat = () => {
    const unformatted = editorRef.current.getModel().getValue();
    const formatted = prettier.format(unformatted, {
      parser: "babel",
      plugins: [parser],
      useTabs: false,
      semi: true,
      // singleQuote: true,
    });
    editorRef.current.setValue(formatted);
  };

  return (
    <div>
      <button onClick={onClickFormat}>Format</button>
      <MonacoEditor
        editorDidMount={onEditorDidMount}
        value={initialValue}
        language='javascript'
        theme='dark'
        height='16rem'
        options={{
          wordWrap: "on",
          minimap: { enabled: false },
          showUnused: false,
          folding: false,
          lineNumbersMinChars: 3,
          fontSize: 16,
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
      />
    </div>
  );
};

export default CodeEditor;
