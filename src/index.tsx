import MDEditor from "@uiw/react-md-editor";
import "bulmaswatch/superhero/bulmaswatch.min.css";
import ReactDOM from "react-dom";
import TextEditor from "./components/text-editor";

const App: React.FC = () => {
  return <TextEditor />;
};

ReactDOM.render(<App />, document.getElementById("root"));
