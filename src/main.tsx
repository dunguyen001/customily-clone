import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { GlobalContext } from "./stores/Context";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <GlobalContext>
    <App />
  </GlobalContext>
);
