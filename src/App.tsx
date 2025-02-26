import "./App.css";
import { HashRouter,Routes,Route } from "react-router";
import {Home} from './Home';
import { Setup } from "./setup";
import { Play } from "./play";
import { useState } from "react";
const App = () => {
  console.log("App component funct called !!!");
  const [totalGameCount,setTotalGameCount] = useState(0)
  return (
    <div className="p-4">
      <HashRouter>
        <Routes>
          <Route 
          path="/" element ={
          <Home 
          totalGameCount={totalGameCount}/>
        }
          />
          <Route 
          path="/Setup" element ={
          <Setup />
        }
          />
          <Route 
          path="/Play" element ={
          <Play />
        }
          />
        </Routes>
      </HashRouter>
     
    </div>
  );
}

export default App;
