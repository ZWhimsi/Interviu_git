// main.tsx
import ReactDOM from "react-dom/client";
import App from "./App";
import { DarkModeProvider } from "./context/DarkModeContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <DarkModeProvider>
    <App />
  </DarkModeProvider>
);
