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
// other codes for example dertive
//
const numberOfChosenPlayers = availablePlayers.filter(x => x.checked).length;
const twoToSevenPlayersChosen = numberOfChosenPlayers >= 2 && numberOfChosenPlayers <= 7;


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
           disabled={!twoToSevenPlayersChosen

           }
      >
        Start Tossing
      </button>
      <div className="mt-4"
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
