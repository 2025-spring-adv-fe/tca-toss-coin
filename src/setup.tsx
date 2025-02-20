import { useNavigate } from "react-router";

export const Setup = () => {
  const nav = useNavigate()
  return (
    <>
      <h3 
        className="text-2xl font-bold"
        >
          setup
        </h3>
      <button 
      className="btn btn-active btn-secondary btn-lg mt-4"
      onClick={
            () =>nav("/play")

      }
      >
        Start tossing
      </button>
    </>
  );
};
