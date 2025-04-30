import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
  const nav = useNavigate();

  const [availablePlayers, setAvailablePlayers] = useState<PlayerOption[]>(
    previousPlayers.map(name => ({ name, checked: false }))
  );
  const [newPlayerName, setNewPlayerName] = useState("");

  const chosenCount = availablePlayers.filter(p => p.checked).length;
  const canStart = chosenCount >= 2 && chosenCount < 3;
  const isDuplicate = availablePlayers.some(p => p.name.toLowerCase() === newPlayerName.trim().toLowerCase());

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
    
    if (selected.length === 2) {
      const [first, second] = selected.sort(() => Math.random() - 0.5);
      playerGuesses[first] = 'heads';
      playerGuesses[second] = 'tails';
    }

    setCurrentPlayers(selected);
    nav("/play", { state: { playerGuesses } });
  };

  return (
    <div className="space-y-4">
      <button
        className="btn btn-primary w-full"
        disabled={!canStart}
        onClick={startGame}
      >
        {canStart ? "Start Game" : `Select 1-2 Players (${chosenCount}/2)`}
      </button>

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
    </div>
  );
};