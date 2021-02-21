import MDEditor from "@uiw/react-md-editor";
import "bulmaswatch/superhero/bulmaswatch.min.css";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import TextEditor from "./components/text-editor";
import { store } from "./state";

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <TextEditor />
    </Provider>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
