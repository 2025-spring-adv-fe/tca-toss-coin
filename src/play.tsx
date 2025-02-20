import { useNavigate } from "react-router";

export const Play = () => {
  const nav = useNavigate();
  return (
    <>
      <h3 
      className="text-2xl font-bold"
      >
        play
        </h3>
      <button 
      className="btn btn-active btn-secondary btn-lg mt-4"
      onClick={
            () => nav (-2)

      }
      >
        
        Done
      </button>
    </>
  );
};
