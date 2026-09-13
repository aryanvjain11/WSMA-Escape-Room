import { GameProvider, useGame } from "@/lib/gameContext";
import Timer from "@/components/Timer";
import ClueBanner from "@/components/ClueBanner";
import StartScreen from "@/screens/StartScreen";
import LobbyRoom from "@/screens/LobbyRoom";
import OfficeRoom from "@/screens/OfficeRoom";
import HallwayRoom from "@/screens/HallwayRoom";
import SafeRoom from "@/screens/SafeRoom";
import VaultRoom from "@/screens/VaultRoom";
import VictoryScreen from "@/screens/VictoryScreen";
import LeaderboardScreen from "@/screens/LeaderboardScreen";

function GameRouter() {
  const { screen } = useGame();

  const showChrome = screen !== "start" && screen !== "leaderboard";

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {showChrome && <Timer />}
      {showChrome && <ClueBanner />}
      {screen === "start" && <StartScreen />}
      {screen === "lobby" && <LobbyRoom />}
      {screen === "office" && <OfficeRoom />}
      {screen === "hallway" && <HallwayRoom />}
      {screen === "safe" && <SafeRoom />}
      {screen === "vault" && <VaultRoom />}
      {screen === "victory" && <VictoryScreen />}
      {screen === "leaderboard" && <LeaderboardScreen />}
    </div>
  );
}

export default function App() {
  return (
    <GameProvider>
      <GameRouter />
    </GameProvider>
  );
}
