import { useNavigate } from "react-router"; 
import React, { useState } from "react";

interface PlayProps {
  totalGameCount: number;
  
}

export const Play: React.FC<PlayProps> = ({
  totalGameCount: tossCoin,
  
}) => {
  const nav = useNavigate();
  const [turnNumber, setTurnNumber] = useState(0);

  return (
    <>
      <h3 
      className="text-2xl font-bold"
      >
        Play 
        ({tossCoin} games played)
      </h3>
      <h4 
      className="text-lg font-semibold">
        Play #{turnNumber}
        <button
          className="btn btn-active btn-lg mt-4"
          onClick={() => setTurnNumber((prevTurn) => prevTurn + 1)}
        >
          +
        </button>
      </h4>

      <button
        className="btn btn-active btn-secondary btn-lg mt-4"
        onClick={() => {
          (tossCoin + 1); 
          nav(-2);
        }}
      >
        Done
      </button>
    </>
  );
};
