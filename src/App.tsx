import "./App.css";
import { HashRouter, Routes, Route } from "react-router-dom";
import { AppTitle, Home } from "./Home";
import { Setup } from "./setup";
import { Play } from "./play";
import { useEffect, useState, useRef } from "react";
import { GameResult, getGeneralFacts, getLeaderboard, getPreviousPlayers, getGamesByMonth } from "./GameResults";
import localforage from "localforage";
import './index.css';
import { saveGameToCloud, loadGamesFromCloud } from './tca-cloud-api';
import { copyTextToClipboard } from "./utils";

const dummyGameResults: GameResult[] = [
  {
    winner: "Hermione",
    players: ["Hermione", "Harry"],
    start: "2025-03-01T18:20:41.576Z",
    end: "2025-03-01T18:35:42.576Z",
    turnCount: 15,
    pennyTossed: false,
    tosses: ['heads', 'tails', 'heads'],
    headsCount: 2,
    tailsCount: 1
  }
];

const App: React.FC = () => {
  const emailModalRef = useRef<HTMLDialogElement>(null);
  const [gameResults, setGameResults] = useState<GameResult[]>(dummyGameResults);
  const [title, setTitle] = useState(AppTitle);
  const [currentPlayers, setCurrentPlayers] = useState<string[]>([]);
  const [darkMode, setDarkMode] = useState(false);
  const [emailOnModal, setEmailOnModal] = useState("");
  const [emailForCloudApi, setEmailForCloudApi] = useState("");

  useEffect(() => {
    let ignore = false;
    (async () => {
      const savedDarkMode = await localforage.getItem("darkmode");
      if (!ignore) setDarkMode(Boolean(savedDarkMode));
    })();
    return () => { ignore = true; };
  }, []);

  useEffect(() => {
    let ignore = false;
    const loadGames = async () => {
      if (emailForCloudApi) {
        const cloudResults = await loadGamesFromCloud(emailForCloudApi, "tca-toss-coin-25s");
        if (!ignore && cloudResults) setGameResults(cloudResults);
      }
    };
    loadGames();
    return () => { ignore = true; };
  }, [emailForCloudApi]);

  const addNewGameResult = async (result: GameResult) => {
    copyTextToClipboard(JSON.stringify(result));
    if (emailForCloudApi) {
      await saveGameToCloud(emailForCloudApi, "tca-toss-coin-25s", result.end, result);
    }
    setGameResults(prev => [...prev, result]);
  };

  return (
    <div className="min-h-screen p-0 overflow-x-hidden" data-theme={darkMode ? "dark" : "light"}>
      {/* Navigation and Modal */}
      <div className="flex shadow-lg navbar bg-base-300">
        <h1 className="text-xl font-bold">{title}</h1>
        {/* Dark mode toggle and email button */}
      </div>

      <dialog ref={emailModalRef} className="modal">
        {/* Email input modal */}
      </dialog>

      <div className="p-4">
        <HashRouter>
          <Routes>
            <Route path="/" element={
              <Home
                leaderboardData={getLeaderboard(gameResults)}
                setTitle={setTitle}
                generalFacts={getGeneralFacts(gameResults)}
                gamesByMonthData={getGamesByMonth(gameResults)}
                gameDurationData={undefined}
              />
            }/>
            <Route path="/setup" element={
              <Setup
                setTitle={setTitle}
                previousPlayers={getPreviousPlayers(gameResults)}
                setCurrentPlayers={setCurrentPlayers}
              />
            }/>
            <Route path="/play" element={
              <Play
                addNewGameResult={addNewGameResult}
                setTitle={setTitle}
                currentPlayers={currentPlayers}
              />
            }/>
          </Routes>
        </HashRouter>
      </div>
    </div>
  );
};

export default App;