import { useNavigate, useLocation } from "react-router";
import React, { useEffect, useState } from "react";
import { GameResult } from "./GameResults";

interface PlayProps {
  addNewGameResult: (r: GameResult) => void;
  setTitle: (t: string) => void;
  currentPlayers: string[];
}

export const Play: React.FC<PlayProps> = ({ addNewGameResult, setTitle, currentPlayers }) => {
  useEffect(() => setTitle("Play Game"), []);
  const nav = useNavigate();
  const location = useLocation();
  const [tossResult, setTossResult] = useState<'heads' | 'tails' | null>(null);
  const [turnCount, setTurnCount] = useState(1);
  const [playerGuesses] = useState<Record<string, 'heads' | 'tails'>>(
    location.state?.playerGuesses || {}
  );

  const handleToss = () => {
    const result = Math.random() < 0.5 ? 'heads' : 'tails';
    setTossResult(result);
    setTurnCount(prev => prev + 1);
  };

  const recordResult = (winner: string) => {
    addNewGameResult({
      winner,
      players: currentPlayers,
      start: new Date().toISOString(),
      end: new Date().toISOString(),
      turnCount,
      playerGuesses,
      tossResult: tossResult || 'heads'
    });
    nav(-2);
  };

  return (
    <div className="space-y-6">
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h2 className="card-title">Turn #{turnCount}</h2>
          
          {Object.entries(playerGuesses).map(([player, guess]) => (
            <div key={player} className="badge badge-outline">
              {player}: {guess.toUpperCase()}
            </div>
          ))}

          <button 
            className="btn btn-primary btn-lg"
            onClick={handleToss}
            disabled={!!tossResult}
          >
            {tossResult ? `Result: ${tossResult.toUpperCase()}` : "Flip Coin"}
          </button>

          {tossResult && (
            <div className="grid grid-cols-2 gap-2 mt-4">
              {currentPlayers.map(player => (
                <button
                  key={player}
                  className={`btn btn-lg ${playerGuesses[player] === tossResult ? 'btn-success' : 'btn-disabled'}`}
                  onClick={() => recordResult(player)}
                >
                  {player} Wins
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};