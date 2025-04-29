// src/setup.tsx
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

export const Setup: React.FC<SetupProps> = ({
  setTitle,
  previousPlayers,
  setCurrentPlayers,
}) => {
  // set page title
  useEffect(() => {
    setTitle("Setup");
  }, [setTitle]);

  const nav = useNavigate();

  // build initial options from past players
  const [players, setPlayers] = useState<PlayerOption[]>(
    previousPlayers.map((name) => ({ name, checked: false }))
  );
  const [newName, setNewName] = useState("");

  const minPlayers = 2;
  const selectedCount = players.filter((p) => p.checked).length;
  const canStart = selectedCount >= minPlayers && selectedCount <= 7;
  const isDuplicate = players.some(
    (p) => p.name.toLowerCase() === newName.trim().toLowerCase()
  );

  const addPlayer = () => {
    const trimmed = newName.trim();
    if (!trimmed || isDuplicate) return;
    setPlayers((prev) =>
      [...prev, { name: trimmed, checked: true }].sort((a, b) =>
        a.name.localeCompare(b.name)
      )
    );
    setNewName("");
  };

  return (
    <div className="space-y-4">
      {/* Start button */}
      <button
        className="btn btn-primary w-full"
        disabled={!canStart}
        onClick={() => {
          setCurrentPlayers(players.filter((p) => p.checked).map((p) => p.name));
          nav("/play");
        }}
      >
        {canStart
          ? "Start Game"
          : `Select ${minPlayers - selectedCount} more player${
              minPlayers - selectedCount > 1 ? "s" : ""
            }`}
      </button>

      {/* Add-new form */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="New player name"
          className={`input flex-1 ${isDuplicate ? "input-error" : ""}`}
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <button
          className="btn btn-outline"
          onClick={addPlayer}
          disabled={!newName.trim() || isDuplicate}
        >
          Add
        </button>
      </div>

      {/* Player checkboxes */}
      <div className="grid grid-cols-2 gap-2">
        {players.map((player) => (
          <label
            key={player.name}
            className="label cursor-pointer bg-base-200 p-4 rounded-lg flex items-center"
          >
            <input
              type="checkbox"
              className="checkbox"
              checked={player.checked}
              onChange={() =>
                setPlayers((prev) =>
                  prev.map((p) =>
                    p.name === player.name
                      ? { ...p, checked: !p.checked }
                      : p
                  )
                )
              }
            />
            <span className="label-text ml-2">{player.name}</span>
          </label>
        ))}
      </div>
    </div>
  );
};
