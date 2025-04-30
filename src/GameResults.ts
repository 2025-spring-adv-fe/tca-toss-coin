export interface GameResult {
  winner: string;
  players: string[];
  start: string;
  end: string;
  turnCount: number;
  playerGuesses: Record<string, 'heads' | 'tails'>;
  tossResult: 'heads' | 'tails';
}

export interface LeaderboardEntry {
  wins: number;
  losses: number;
  average: string;
  player: string;
}

export interface GeneralFacts {
  lastPlayed: string;
  totalGames: number;
  shortestGame: string;
  longestGame: string;
  avgTurnsPerGame: string;
  headsPercentage: string;
  tailsPercentage: string;
}

function formatDuration(ms: number): string {
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const secs = s % 60;
  return [h && `${h}h`, m && `${m}m`, `${secs}s`].filter(Boolean).join(" ");
}

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

export const getLeaderboard = (results: GameResult[]): LeaderboardEntry[] =>
  Array.from(new Set(results.flatMap(r => r.players)))
      .map(player => {
          const played = results.filter(r => r.players.includes(player)).length;
          const wins = results.filter(r => r.winner === player).length;
          const avg = played > 0 ? wins / played : 0;
          return { player, wins, losses: played - wins, average: avg.toFixed(2) };
      })
      .sort((a, b) => Number(b.average) - Number(a.average));

export const getPreviousPlayers = (results: GameResult[]): string[] =>
  Array.from(new Set(results.flatMap(r => r.players))).sort();

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

  return {
      lastPlayed: `${formatRelative(Date.now() - Math.min(...results.map(r => Date.parse(r.end))))} ago`,
      totalGames: results.length,
      shortestGame: formatDuration(Math.min(...durations)),
      longestGame: formatDuration(Math.max(...durations)),
      avgTurnsPerGame: (results.reduce((sum, r) => sum + r.turnCount, 0) / results.length).toFixed(2),
      headsPercentage: `${((totalHeads / results.length) * 100).toFixed(1)}%`,
      tailsPercentage: `${((totalTails / results.length) * 100).toFixed(1)}%`
  };
};

export const getGamesByMonth = (results: GameResult[]): Array<[string, number]> => {
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const tally = results.reduce((map, { start }) => {
      const m = new Date(start).toLocaleString("default", { month: "short" });
      map.set(m, (map.get(m) || 0) + 1);
      return map;
  }, new Map<string, number>());
  return months.map(m => [m, tally.get(m) || 0]);
};