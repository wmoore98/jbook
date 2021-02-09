import MonacoEditor from "@monaco-editor/react";

interface CodeEditorProps {
  initialValue?: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ initialValue = "" }) => (
  <MonacoEditor
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
);

export default CodeEditor;
