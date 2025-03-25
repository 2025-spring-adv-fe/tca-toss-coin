import { durationFormatter } from "human-readable";

const formatGameDuration = durationFormatter<string>();

const formatLastPlayed = durationFormatter<string>({

    allowMultiples: ["y","mo","d"]
});



//exported interfaces....

export interface GameResult {
    winner: string;
    players: string[];
    start: string;
    end: string;
};


export interface LeaderboardEntry {
    wins: number;
    losses: number;
    average: string;
    player: string;
};

export interface GeneralFacts {
    lastPlayed: string;
    totalGames: number;
    shortestGame: string;
    longestGame: string;
};


// exported function.................
//
export const getLeaderboard = (
    results: GameResult[]
): LeaderboardEntry[] => 
    getPreviousPlayers(results)
        .map(
            x => getLeaderboardEntry(
                    results
                    , x
                )
        )
        .sort(
             (a, b) => {
                
                // Some wins with same average, more games makes you higher on the leaderboard...
                if (Number(a.average) === Number(b.average) && a.wins > 0) {
                    return (b.wins + b.losses) - (a.wins + a.losses);
                }

                // No wins, more games makes you lower on the leaderboard...
                if (0 === a.wins && 0 === b.wins) {
                    return (a.wins + a.losses) - (b.wins + b.losses);
                }

                // Non special case, higher average means higher on leaderboard...
                return Number(b.average) - Number(a.average);
            }
        )
;


export const getGeneralFacts = (results: GameResult[]): GeneralFacts => {
 if (results.length == 0) {
    return {
        lastPlayed:"n/a"
        ,totalGames:0
        ,shortestGame:"n/a"
        ,longestGame:"n/0"
    }
 }
    // Calcs for lastPlayed...
    const now = Date.now();

    const gameEndTimesInMilliseconds = results.map(
        x => now - Date.parse(x.end)
    );

    const lastPlayedInMilliseconds = Math.min(...gameEndTimesInMilliseconds);

    // console.log(
    //     gameEndTimesInMilliseconds
    // );

    // Calcs for shortest/longest...
    const gameDurationsInMilliseconds = results.map(
        x => Date.parse(x.end) - Date.parse(x.start)
    );

    return {
        lastPlayed: `${formatLastPlayed(lastPlayedInMilliseconds)} ago`
        , totalGames: results.length
        , shortestGame: formatGameDuration(Math.min(...gameDurationsInMilliseconds))
        , longestGame: formatGameDuration(Math.max(...gameDurationsInMilliseconds))
    };
};


//Helper functions.............
//
const getLeaderboardEntry = (
    results: GameResult[]
    , player: string
): LeaderboardEntry => {

    const totalGamesForPlayer = results.filter(
        x => x.players.some(
            y => player === y
        )
    ).length;


    const wins = results.filter(
        x => x.winner === player 
    ).length;

    // console.log(
    //     wins
    // );

    const avg = totalGamesForPlayer > 0
        ? wins / totalGamesForPlayer
        : 0
    ;

    return {
        wins: wins
        , losses: totalGamesForPlayer - wins
        , average: avg.toFixed(3)
        , player: player
    };
};

const getPreviousPlayers = (
    results: GameResult[]
) => {
    const allPlayersForAllGamesWithDupes = results.flatMap(
        x => x.players
    );

    return [
        ...new Set(allPlayersForAllGamesWithDupes)
    ].sort(
        (a, b) => a.localeCompare(b)
    );
};

