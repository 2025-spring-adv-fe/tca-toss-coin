import { useEffect, useState } from "react";
import { useNavigate } from "react-router"; 

interface SetupProps {
  setTitle: (t: string) => void;
  previousPlayers:string[];
  setCurrentPlayers: (players: string[]) =>void;
}

export const Setup: React.FC<SetupProps> = ({setTitle
  ,previousPlayers
  ,setCurrentPlayers
}) => {

  useEffect(
    () => setTitle("setup")
    ,[]

  );

  const nav = useNavigate();
  const [availablePlayers,setAvailableplayes] = useState (
    previousPlayers.map(
      x => ({
        name:x
        ,checked:false
      })
    )
  );

//
const [newPlayerName, setNewPlayerName] = useState("");
// other codes for example dertive
//

const numberOfChosenPlayers = availablePlayers.filter(x => x.checked).length;
const twoToSevenPlayersChosen = numberOfChosenPlayers >= 2 && numberOfChosenPlayers <= 7;

const duplicatePlayerName = availablePlayers.some(
    x => x.name.toUpperCase() === newPlayerName.toUpperCase()
    );
const validateAndAddNewPlayer = () => {
  // if invalid
  if (newPlayerName.length === 0
      || duplicatePlayerName
  ) {
    return;
  }

    setAvailableplayes(
        [
          ...availablePlayers
          , {
            name: newPlayerName
            ,checked:true
          }
        ] .sort(
          (a,b) => a.name.toUpperCase().localeCompare(b.name.toUpperCase())
        )
      );
      setNewPlayerName("");
      
    };

  return (
    <>     
      {/* <button
        className="btn btn-active btn-secondary btn-lg mt-4"
        onClick={() => 
              () => {
                setCurrentPlayers(
                  availablePlayers
                  .filter(
                    x => x.checked
                  )
                  .map(
                    x => (
                      x.name
                    )
                  )
                );
                nav("/play")
            }
        }
      >
        Start Tossing
      </button>  */}
      <button
        className="btn btn-active btn-secondary btn-lg mt-4 w-full"
        onClick={() => {
            setCurrentPlayers(
            availablePlayers
            .filter((x) => x.checked)
            .map((x) => x.name)
              );
          nav("/play");
           }}
           disabled={!twoToSevenPlayersChosen}
      >
        {
          twoToSevenPlayersChosen
          ? "start Playing"
          :"choose 2-7 Players"
        }
        Start Tossing
      </button>
      <div className="mt-4 flex">
        <input 
          type="text"
           placeholder ="enter new player name" 
           className={`input ${duplicatePlayerName ? "input-error" :""}`}
           value={newPlayerName}
            onChange={
              (e) => setNewPlayerName(e.target.value)
            } 
           />
          <button 
            className="btn btn-outline btn-neutral ml-2"
            onClick={
              validateAndAddNewPlayer
            }
          >
            ADD
          </button>

      </div>
      <div 
        className="mt-4"
      >
        {
        availablePlayers.map(
          x => (
            <label 
              key={x.name}
              className="block mt-2"
            >
              <input 
                type="checkbox" className="checkbox mr-2" 
                checked= {x.checked}
                onChange={ 
                  () => setAvailableplayes(
                    availablePlayers.map(
                  y => ({
                    name:y.name
                    , checked: y.name ===x.name
                    ? !y.checked
                    : y.checked
                  })
                )
              )

              }
              />

              {x.name}
            </label>
          )
        )
      }        
      </div>
    </>
  );
};
