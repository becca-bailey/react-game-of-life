import React from "react";
import "./App.css";
import World from "./components/World";

const App: React.FC = () => {
  return (
    <div className="container">
      <main className="App">
        <World />
      </main>
    </div>
  );
};

export default App;
