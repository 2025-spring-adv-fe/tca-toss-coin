import { useNavigate } from "react-router"; 

interface SetupProps {
}

export const Setup: React.FC<SetupProps> = ({  }) => {
  const nav = useNavigate();

  return (
    <>
     
      <button
        className="btn btn-active btn-secondary btn-lg mt-4"
        onClick={() => nav("/play")}
      >
        Start Tossing
      </button>
    </>
  );
};
