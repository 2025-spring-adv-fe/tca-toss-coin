import { useNavigate } from "react-router";
import { GeneralFacts, LeaderboardEntry } from "./GameResults";
import { useEffect } from "react";

export const AppTitle = "Toss Coin";

interface HomeProps {
  leaderboardData: LeaderboardEntry[];
  setTitle: (t: string) => void;
  generalFacts: GeneralFacts;
}

export const Home: React.FC<HomeProps> = ({
  leaderboardData,
  setTitle,
  generalFacts,
}) => {
  useEffect(() => setTitle("Home"), []);

  const nav = useNavigate();
 

  return (
    <>
      <button
        className="btn btn-active btn-secondary btn-lg mt-4"
        onClick={() => nav("/setup")}
      >
        Toss Coin
      </button>

      <div className="card w-full bg-base-100 card-md shadow-sm">
        <div className="card-body">
          <h2 className="card-title">General</h2>
          <div className="overflow-x-auto">
            <table className="table">
              <tbody>
                <tr>
                  <td>Last Played</td>
                  <td>{generalFacts.lastPlayed}</td>
                </tr>
                <tr>
                  <td>Total Games</td>
                  <td>{generalFacts.totalGames}</td>
                </tr>
                <tr>
                  <td>Shortest Game</td>
                  <td>{generalFacts.shortestGame}</td>
                </tr>
                <tr>
                  <td>Longest Game</td>
                  <td>{generalFacts.longestGame}</td>
                </tr>
                <tr>
                  <td>Average Turns Per Game</td>
                  <td>{generalFacts.avgTurnsPerGame}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="card w-full bg-base-100 card-md shadow-sm">
        <div className="card-body">
          <h2 className="card-title">leaderboard</h2>

          {leaderboardData.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>W</th>
                    <th>L</th>
                    <th>AVG</th>
                    <th>PLAYER</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboardData.map((x) => (
                    <tr key={x.player}>
                      <td>{x.wins}</td>
                      <td>{x.losses}</td>
                      <td>{x.average}</td>
                      <td>{x.player}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>play a game of toss coin to display thr leaderboard !!!</p>
          )}
        </div>
      </div>
    </>
  );
};
