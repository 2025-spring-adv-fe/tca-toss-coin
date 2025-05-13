import { useNavigate } from "react-router-dom";
import { GeneralFacts, LeaderboardEntry } from "./GameResults";
import { useEffect } from "react";

// The app's title constant
export const AppTitle = "Coin Toss";

// Props expected by the Home component
interface HomeProps {
  leaderboardData: LeaderboardEntry[];           // Leaderboard data for display
  setTitle: (t: string) => void;                 // Function to set the page title
  generalFacts: GeneralFacts;                    // General statistics/facts about games
  gamesByMonthData: Array<[string, number]>;     // Monthly activity data
}

// Main Home component: displays stats, leaderboard, and monthly activity
export const Home: React.FC<HomeProps> = ({
  leaderboardData,
  setTitle,
  generalFacts,
  gamesByMonthData
}) => {
  // Set the page title to "Home" on mount
  useEffect(() => setTitle("Home"), []);
  const nav = useNavigate(); // For navigation

  return (
    <div className="space-y-4">
      {/* Button to start a new game (navigates to setup page) */}
      <button
        className="btn btn-primary w-full"
        onClick={() => nav("/setup")}
      >
        New Game
      </button>

      {/* Statistics card: shows general game stats */}
      <div className="card bg-base-200">
        <div className="card-body">
          <h2 className="card-title">Statistics</h2>
          <table className="table">
            <tbody>
              <tr><td>Total Games</td><td>{generalFacts.totalGames}</td></tr>
              <tr><td>Last Played</td><td>{generalFacts.lastPlayed}</td></tr>
              <tr><td>Heads Rate</td><td>{generalFacts.headsPercentage}</td></tr>
              <tr><td>Tails Rate</td><td>{generalFacts.tailsPercentage}</td></tr>
              <tr><td>Avg Turns/Game</td><td>{generalFacts.avgTurnsPerGame}</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Leaderboard card: shows player rankings */}
      <div className="card bg-base-200">
        <div className="card-body">
          <h2 className="card-title">Leaderboard</h2>
          {leaderboardData.length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th>Player</th>
                  <th>Wins</th>
                  <th>Losses</th>
                  <th>Win%</th>
                </tr>
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
          ) : (
            <p className="text-center py-4">No games played yet!</p>
          )}
        </div>
      </div>

      {/* Monthly Activity card: shows games played per month */}
      <div className="card bg-base-200">
        <div className="card-body">
          <h2 className="card-title">Monthly Activity</h2>
          {gamesByMonthData.length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Games</th>
                </tr>
              </thead>
              <tbody>
                {gamesByMonthData.map(([month, count]) => (
                  <tr key={month}><td>{month}</td><td>{count}</td></tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center py-4">No games recorded yet!</p>
          )}
        </div>
      </div>
    </div>
  );
};