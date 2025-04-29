import { useNavigate } from "react-router-dom";
import { GeneralFacts, LeaderboardEntry } from "./GameResults";
import { useEffect } from "react";

export const AppTitle = "Toss Coin";

interface HomeProps {
  leaderboardData: LeaderboardEntry[];
  setTitle: (t: string) => void;
  generalFacts: GeneralFacts;
  gamesByMonthData: Array<[string, number]>;
  gameDurationData: any;
}

export const Home: React.FC<HomeProps> = ({
  leaderboardData,
  setTitle,
  generalFacts,
  gamesByMonthData
}) => {
  useEffect(() => setTitle("Home"), []);
  const nav = useNavigate();

  return (
    <>
      <button className="btn btn-secondary btn-lg mt-4 section" onClick={() => nav("/setup")}>
        Toss Coin
      </button>

      <div className="card bg-base-100 shadow-sm">
        <div className="card-body">
          <h2 className="card-title">General Stats</h2>
          <table className="table">
            <tbody>
              <tr><td>Last Played</td><td>{generalFacts.lastPlayed}</td></tr>
              <tr><td>Total Games</td><td>{generalFacts.totalGames}</td></tr>
              <tr><td>Penny Games</td><td>{generalFacts.pennyGames}</td></tr>
              <tr><td>Total Tosses</td><td>{generalFacts.totalTosses}</td></tr>
              <tr><td>Heads %</td><td>{generalFacts.headsPercentage}</td></tr>
              <tr><td>Tails %</td><td>{generalFacts.tailsPercentage}</td></tr>
              <tr><td>Shortest Game</td><td>{generalFacts.shortestGame}</td></tr>
              <tr><td>Longest Game</td><td>{generalFacts.longestGame}</td></tr>
              <tr><td>Avg Turns</td><td>{generalFacts.avgTurnsPerGame}</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="card bg-base-100 shadow-sm mt-4">
        <div className="card-body">
          <h2 className="card-title">Leaderboard</h2>
          {leaderboardData.length ? (
            <table className="table">
              <thead><tr><th>W</th><th>L</th><th>AVG</th><th>PLAYER</th></tr></thead>
              <tbody>
                {leaderboardData.map(x => (
                  <tr key={x.player}>
                    <td>{x.wins}</td>
                    <td>{x.losses}</td>
                    <td>{x.average}</td>
                    <td>{x.player}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : <p>Play a game to see the leaderboard!</p>}
        </div>
      </div>

      <div className="card bg-base-100 shadow-sm mt-4">
        <div className="card-body">
          <h2 className="card-title">Monthly Games</h2>
          {gamesByMonthData.length ? (
            <table className="table">
              <thead><tr><th>Month</th><th>Games</th></tr></thead>
              <tbody>
                {gamesByMonthData.map(([month, count]) => (
                  <tr key={month}><td>{month}</td><td>{count}</td></tr>
                ))}
              </tbody>
            </table>
          ) : <p>No games recorded yet!</p>}
        </div>
      </div>
    </>
  );
};