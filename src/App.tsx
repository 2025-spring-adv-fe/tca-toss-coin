import "./App.css";
import { HashRouter,Routes,Route } from "react-router";
import {Home} from './Home';
import { Setup } from "./setup";
import { Play } from "./play";
const App = () => {
  console.log("App component funct called !!!");
  return (
    <div className="p-4">
      <HashRouter>
        <Routes>
          <Route path="/" element ={<Home />}
          />
          <Route path="/Setup" element ={<Setup />}
          />
          <Route path="/Play" element ={<Play />}
          />
        </Routes>
      </HashRouter>
     
    </div>
  );
}

export default App;
