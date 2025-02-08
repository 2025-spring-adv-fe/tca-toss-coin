import "./App.css";

function App() {
  return (
    <div>
      <h1 className="text-2x1 font-bold bg-base-300 p-4 ml-6 uppercase bg-sky-950 text-secondary">
        TCA Toss Coin
      </h1>
      <div>
        <button className="btn btn-secondary btn-soft btn-soft btn-xl p-4 ml-8 w-full lg:w-auto text-nowrap">
          start to play
        </button>
        <h2 className="mt-3 ml-6 text-xl font-semi-bold">Leaderboard</h2>

        <div 
        className="grid grid-cols-1 lg:grid-cols-2 gap-4"
        >

<div className="card-lg w-full bg-base-100 shadow-xl mt-4">
          <div className="card-body">
            <h2 className="card-title">Leaderboard</h2>
            <p>Leaderboard coming soon...........</p>
          </div>
        </div>

        <div className="card-lg w-full bg-base-100 shadow-xl mt-4">
          <div className="card-body">
            <h2 className="card-title">Leaderboard</h2>
            <p>Leaderboard coming soon...........</p>
          </div>
        </div>

        <div className="card-lg w-full bg-base-100 shadow-xl mt-4">
          <div className="card-body">
            <h2 className="card-title">Leaderboard</h2>
            <p>Leaderboard coming soon...........</p>
          </div>
        </div>

        <div className="card-lg w-full bg-base-100 shadow-xl mt-4">
          <div className="card-body">
            <h2 className="card-title">Leaderboard</h2>


            <div className="chat chat-start">
              <div className="chat-bubble chat-bubble-primary">
                What kind of nonsense is this
              </div>
            </div>
            <div className="chat chat-start">
              <div className="chat-bubble chat-bubble-secondary">
                Put me on the Council and not make me a Master!??
              </div>
            </div>
            <div className="chat chat-start">
              <div className="chat-bubble chat-bubble-accent">
                That's never been done in the history of the Jedi. It's
                insulting!
              </div>
            </div>
            <div className="chat chat-end">
              <div className="chat-bubble chat-bubble-info">
                Calm down, Anakin.
              </div>
            </div>
            <div className="chat chat-end">
              <div className="chat-bubble chat-bubble-success">
                You have been given a great honor.
              </div>
            </div>
            <div className="chat chat-end">
              <div className="chat-bubble chat-bubble-warning">
                To be on the Council at your age.
              </div>
            </div>
            <div className="chat chat-end">
              <div className="chat-bubble chat-bubble-error">
                It's never happened before.
              </div>
            </div>


          </div>
        </div>

        </div>


        
      </div>
    </div>
  );
}

export default App;
