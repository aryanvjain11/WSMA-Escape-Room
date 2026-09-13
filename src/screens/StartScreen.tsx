import { useState } from "react";
import { useGame } from "@/lib/gameContext";
import { Lock, Play, Trophy, Vault } from "@/components/icons";

export default function StartScreen() {
  const { startGame, goTo } = useGame();
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleLeaderboardAccess = () => {
    if (password === "heistmaster") {
      setShowLeaderboard(false);
      goTo("leaderboard");
    } else {
      setError(true);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gray-950">
      {/* Real-world vault door background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <img
          src="https://images.pexels.com/photos/19882101/pexels-photo-19882101.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
          alt=""
          className="h-full w-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950/90 via-gray-950/70 to-gray-950" />
      </div>
      {/* Radial glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/10 blur-[120px]" />

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4">
        {/* Vault icon */}
        <div className="mb-8 animate-pulse">
          <div className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-amber-500/40 bg-gray-900 shadow-[0_0_40px_rgba(245,158,11,0.2)]">
            <Vault className="h-12 w-12 text-amber-500" />
          </div>
        </div>

        <h1 className="font-serif text-5xl font-bold tracking-tight text-amber-400 sm:text-7xl">
          THE HEIST
        </h1>
        <p className="mt-2 text-sm uppercase tracking-[0.3em] text-gray-500">
          A Mathematical Escape Room
        </p>

        <p className="mt-8 max-w-md text-center text-gray-400">
          Infiltrate the vault through five rooms of puzzles. Decode ciphers,
          solve equations, navigate laser mazes, and crack the final code.
          How fast can you escape?
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <button
            onClick={startGame}
            className="group flex items-center gap-3 rounded-xl border border-amber-500 bg-amber-500/10 px-8 py-4 font-bold text-amber-400 transition-all hover:bg-amber-500 hover:text-gray-950 hover:shadow-[0_0_30px_rgba(245,158,11,0.4)]"
          >
            <Play className="h-5 w-5 transition-transform group-hover:scale-110" />
            Begin the Heist
          </button>
          <button
            onClick={() => setShowLeaderboard(true)}
            className="flex items-center gap-3 rounded-xl border border-gray-700 bg-gray-800 px-8 py-4 font-bold text-gray-300 transition-all hover:border-amber-500 hover:text-amber-400"
          >
            <Trophy className="h-5 w-5" />
            Leaderboard
          </button>
        </div>

        <div className="mt-12 flex gap-6 text-xs text-gray-600">
          <span>5 Rooms</span>
          <span>•</span>
          <span>Timed</span>
          <span>•</span>
          <span>Math Puzzles</span>
        </div>
      </div>

      {/* Leaderboard password modal */}
      {showLeaderboard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-amber-500/30 bg-gray-900 p-6 shadow-2xl">
            <div className="mb-4 flex items-center gap-3">
              <Lock className="h-5 w-5 text-amber-400" />
              <h2 className="font-serif text-xl font-bold text-amber-400">
                Master Access
              </h2>
            </div>
            <p className="mb-4 text-sm text-gray-400">
              Enter the master password to view the leaderboard.
            </p>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              onKeyDown={(e) => e.key === "Enter" && handleLeaderboardAccess()}
              placeholder="Password"
              className={`w-full rounded-lg border bg-gray-800 px-4 py-3 text-gray-200 outline-none transition-colors ${
                error
                  ? "border-red-500"
                  : "border-gray-700 focus:border-amber-500"
              }`}
              autoFocus
            />
            {error && (
              <p className="mt-2 text-sm text-red-400">
                Incorrect password. Try again.
              </p>
            )}
            <div className="mt-4 flex gap-3">
              <button
                onClick={() => setShowLeaderboard(false)}
                className="flex-1 rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-gray-400 transition-colors hover:text-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleLeaderboardAccess}
                className="flex-1 rounded-lg border border-amber-500 bg-amber-500/20 px-4 py-2 font-bold text-amber-400 transition-colors hover:bg-amber-500/30"
              >
                Enter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
