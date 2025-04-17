import { useNavigate } from "react-router"; 
import React, { useEffect, useState } from "react";
import { GameResult } from "./GameResults";

interface PlayProps {

  addNewGameResult: (r:GameResult) =>void;
  setTitle: (t: string) =>void;
  currentPlayers:string[]

  
}

export const Play: React.FC<PlayProps> = ({
  addNewGameResult,
  setTitle,
  currentPlayers,
}) => {
  useEffect(() => setTitle("play"), []);

  const nav = useNavigate();
  const [turnNumber, setTurnNumber] = useState(1); // Initialize turnNumber to 1
  const [startTimestamp] = useState(new Date().toISOString()); // Initialize startTimestamp
  const [pennyTossed, setPennyTossed] = useState(false);

  return (
    <>
      <h4 className="text-lg font-semibold">
        Turn #{turnNumber}
        <button
          className="btn btn-active btn-lg mt-4"
          onClick={() => {
            setTurnNumber(turnNumber + 1); // Increment turnNumber
            console.log(turnNumber);
          }}
        >
          +
        </button>
      </h4>


      <label className="block mt-2">
            <input
              type="checkbox"
              className="checkbox mr-2"
              checked={pennyTossed}
              onChange={
                () => setPennyTossed(
                  !pennyTossed
                )
              }
            />
            Tossed a penny!
      </label>




      <div className="grid grid-cols-2 gap-2 mt-4">
        {currentPlayers.map((x) => (
          <button
            key={x}
            className="btn btn-active btn-secondary btn-lg mt-4"
            onClick={() => {
              addNewGameResult({
                winner: x,
                players: currentPlayers,
                start: startTimestamp, // Use startTimestamp
                end: new Date().toISOString(), // Set end timestamp
                turnCount: turnNumber, // Include turnNumber
                pennyTossed: pennyTossed, 
              });
              nav(-2); // Navigate back
            }}
          >
            {x} Won
          </button>
        ))}
      </div>
    </>
  );
};
