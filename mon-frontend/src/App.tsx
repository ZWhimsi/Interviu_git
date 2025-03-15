import { DarkModeProvider } from "./context/DarkModeContext";
import LandingPage from "./pages/LandingPage";

export default function App() {
  return (
    <DarkModeProvider>
      <LandingPage />
    </DarkModeProvider>
  );
}
