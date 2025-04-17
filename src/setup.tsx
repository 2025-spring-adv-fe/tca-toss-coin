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
  useEffect(() => {
    setTitle("Setup");
  }, [setTitle]);

  const nav = useNavigate();

  const [availablePlayers, setAvailablePlayers] = useState<PlayerOption[]>(
    previousPlayers.map((name) => ({ name, checked: false }))
  );
  const [newPlayerName, setNewPlayerName] = useState("");

  const chosenCount = availablePlayers.filter((p) => p.checked).length;
  const canStart = chosenCount >= 2 && chosenCount <= 7;
  const isDuplicate = availablePlayers.some(
    (p) => p.name.toLowerCase() === newPlayerName.trim().toLowerCase()
  );

  const addNewPlayer = () => {
    const trimmed = newPlayerName.trim();
    if (!trimmed || isDuplicate) return;
    setAvailablePlayers((prev) =>
      [...prev, { name: trimmed, checked: true }].sort((a, b) =>
        a.name.localeCompare(b.name)
      )
    );
    setNewPlayerName("");
  };

  return (
    <>
      <button
        className="btn btn-active btn-secondary btn-lg mt-4 w-full"
        disabled={!canStart}
        onClick={() => {
          setCurrentPlayers(
            availablePlayers.filter((p) => p.checked).map((p) => p.name)
          );
          nav("/play");
        }}
      >
        {canStart ? "Start Tossing" : "Choose 2–7 Players"}
      </button>

      <div className="mt-4 flex">
        <input
          type="text"
          placeholder="Enter new player name"
          className={`input ${isDuplicate ? "input-error" : ""}`}
          value={newPlayerName}
          onChange={(e) => setNewPlayerName(e.target.value)}
        />
        <button className="btn btn-outline btn-neutral ml-2" onClick={addNewPlayer}>
          ADD
        </button>
      </div>

      <div className="mt-4">
        {availablePlayers.map((p) => (
          <label key={p.name} className="block mt-2">
            <input
              type="checkbox"
              className="checkbox mr-2"
              checked={p.checked}
              onChange={() =>
                setAvailablePlayers((prev) =>
                  prev.map((x) =>
                    x.name === p.name ? { ...x, checked: !x.checked } : x
                  )
                )
              }
            />
            {p.name}
          </label>
        ))}
      </div>
    </>
  );
};
