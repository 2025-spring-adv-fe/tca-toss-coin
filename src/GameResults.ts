export interface GameResult {
  winner: string;
  players: string[];
  start: string;
  end: string;
  turnCount: number;
  pennyTossed: boolean;
  tosses: Array<'heads' | 'tails'>;
  headsCount: number;
  tailsCount: number;
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
  pennyGames: number;
  shortestGame: string;
  longestGame: string;
  avgTurnsPerGame: string;
  totalTosses: number;
  headsPercentage: string;
  tailsPercentage: string;
}

const formatDuration = (ms: number): string => {
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const secs = s % 60;
  return [h && `${h}h`, m && `${m}m`, `${secs}s`].filter(Boolean).join(" ");
};

const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
const formatRelative = (ms: number): string => {
  const secs = -Math.round(ms / 1000);
  const mins = -Math.round(ms / 60000);
  const hrs = -Math.round(ms / 3600000);
  const days = -Math.round(ms / 86400000);
  if (Math.abs(days) >= 1) return rtf.format(days, "day");
  if (Math.abs(hrs) >= 1) return rtf.format(hrs, "hour");
  if (Math.abs(mins) >= 1) return rtf.format(mins, "minute");
  return rtf.format(secs, "second");
};

export const getLeaderboard = (results: GameResult[]): LeaderboardEntry[] => {
  return Array.from(new Set(results.flatMap(r => r.players)))
      .map(player => {
          const played = results.filter(r => r.players.includes(player)).length;
          const wins = results.filter(r => r.winner === player).length;
          return {
              player,
              wins,
              losses: played - wins,
              average: (played ? (wins / played) : 0).toFixed(2)
          };
      })
      .sort((a, b) => Number(b.average) - Number(a.average));
};

export const getPreviousPlayers = (results: GameResult[]): string[] => 
  Array.from(new Set(results.flatMap(r => r.players))).sort();

export const getGeneralFacts = (results: GameResult[]): GeneralFacts => {
  if (!results.length) return {
      lastPlayed: "n/a",
      totalGames: 0,
      pennyGames: 0,
      shortestGame: "n/a",
      longestGame: "n/a",
      avgTurnsPerGame: "n/a",
      totalTosses: 0,
      headsPercentage: "n/a",
      tailsPercentage: "n/a"
  };

  const durations = results.map(r => Date.parse(r.end) - Date.parse(r.start));
  const totalTosses = results.reduce((sum, r) => sum + r.tosses.length, 0);
  const totalHeads = results.reduce((sum, r) => sum + r.headsCount, 0);
  const totalTails = results.reduce((sum, r) => sum + r.tailsCount, 0);

  return {
      lastPlayed: `${formatRelative(Date.now() - Math.min(...results.map(r => Date.parse(r.end))))} ago`,
      totalGames: results.length,
      pennyGames: results.filter(r => r.pennyTossed).length,
      shortestGame: formatDuration(Math.min(...durations)),
      longestGame: formatDuration(Math.max(...durations)),
      avgTurnsPerGame: (results.reduce((sum, r) => sum + r.turnCount, 0) / results.length).toFixed(2),
      totalTosses,
      headsPercentage: totalTosses ? `${((totalHeads / totalTosses) * 100).toFixed(1)}%` : "n/a",
      tailsPercentage: totalTosses ? `${((totalTails / totalTosses) * 100).toFixed(1)}%` : "n/a"
  };
};

export const getGamesByMonth = (results: GameResult[]): Array<[string, number]> => {
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const tally = results.reduce((map, { start }) => {
      const month = new Date(start).toLocaleString("en", { month: "short" });
      map.set(month, (map.get(month) || 0) + 1);
      return map;
  }, new Map<string, number>());
  return months.map(m => [m, tally.get(m) || 0]);
};