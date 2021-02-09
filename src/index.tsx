import "bulmaswatch/superhero/bulmaswatch.min.css";
import ReactDOM from "react-dom";
import CodeCell from "./components/code-cell";

const App: React.FC = () => {
  return (
    <div>
      <CodeCell />
      <CodeCell />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
