import { useNavigate, useLocation } from "react-router";
import React, { useEffect, useState } from "react";
import { GameResult } from "./GameResults";

// Props for the Play component
interface PlayProps {
  addNewGameResult: (r: GameResult) => void; // Function to add a new game result
  setTitle: (t: string) => void; // Function to set the page title
  currentPlayers: string[]; // Array of current player names
}

// Main Play component for the coin toss game
export const Play: React.FC<PlayProps> = ({
  addNewGameResult,
  setTitle,
  currentPlayers,
}) => {
  // Set the page title to "Play" on mount
  useEffect(() => setTitle("Play"), []);
  const nav = useNavigate(); // For navigation
  const location = useLocation(); // For accessing navigation state

  // State for the result of the coin toss: 'heads', 'tails', or null if not tossed yet
  const [tossResult, setTossResult] = useState<"heads" | "tails" | null>(null);

  // State for player guesses, loaded from navigation state if available
  const [playerGuesses] = useState<Record<string, "heads" | "tails">>(
    location.state?.playerGuesses || {}
  );

  // Handles the coin toss, randomly sets tossResult to 'heads' or 'tails'
  const handleToss = () => {
    setTossResult(Math.random() < 0.5 ? "heads" : "tails");
  };

  return (
    <div className="space-y-4">
      {/* Coin Toss Card */}
      <div className="card bg-base-200">
        <div className="card-body">
          <h2 className="card-title">Coin Toss</h2>
          {/* Show the result in a large badge if flipped */}
          {tossResult && (
            <div className="flex justify-center my-4">
              <span
                className={`badge badge-lg text-2xl px-8 py-4 ${
                  tossResult === "heads" ? "badge-success" : "badge-info"
                }`}
              >
                {tossResult.toUpperCase()}
              </span>
            </div>
          )}
          {/* Button to flip the coin */}
          <button
            className="btn btn-primary w-full"
            onClick={handleToss}
            disabled={!!tossResult} // Disable after flipping
          >
            {tossResult ? "Flipped!" : "Flip Coin"}
          </button>
        </div>
      </div>
      {/* Guesses Card (shows each player's guess) */}
      {Object.keys(playerGuesses).length > 0 && (
        <div className="card bg-base-200">
          <div className="card-body">
            <h2 className="card-title">Guesses</h2>
            <div className="space-y-2">
              {Object.entries(playerGuesses).map(([player, guess]) => (
                <div key={player} className="flex justify-between items-center">
                  <span>{player}</span>
                  <span className="badge badge-outline">
                    {guess.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {/* “Player Wins” Buttons: lets you select the winner */}
      <div className="grid grid-cols-2 gap-2">
        {currentPlayers.map((player) => (
          <button
            key={player}
            className="btn btn-secondary h-24 text-lg"
            // When clicked, saves the game result and navigates home
            onClick={() => {
              addNewGameResult({
                winner: player,
                players: currentPlayers,
                start: new Date().toISOString(),
                end: new Date().toISOString(),
                turnCount: 1,
                playerGuesses,
                tossResult: tossResult || "heads",
              });
              nav("/"); // Go to home after saving result
            }}
            // Only enabled if the toss has happened and the player's guess matches the result
            disabled={!tossResult || playerGuesses[player] !== tossResult}
          >
            {player} Wins
          </button>
        ))}
      </div>
    </div>
  );
};
