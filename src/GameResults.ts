// src/GameResults.ts

export interface GameResult {
    winner: string;
    players: string[];
    start: string;   // ISO timestamp
    end: string;     // ISO timestamp
    turnCount: number;
  }
  
  export interface LeaderboardEntry {
    wins: number;
    losses: number;
    average: string;  // formatted "0.00"
    player: string;
  }
  
  export interface GeneralFacts {
    lastPlayed: string;    // e.g. "3 days ago"
    totalGames: number;
    shortestGame: string;  // e.g. "15m 30s"
    longestGame: string;
    avgTurnsPerGame: string; // e.g. "12.50"
  }
  
  // ————————————————————————————
  // Helpers
  // ————————————————————————————
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
    if (Math.abs(hrs)  >= 1) return rtf.format(hrs, "hour");
    if (Math.abs(mins)>= 1) return rtf.format(mins, "minute");
    return rtf.format(secs, "second");
  }
  
  // ————————————————————————————
  // Core exports
  // ————————————————————————————
  
  /**
   * Build a sorted leaderboard for every player.
   */
  export const getLeaderboard = (results: GameResult[]): LeaderboardEntry[] =>
    Array.from(new Set(results.flatMap(r => r.players)))
      .map(player => {
        const played = results.filter(r => r.players.includes(player)).length;
        const wins = results.filter(r => r.winner === player).length;
        const avg = played > 0 ? wins / played : 0;
        return {
          player,
          wins,
          losses: played - wins,
          average: avg.toFixed(2),
        };
      })
      .sort((a, b) => {
        if (a.average === b.average) {
          return (b.wins + b.losses) - (a.wins + a.losses);
        }
        return Number(b.average) - Number(a.average);
      });
  
  /**
   * Return the unique list of all players who have ever played.
   */
  export const getPreviousPlayers = (results: GameResult[]): string[] =>
    Array.from(new Set(results.flatMap(r => r.players))).sort();
  
  /**
   * Summarize general facts about all games.
   */
  export const getGeneralFacts = (results: GameResult[]): GeneralFacts => {
    if (results.length === 0) {
      return {
        lastPlayed: "n/a",
        totalGames: 0,
        shortestGame: "n/a",
        longestGame: "n/a",
        avgTurnsPerGame: "n/a",
      };
    }
    const now = Date.now();
    const endDeltas = results.map(r => now - Date.parse(r.end));
    const lastMs = Math.min(...endDeltas);
  
    const durations = results.map(r => Date.parse(r.end) - Date.parse(r.start));
    const shortest = Math.min(...durations);
    const longest = Math.max(...durations);
  
    const totalTurns = results.reduce((sum, r) => sum + r.turnCount, 0);
    const avgTurns = (totalTurns / results.length).toFixed(2);
  
    return {
      lastPlayed: `${formatRelative(lastMs)} ago`,
      totalGames: results.length,
      shortestGame: formatDuration(shortest),
      longestGame: formatDuration(longest),
      avgTurnsPerGame: avgTurns,
    };
  };
  
  /**
   * Count games by the short month name.
   */
  export const getGamesByMonth = (
    results: GameResult[]
  ): Array<[string, number]> => {
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const tally = results.reduce((map, { start }) => {
      const m = new Date(start).toLocaleString("default", { month: "short" });
      map.set(m, (map.get(m) || 0) + 1);
      return map;
    }, new Map<string, number>());
  
    return months.map(m => [m, tally.get(m) || 0] as [string, number]);
  };
  