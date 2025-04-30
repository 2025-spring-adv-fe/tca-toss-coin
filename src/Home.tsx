import { useNavigate } from "react-router-dom";
import { GeneralFacts, LeaderboardEntry } from "./GameResults";
import { useEffect } from "react";

export const AppTitle = "Coin Toss Arena";

interface HomeProps {
  leaderboardData: LeaderboardEntry[];
  setTitle: (t: string) => void;
  generalFacts: GeneralFacts;
  gamesByMonthData: Array<[string, number]>;
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
    <div className="space-y-6">
      <button 
        className="btn btn-primary btn-lg w-full"
        onClick={() => nav("/setup")}
      >
        New Game
      </button>

      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h2 className="card-title">Statistics</h2>
          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <tbody>
                <tr><td>Total Games</td><td>{generalFacts.totalGames}</td></tr>
                <tr><td>Last Played</td><td>{generalFacts.lastPlayed}</td></tr>
                <tr><td>Heads Probability</td><td>{generalFacts.headsPercentage}</td></tr>
                <tr><td>Tails Probability</td><td>{generalFacts.tailsPercentage}</td></tr>
                <tr><td>Shortest Game</td><td>{generalFacts.shortestGame}</td></tr>
                <tr><td>Longest Game</td><td>{generalFacts.longestGame}</td></tr>
                <tr><td>Avg Turns/Game</td><td>{generalFacts.avgTurnsPerGame}</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h2 className="card-title">Leaderboard</h2>
          {leaderboardData.length ? (
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr><th>Player</th><th>Wins</th><th>Losses</th><th>Win Rate</th></tr>
                </thead>
                <tbody>
                  {leaderboardData.map(x => (
                    <tr key={x.player}>
                      <td>{x.player}</td>
                      <td>{x.wins}</td>
                      <td>{x.losses}</td>
                      <td>{x.average}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : <div className="text-center p-4">No games played yet!</div>}
        </div>
      </div>

      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h2 className="card-title">Monthly Activity</h2>
          {gamesByMonthData.length ? (
            <div className="overflow-x-auto">
              <table className="table">
                <thead><tr><th>Month</th><th>Games</th></tr></thead>
                <tbody>
                  {gamesByMonthData.map(([month, count]) => (
                    <tr key={month}><td>{month}</td><td>{count}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : <div className="text-center p-4">No games recorded!</div>}
        </div>
      </div>
    </div>
  );
};