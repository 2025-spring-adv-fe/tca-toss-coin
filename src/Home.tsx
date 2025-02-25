import { useNavigate } from "react-router";

export const Home = () => {
    //use react hook or button navigation
    const nav = useNavigate();
  return (
    <>
      <h3 
      className="text-2xl font-bold"
      >
        Home(o game palayed)
        </h3>
      <button 
      className="btn btn-active btn-secondary btn-lg mt-4"
      onClick={
         ()=>nav("/setup") 
      }
      >
        toss coin
      </button>
    </>
  );
};
