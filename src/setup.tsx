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
  useEffect(() => setTitle("Setup Players"), []);
  const nav = useNavigate();
  const [players, setPlayers] = useState<PlayerOption[]>(
    previousPlayers.map(name => ({ name, checked: false }))
  );
  const [newName, setNewName] = useState("");

  const selectedCount = players.filter(p => p.checked).length;
  const canStart = selectedCount >= 2;
  const isDuplicate = players.some(p => p.name.toLowerCase() === newName.trim().toLowerCase());

  const startGame = () => {
    const selected = players.filter(p => p.checked).map(p => p.name);
    let guesses = {};
    
    if (selected.length === 2) {
      const [first, second] = selected.sort(() => Math.random() - 0.5);
      guesses = { [first]: 'heads', [second]: 'tails' };
    }

    setCurrentPlayers(selected);
    nav("/play", { state: { playerGuesses: guesses } });
  };

  const addPlayer = () => {
    const trimmed = newName.trim();
    if (!trimmed || isDuplicate) return;
    setPlayers(prev => [
      ...prev, 
      { name: trimmed, checked: true }
    ].sort((a, b) => a.name.localeCompare(b.name)));
    setNewName("");
  };

  return (
    <div className="space-y-6">
      <button
        className="btn btn-primary btn-lg w-full"
        disabled={!canStart}
        onClick={startGame}
      >
        {canStart ? "Start Game" : `Select ${2 - selectedCount} more`}
      </button>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="New player name"
          className={`input input-bordered flex-1 ${isDuplicate ? 'input-error' : ''}`}
          value={newName}
          onChange={e => setNewName(e.target.value)}
        />
        <button 
          className="btn btn-outline"
          onClick={addPlayer}
          disabled={!newName.trim() || isDuplicate}
        >
          Add
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {players.map(player => (
          <label key={player.name} className="label cursor-pointer bg-base-100 p-4 rounded-lg shadow">
            <input
              type="checkbox"
              className="checkbox checkbox-primary"
              checked={player.checked}
              onChange={() => setPlayers(prev => 
                prev.map(p => p.name === player.name ? {...p, checked: !p.checked} : p)
              )}
            />
            <span className="label-text ml-2">{player.name}</span>
          </label>
        ))}
      </div>
    </div>
  );
};