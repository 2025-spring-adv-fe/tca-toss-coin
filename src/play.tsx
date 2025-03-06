import { useNavigate } from "react-router"; 
import React, { useState } from "react";
import { GameResult } from "./GameResults";

interface PlayProps {

  addNewGameResult: (r:GameResult) =>void;
  
}

export const Play: React.FC<PlayProps> = ({
  addNewGameResult
  
}) => {
  const nav = useNavigate();
  const [turnNumber, setTurnNumber] = useState(0);

  return (
    <>
      <h4 
      className="text-lg font-semibold">
        Turn #{turnNumber}
        <button
          className="btn btn-active btn-lg mt-4"
          onClick={ () =>{ 
            setTurnNumber(turnNumber + 1);
            console.log(turnNumber);
          }
        }
        >
          +
        </button>
      </h4>

      <button
        className="btn btn-active btn-secondary btn-lg mt-4"
        onClick={() => {
          addNewGameResult({
            winner:"Barbie",
              players:[
                "Barbie",
                "ken"
            ]
          });
          nav(-2);
        }}
      >
        Done
      </button>
    </>
  );
};
