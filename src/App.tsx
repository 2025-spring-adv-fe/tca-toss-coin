// src/App.tsx
import "./App.css";
import { HashRouter, Routes, Route } from "react-router-dom";
import { AppTitle, Home } from "./Home";
import { Setup } from "./setup";
import { Play } from "./play";
import { useEffect,useState,useRef } from "react";
import {
  GameResult,
  getGeneralFacts,
  getLeaderboard,
  getPreviousPlayers,
  getGamesByMonth,
} from "./GameResults";
import localforage from "localforage";
import { SunIcon, MoonIcon } from "@heroicons/react/24/solid";

// Use dummy data so Setup has something to show by default
const dummyGameResults: GameResult[] = [
  {
    winner: "Hermione",
    players: ["Hermione", "Harry", "Ron"],
    start: "2025-03-01T18:20:41.576Z",
    end:   "2025-03-01T18:35:42.576Z",
    turnCount: 15,
    pennyTossed: false,
  },
  {
    winner: "Ron",
    players: ["Hermione", "Ron"],
    start: "2025-03-05T18:40:27.576Z",
    end:   "2025-03-05T18:45:42.576Z",
    turnCount: 10,
    pennyTossed: false,
  },
];

const App: React.FC = () => {

//
//hooks
//
//my order pref is ... ref hooks,  state hooks, effect hooks
//
const emailModalRef = useRef<HTMLDialogElement | null>(null);


  // ← seed with dummyGameResults
  const [gameResults, setGameResults] = useState<GameResult[]>(dummyGameResults);
  const [title, setTitle] = useState<string>(AppTitle);
  const [currentPlayers, setCurrentPlayers] = useState<string[]>([]);
  const [darkmode, setDarkMode] = useState(false);
  const [emailOnModal,setEmailOnModal] = useState("");

  // load dark mode
  useEffect(() => {
    let ignore = false;
    (async () => {
      const saved = (await localforage.getItem("darkmode")) ?? false;
      if (!ignore) setDarkMode(Boolean(saved));
    })();
    return () => { ignore = true; };
  }, []);

  useEffect(() => {

    const loadEmail = async () => {

      const savedEmail = (await localforage.getItem<string>("email")) ?? "";
      if (!ignore) {
         setEmailOnModal(savedEmail);
    }
  };
  let ignore =false;
  loadEmail();
  //bread on bottom
    return () => { ignore = true; };
  }, []);


  const addNewGameResult = (r: GameResult) =>
    setGameResults(prev => [...prev, r]);

  return (
    <div
      className="p-0 overflow-x-hidden min-h-screen"
      data-theme={darkmode ? "dark" : "light"}
    >
      <div 
      className="navbar bg-base-300 shadow-lg flex flex-col"
      >
        <h1 
        className="text-xl font-bold"
        >
          {title}
        </h1>
        <div className="flex gap-1 ml-auto"
        >
          {
           AppTitle === title && (
            <button className="btn btn-ghost"
            onClick={
              () => emailModalRef.current?.showModal()
            } 
            
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg>
            </button>

           )
          }

          <button className="btn"
          onClick={
            () => emailModalRef.current?.showModal()
          } 
          
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" 
              
              />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
          </button>
          <label className="swap swap-rotate">
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
      </div>
          <dialog 
          ref={emailModalRef}
            className="modal modal-bottom sm:modal-middle"
          >
            <div 
            className="modal-box"
            >
            <h3
              className="font-bold text-lg">
                Enter email to load & save games.... 
            </h3>
            <p 
            className="py-4"
            >
              
              <input
                type="text"
                placeholder="Enter email address ..."
                className="input"
                value={emailOnModal}
                onChange={(e) => setEmailOnModal(e.target.value)}
              />

            </p>
              <div 
              className="modal-action"
              >
                <form
                 method="dialog"
                 >
                {/* if there is a button in form, it will close the modal */}
               <button 
                className="btn"
                onClick={
                  async () => await localforage.setItem(
                    "email"
                    , emailOnModal
                  )
                }
               >
                Save
              </button>
                </form>
              </div>
              </div>
          </dialog>

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
                  gamesByMonthData={getGamesByMonth(gameResults)} gameDurationData={undefined}                />
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
