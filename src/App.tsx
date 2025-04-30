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

const App: React.FC = () => {
  const emailModalRef = useRef<HTMLDialogElement>(null);
  const [gameResults, setGameResults] = useState<GameResult[]>([]);
  const [title, setTitle] = useState(AppTitle);
  const [currentPlayers, setCurrentPlayers] = useState<string[]>([]);
  const [darkMode, setDarkMode] = useState(false);
  const [emailOnModal, setEmailOnModal] = useState("");
  const [emailForCloudApi, setEmailForCloudApi] = useState("");

  useEffect(() => {
    let ignore = false;
    (async () => {
      const saved = await localforage.getItem("darkmode");
      if (!ignore) setDarkMode(Boolean(saved));
    })();
    return () => { ignore = true; };
  }, []);

  useEffect(() => {
    let ignore = false;
    const loadGames = async () => {
      if (emailForCloudApi) {
        const cloudResults = await loadGamesFromCloud(emailForCloudApi, "tca-toss-coin");
        if (!ignore) setGameResults(cloudResults);
      }
    };
    loadGames();
    return () => { ignore = true; };
  }, [emailForCloudApi]);

  const addNewGameResult = async (result: GameResult) => {
    copyTextToClipboard(JSON.stringify(result));
    if (emailForCloudApi) {
      await saveGameToCloud(emailForCloudApi, "tca-toss-coin", result.end, result);
    }
    setGameResults(prev => [...prev, result]);
  };

  return (
    <div className="min-h-screen flex flex-col" data-theme={darkMode ? "dark" : "light"}>
      <header className="navbar bg-base-300 shadow-lg">
        <h1 className="text-xl font-bold flex-1">{title}</h1>
        <button 
          className="btn btn-ghost"
          onClick={() => emailModalRef.current?.showModal()}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </button>
      </header>

      <dialog ref={emailModalRef} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Cloud Sync</h3>
          <div className="py-4">
            <input
              type="email"
              placeholder="your@email.com"
              className="input input-bordered w-full"
              value={emailOnModal}
              onChange={e => setEmailOnModal(e.target.value)}
            />
          </div>
          <div className="modal-action">
            <button
              className="btn btn-primary"
              onClick={() => {
                setEmailForCloudApi(emailOnModal.trim().toLowerCase());
                emailModalRef.current?.close();
              }}
            >
              Save
            </button>
          </div>
        </div>
      </dialog>

      <main className="flex-1 p-4">
        <HashRouter>
          <Routes>
            <Route path="/" element={
              <Home
                leaderboardData={getLeaderboard(gameResults)}
                setTitle={setTitle}
                generalFacts={getGeneralFacts(gameResults)}
                gamesByMonthData={getGamesByMonth(gameResults)}
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
      </main>
    </div>
  );
};

export default App;