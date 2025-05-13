import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Props for the Setup component
interface SetupProps {
  setTitle: (t: string) => void;              
  previousPlayers: string[];                  
  setCurrentPlayers: (players: string[]) => void; 
}


interface PlayerOption {
  name: string;
  checked: boolean;
}

export const Setup: React.FC<SetupProps> = ({ setTitle, previousPlayers, setCurrentPlayers }) => {

  useEffect(() => setTitle("Setup"), []);
  const nav = useNavigate(); // For navigation

  // State for all available players (existing and new)
  const [availablePlayers, setAvailablePlayers] = useState<PlayerOption[]>(
    previousPlayers.map(name => ({ name, checked: false}))
  );
  // State for the new player name input
  const [newPlayerName, setNewPlayerName] = useState("");

  // Number of players currently selected
  const chosenCount = availablePlayers.filter(p => p.checked).length;
  // Can start if exactly 2 players are selected
  const canStart = chosenCount >= 2 && chosenCount < 3;
  // Checks if the new player name is a duplicate
  const isDuplicate = availablePlayers.some(p => 
    p.name.toLowerCase() === newPlayerName.trim().toLowerCase());

  
  const addNewPlayer = () => {
    const trimmed = newPlayerName.trim();
    if (!trimmed || isDuplicate) return;
    setAvailablePlayers(prev => 
      [...prev, { name: trimmed, checked: true }].sort((a, b) => a.name.localeCompare(b.name))
    );
    setNewPlayerName("");
  };

  const startGame = () => {
    const selected = availablePlayers.filter(p => p.checked).map(p => p.name);
    const playerGuesses: Record<string, 'heads' | 'tails'> = {};
    
    // Randomly assign heads/tails if two players are selected
    if (selected.length === 2) {
      const [first, second] = selected.sort(() => Math.random() - 0.5);
      playerGuesses[first] = 'heads';
      playerGuesses[second] = 'tails';
    }

    setCurrentPlayers(selected);
    nav("/play", { state: { playerGuesses } });
  };

  // Clears all player selections (checkboxes)
  const cancelSelection = () => {
    setAvailablePlayers(prev => prev.map(p => ({ ...p, checked: false })));
  };

  // Navigates back to the home page
  const goHome = () => {
    nav("/");
  };

  return (
    <div className="space-y-4">
      {/* Start Game button */}
      <button
        className="btn btn-primary w-50%"
        disabled={!canStart}
        onClick={startGame}
      >
        {canStart ? "Start Game" : `Select 1-2 Players (${chosenCount}/2)`}
      </button>

      {/* Input for adding a new player */}
      <div className="flex gap-1">
        <input
          type="text"
          placeholder="New player name"
          className={`input flex-1 ${isDuplicate ? 'input-error' : ''}`}
          value={newPlayerName}
          onChange={e => setNewPlayerName(e.target.value)}
        />
        <button
          className="btn btn-outline"
          onClick={addNewPlayer}
          disabled={!newPlayerName.trim() || isDuplicate}
        >
          Add
        </button>
      </div>

      {/* List of available players with checkboxes */}
      <div className="grid grid-cols-2 gap-1">
        {availablePlayers.map(player => (
          <label key={player.name} className="label cursor-pointer bg-base-200 p-4 rounded-lg">
            <input
              type="checkbox"
              className="checkbox"
              checked={player.checked}
              onChange={() => setAvailablePlayers(prev => 
                prev.map(p => p.name === player.name ? {...p, checked: !p.checked} : p)
              )}
            />
            <span className="label-text ms-2">{player.name}</span>
          </label>
        ))}
      </div>
      {/* Cancel Selection and Back to Home buttons, side by side */}
      <div className="flex gap-2">
        <button
          className="btn btn-warning flex-1"
          onClick={cancelSelection}
        >
          Cancel Selection
        </button>
        <button
          className="btn btn-neutral flex-1"
          onClick={goHome}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};