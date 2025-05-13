import "./App.css";
import { HashRouter, Routes, Route } from "react-router-dom";
import { AppTitle, Home } from "./Home";
import { Setup } from "./setup";
import { Play } from "./play";
import { useEffect, useState, useRef } from "react";
import { GameResult, getGeneralFacts, getLeaderboard, getPreviousPlayers, getGamesByMonth } from "./GameResults";
import localforage from "localforage";
import { SunIcon, MoonIcon } from "@heroicons/react/24/solid";
import { saveGameToCloud, loadGamesFromCloud } from "./tca_cloud-api";

// Dummy data for first-time users or if no saved games exist
const dummyGameResults: GameResult[] = [
  {
    winner: "Hermione",
    players: ["Hermione", "Harry"],
    start: "2025-03-01T18:20:41.576Z",
    end: "2025-03-01T18:35:42.576Z",
    turnCount: 1,
    playerGuesses: { "Hermione": "heads", "Harry": "tails" },
    tossResult: "heads"
  }
];

const App: React.FC = () => {
  // Reference to the email modal dialog
  const emailModalRef = useRef<HTMLDialogElement | null>(null);

  // State for all game results
  const [gameResults, setGameResults] = useState<GameResult[]>([]);
  // State for the page title
  const [title, setTitle] = useState<string>(AppTitle);
  // State for currently selected players
  const [currentPlayers, setCurrentPlayers] = useState<string[]>([]);
  // State for dark mode toggle
  const [darkmode, setDarkMode] = useState(false);
  // State for the user's email (for cloud sync)
  const [email, setEmail] = useState("");

  // Load saved settings (dark mode and email) from localforage on mount
  useEffect(() => {
    let ignore = false;
    (async () => {
      const [savedDarkMode, savedEmail] = await Promise.all([
        localforage.getItem<boolean>("darkmode"),
        localforage.getItem<string>("email")
      ]);
      if (!ignore) {
        setDarkMode(Boolean(savedDarkMode));
        setEmail(savedEmail || "");
      }
    })();
    return () => { ignore = true; };
  }, []);

  // Load game results from storage on mount (or use dummy data if none)
  useEffect(() => {
    localforage.getItem<GameResult[]>("gameResults").then(saved => {
      if (saved && saved.length > 0) {
        setGameResults(saved);
      } else {
        setGameResults(dummyGameResults); 
      }
    });
  }, []);

  // Save game results to storage whenever gameResults changes
  useEffect(() => {
    if (gameResults.length > 0) {
      localforage.setItem("gameResults", gameResults);
    }
  }, [gameResults]);

  // Sync with cloud when email changes
  useEffect(() => {
    let ignore = false;
    const loadGames = async () => {
      if (email) {
        const cloudResults = await loadGamesFromCloud(email, "tca-toss-coin");
        if (!ignore && cloudResults) setGameResults(cloudResults);
      }
    };
    loadGames();
    return () => { ignore = true; };
  }, [email]);

  // Adds a new game result to state and saves to cloud if email is set
  const addNewGameResult = (newGameResult: GameResult) => {
    setGameResults(prev => [...prev, newGameResult]);
  
    if (email) saveGameToCloud(email, "tca-toss-coin", newGameResult.end, newGameResult);
  };

  return (
    <div className="min-h-screen p-0 overflow-x-hidden" data-theme={darkmode ? "dark" : "light"}>
      {/* Navbar with title, cloud/email button, and dark mode toggle */}
      <div className="navbar bg-base-300 shadow-lg px-4">
        <h1 className="text-xl font-bold flex-1">{title}</h1>
        <div className="flex items-center gap-2">
          {/* Button to open email modal for cloud sync */}
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => emailModalRef.current?.showModal()}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </button>
          {/* Dark mode toggle */}
          <label className="swap swap-rotate">
            <input
              type="checkbox"
              checked={darkmode}
              onChange={async (e) => {
                const checked = e.target.checked;
                setDarkMode(checked);
                await localforage.setItem("darkmode", checked);
              }}
            />
            <SunIcon className="swap-on w-5 h-5" />
            <MoonIcon className="swap-off w-5 h-5" />
          </label>
        </div>
      </div>

      {/* Modal for entering email for cloud sync */}
      <dialog ref={emailModalRef} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Cloud Sync</h3>
          <div className="py-4">
            <input
              type="email"
              placeholder="Enter email for cloud save"
              className="input input-bordered w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="modal-action">
            <button 
              className="btn"
              onClick={async () => {
                await localforage.setItem("email", email);
                emailModalRef.current?.close();
              }}
            >
              Save 
            </button>
          </div>
        </div>
      </dialog>

      {/* Main app content and routing */}
      <div className="p-4">
        <HashRouter>
          <Routes>
            {/* Home page: shows stats and leaderboard */}
            <Route path="/" element={
              <Home
                leaderboardData={getLeaderboard(gameResults)}
                setTitle={setTitle}
                generalFacts={getGeneralFacts(gameResults)}
                gamesByMonthData={getGamesByMonth(gameResults)}
              />
            }/>
            {/* Setup page: select players */}
            <Route path="/setup" element={
              <Setup
                setTitle={setTitle}
                previousPlayers={getPreviousPlayers(gameResults)}
                setCurrentPlayers={setCurrentPlayers}
              />
            }/>
            {/* Play page: play a game */}
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