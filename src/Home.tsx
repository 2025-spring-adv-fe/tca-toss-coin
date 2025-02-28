import { useNavigate } from "react-router"; 
import { LeaderboardEntry } from "./GameResults";

interface HomeProps {
  totalGameCount: number;
  leaderboardData: LeaderboardEntry[];
}

export const Home: React.FC<HomeProps> = ({
   totalGameCount,
   leaderboardData

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
    </>
  );
};
