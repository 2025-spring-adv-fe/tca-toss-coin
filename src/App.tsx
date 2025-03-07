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
    winner: "Hermione",
    players: ["Hermione", "Harry", "Ron"],
  },
  {
    winner: "Ron",
    players: ["Hermione", "Ron"],
  },
  {
    winner: "Larry",
    players: ["Larry", "Curly", "Moe"],
  },
  {
    winner: "Harry",
    players: ["Curly", "Harry"],
  },
  {
    winner: "Ron",
    players: ["Ron", "Voldemort"],
  },
  {
    winner: "Voldemort",
    players: ["Ron", "Voldemort"],
  },
];

const App = () => {
  console.log("App component function called !!!");

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
