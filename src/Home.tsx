import { useNavigate } from "react-router";
import { LeaderboardEntry } from "./GameResults";

interface HomeProps {
  totalGameCount: number;
  leaderboardData: LeaderboardEntry[];
}

export const Home: React.FC<HomeProps> = ({
  totalGameCount,
  leaderboardData,
}) => {
  console.log(leaderboardData);

  const nav = useNavigate();

  return (
    <>
      <h3 className="text-2xl font-bold">
        Home ({totalGameCount} games played)
      </h3>
      <button
        className="btn btn-active btn-secondary btn-lg mt-4"
        onClick={() => nav("/setup")}
      >
        Toss Coin
      </button>
      <div className="card w-full bg-base-100 card-md shadow-sm">
        <div className="card-body">
          <h2 className="card-title">leaderboard

          </h2>







            {
            leaderboardData.length > 0
            ?(
              <div className="overflow-x-auto">

              <table 
                className="table"
              >
                <thead>
                  <tr>
                    <th>W</th>
                    <th>L</th>
                    <th>AVG</th>
                    <th>PLAYER</th>
                  </tr>
                </thead>
                <tbody>
                    {
                      leaderboardData.map(
                        x=> (
                          <tr>
                            <td>{x.wins}</td>
                            <td>{ x.losses }</td>
                            <td>{x.average }</td>
                            <td>{x.player}</td>
                          </tr>
                        )
                      )
                    }
                  
                </tbody>
              </table>
            </div>
            )
            :(
              <p>
                play a game of toss coin to display thr leaderboard !!!
              </p>
            )

            
            }

 
        </div>
      </div>
    </>
  );
};
