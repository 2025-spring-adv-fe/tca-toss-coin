import { useNavigate, useLocation } from "react-router";
import React, { useEffect, useState } from "react";
import { GameResult } from "./GameResults";

interface PlayProps {
  addNewGameResult: (r: GameResult) => void;
  setTitle: (t: string) => void;
  currentPlayers: string[];
}

export const Play: React.FC<PlayProps> = ({ addNewGameResult, setTitle, currentPlayers }) => {
  useEffect(() => setTitle("Play"), []);
  const nav = useNavigate();
  const location = useLocation();
  const [tossResult, setTossResult] = useState<'heads' | 'tails' | null>(null);
  const [playerGuesses] = useState<Record<string, 'heads' | 'tails'>>(location.state?.playerGuesses || {});

  const handleToss = () => {
    setTossResult(Math.random() < 0.5 ? 'heads' : 'tails');
  };

  return (
    <div className="space-y-4">
      <div className="card bg-base-200">
        <div className="card-body">
          <h2 className="card-title">Coin Toss</h2>
          <button 
            className="btn btn-primary w-full"
            onClick={handleToss}
            disabled={!!tossResult}
          >
            {tossResult ? `Result: ${tossResult.toUpperCase()}` : "Flip Coin"}
          </button>
        </div>
      </div>

      {Object.keys(playerGuesses).length > 0 && (
        <div className="card bg-base-200">
          <div className="card-body">
            <h2 className="card-title">Guesses</h2>
            <div className="space-y-2">
              {Object.entries(playerGuesses).map(([player, guess]) => (
                <div key={player} className="flex justify-between items-center">
                  <span>{player}</span>
                  <span className="badge badge-outline">{guess.toUpperCase()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-2">
        {currentPlayers.map(player => (
          <button
            key={player}
            className="btn btn-secondary h-24 text-lg"
            onClick={() => {
              addNewGameResult({
                winner: player,
                players: currentPlayers,
                start: new Date().toISOString(),
                end: new Date().toISOString(),
                turnCount: 1,
                playerGuesses,
                tossResult: tossResult || 'heads'
              });
              nav(-2);
            }}
            disabled={!tossResult || playerGuesses[player] !== tossResult}
          >
            {player} Wins
          </button>
        ))}
      </div>
    </div>
  );
};