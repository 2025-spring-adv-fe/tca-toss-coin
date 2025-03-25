import "./App.css";
import { HashRouter, Routes, Route } from "react-router";
import { AppTitle,Home } from "./Home";
import { Setup } from "./setup";
import { Play } from "./play";
import { useState } from "react";
import { GameResult, getLeaderboard } from "./GameResults";

//const dummyGameResults: Array<GameResult> = [
  const dummyGameResults: GameResult[] = [
    {
        winner: "Hermione"
        , players: [
            "Hermione"
            , "Harry"
            , "Ron"
        ]
        , start: "2025-03-01T18:20:41.576Z"
        , end: "2025-03-01T18:35:42.576Z"        
    }
    , {
        winner: "Ron"
        , players: [
            "Hermione"
            , "Ron"
        ]
        , start: "2025-03-05T18:40:27.576Z"
        , end: "2025-03-05T18:45:42.576Z"        
    }
];

const App = () => {
  //
  //hooks
  //

  const [gameResults, setGameResults] =
    useState<GameResult[]>(dummyGameResults);
  //const [gameResults,setGameResults] = useState<GameResult[]>([]);

  const [title, setTitle] = useState(AppTitle);

  //
  //other not hooks...............
  //

  const addNewGameResult = (newGameResult: GameResult) =>
    setGameResults([...gameResults, newGameResult]);

  return (
    <div 
      className="p-0"
      >
      <div
        className="navbar bg-base-300 shadow-lg"
        >
          <h1 className="text-xl font-bond">
            {title}
            </h1>
        </div>
        <div className="p-4"
        >
           <HashRouter>
        <Routes>
          <Route
            path="/"
            element={
              <Home
                leaderboardData={
                  getLeaderboard(gameResults)
                }
                setTitle={setTitle}
              />
            }
          />
          <Route
            path="/setup"
            element={<Setup
              setTitle={setTitle}
              />
              }
          />
          <Route
            path="/play"
            element={
              <Play
                addNewGameResult={addNewGameResult}
                setTitle={setTitle}
              />
            }
          />
        </Routes>
      </HashRouter>
        </div>
    </div>
  );
};

export default App;
