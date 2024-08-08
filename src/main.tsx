import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Game from "./Components/Game.tsx";
import Brand from "./Components/Brand.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Brand />
    <Game wordLength={3} numTries={5} />
  </React.StrictMode>
);
