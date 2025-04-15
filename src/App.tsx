// src/App.tsx
import "./App.css";
import { HashRouter, Routes, Route } from "react-router-dom";
import { AppTitle, Home } from "./Home";
import { Setup } from "./setup";
import { Play } from "./play";
import { useEffect, useState } from "react";
import {
  GameResult,
  getGeneralFacts,
  getLeaderboard,
  getPreviousPlayers,
  getGamesByMonth,
} from "./GameResults";
import localforage from "localforage";
import { SunIcon, MoonIcon } from "@heroicons/react/24/solid";

const App: React.FC = () => {
  const [gameResults, setGameResults] = useState<GameResult[]>([]);
  const [title, setTitle] = useState<string>(AppTitle);
  const [currentPlayers, setCurrentPlayers] = useState<string[]>([]);
  const [darkmode, setDarkMode] = useState<boolean>(false);

  // load dark mode from storage
  useEffect(() => {
    let ignore = false;
    (async () => {
      const saved = (await localforage.getItem("darkmode")) ?? false;
      if (!ignore) setDarkMode(Boolean(saved));
    })();
    return () => { ignore = true; };
  }, []);

  const addNewGameResult = (r: GameResult) =>
    setGameResults(prev => [...prev, r]);

  return (
    <div
      className="p-0 overflow-x-hidden min-h-screen"
      data-theme={darkmode ? "dark" : "light"}
    >
      <div className="navbar bg-base-300 shadow-lg flex flex-col">
        <h1 className="text-xl font-bold">{title}</h1>
        <label className="swap swap-rotate ml-auto">
          <input
            type="checkbox"
            checked={darkmode}
            onChange={async () => {
              const next = !darkmode;
              await localforage.setItem("darkmode", next);
              setDarkMode(next);
            }}
          />
          <SunIcon className="swap-on h-8 w-8" />
          <MoonIcon className="swap-off h-8 w-8" />
        </label>
      </div>

      <div className="p-4">
        <HashRouter>
          <Routes>
            <Route
              path="/"
              element={
                <Home
                  leaderboardData={getLeaderboard(gameResults)}
                  setTitle={setTitle}
                  generalFacts={getGeneralFacts(gameResults)}
                  gamesByMonthData={getGamesByMonth(gameResults)}
                />
              }
            />
            <Route
              path="/setup"
              element={
                <Setup
                  setTitle={setTitle}
                  previousPlayers={getPreviousPlayers(gameResults)}
                  setCurrentPlayers={setCurrentPlayers}
                />
              }
            />
            <Route
              path="/play"
              element={
                <Play
                  addNewGameResult={addNewGameResult}
                  setTitle={setTitle}
                  currentPlayers={currentPlayers}
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
