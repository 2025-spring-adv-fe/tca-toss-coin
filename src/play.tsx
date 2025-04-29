import { useNavigate } from "react-router";
import React, { useEffect, useState } from "react";
import { GameResult } from "./GameResults";

interface PlayProps {
  addNewGameResult: (r: GameResult) => void;
  setTitle: (t: string) => void;
  currentPlayers: string[];
}

export const Play: React.FC<PlayProps> = ({ addNewGameResult, setTitle, currentPlayers }) => {
  useEffect(() => setTitle("play"), []);
  const nav = useNavigate();
  const [tosses, setTosses] = useState<Array<'heads' | 'tails'>>([]);
  const [start] = useState(new Date().toISOString());

  return (
    <div className="space-y-4">
      <div className="bg-base-200 p-4 rounded-lg">
        <h2 className="text-xl font-bold">Turn #{tosses.length + 1}</h2>
        <p className="mt-2">Toss History: {tosses.join(', ') || 'None'}</p>
        
        <div className="grid grid-cols-2 gap-2 mt-4">
          <button 
            className="btn btn-primary h-24 text-2xl"
            onClick={() => setTosses(prev => [...prev, 'heads'])}
          >
            Heads
          </button>
          <button
            className="btn btn-secondary h-24 text-2xl"
            onClick={() => setTosses(prev => [...prev, 'tails'])}
          >
            Tails
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {currentPlayers.map(player => (
          <button
            key={player}
            className="btn btn-accent btn-lg"
            onClick={() => {
              addNewGameResult({
                winner: player,
                players: currentPlayers,
                start,
                end: new Date().toISOString(),
                turnCount: tosses.length,
                pennyTossed: tosses.length > 0,
                tosses,
                headsCount: tosses.filter(t => t === 'heads').length,
                tailsCount: tosses.filter(t => t === 'tails').length
              });
              nav(-2);
            }}
          >
            {player} Wins!
          </button>
        ))}
      </div>
    </div>
  );
};