
export interface GameResult {
  winner: string;
  players: string[];
  start: string;
  end: string;
  turnCount: number;
  playerGuesses: Record<string, 'heads' | 'tails'>;
  tossResult: 'heads' | 'tails';
}

// Represents a leaderboard entry for a player
export interface LeaderboardEntry {
  wins: number;
  losses: number;
  average: string;
  player: string;
}

// Represents general statistics/facts about all games
export interface GeneralFacts {
  lastPlayed: string;
  totalGames: number;
  shortestGame: string;
  longestGame: string;
  avgTurnsPerGame: string;
  headsPercentage: string;
  tailsPercentage: string;
}

// Formats a duration in milliseconds as "Xh Ym Zs" (always showing all units)
function formatDuration(ms: number): string {
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const secs = s % 60;
  return `${h}h ${m}m ${secs}s`;
}

// Formats a relative time (ms) as "x days ago", "x hours ago", etc.
const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
function formatRelative(ms: number): string {
  const secs = -Math.round(ms / 1000);
  const mins = -Math.round(ms / 60000);
  const hrs = -Math.round(ms / 3600000);
  const days = -Math.round(ms / 86400000);
  if (Math.abs(days) >= 1) return rtf.format(days, "day");
  if (Math.abs(hrs) >= 1) return rtf.format(hrs, "hour");
  if (Math.abs(mins) >= 1) return rtf.format(mins, "minute");
  return rtf.format(secs, "second");
}

// Builds the leaderboard from all game results
// Returns an array of LeaderboardEntry sorted by win average descending
export const getLeaderboard = (results: GameResult[]): LeaderboardEntry[] =>
  Array.from(new Set(results.flatMap(r => r.players)))
    .map(player => {
      const played = results.filter(r => r.players.includes(player)).length;
      const wins = results.filter(r => r.winner === player).length;
      const avg = played > 0 ? wins / played : 0;
      return { player, wins, losses: played - wins, average: avg.toFixed(2) };
    })
    .sort((a, b) => Number(b.average) - Number(a.average));

// Returns a sorted list of all players who have played at least one game
export const getPreviousPlayers = (results: GameResult[]): string[] =>
  Array.from(new Set(results.flatMap(r => r.players))).sort();

// Computes general statistics/facts from all game results
export const getGeneralFacts = (results: GameResult[]): GeneralFacts => {
  if (!results.length) return {
    lastPlayed: "n/a",
    totalGames: 0,
    shortestGame: "n/a",
    longestGame: "n/a",
    avgTurnsPerGame: "n/a",
    headsPercentage: "n/a",
    tailsPercentage: "n/a"
  };

  const durations = results.map(r => Date.parse(r.end) - Date.parse(r.start));
  const totalHeads = results.filter(r => r.tossResult === 'heads').length;
  const totalTails = results.length - totalHeads;

  // Find the most recent game end date (last played)
  const mostRecentEnd = Math.max(...results.map(r => Date.parse(r.end)));
  const lastPlayedAgo = formatRelative(Date.now() - mostRecentEnd);

  return {
    lastPlayed: `${lastPlayedAgo}`,
    totalGames: results.length,
    shortestGame: formatDuration(Math.min(...durations)),
    longestGame: formatDuration(Math.max(...durations)),
    avgTurnsPerGame: (results.reduce((sum, r) => sum + r.turnCount, 0) / results.length).toFixed(2),
    headsPercentage: `${((totalHeads / results.length) * 100).toFixed(1)}%`,
    tailsPercentage: `${((totalTails / results.length) * 100).toFixed(1)}%`
  };
};

// Returns an array of [month, number of games played in that month]
export const getGamesByMonth = (results: GameResult[]): Array<[string, number]> => {
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const tally = results.reduce((map, { start }) => {
    const m = new Date(start).toLocaleString("default", { month: "short" });
    map.set(m, (map.get(m) || 0) + 1);
    return map;
  }, new Map<string, number>());
  return months.map(m => [m, tally.get(m) || 0]);
};