import { useState } from "react";
import { useGame } from "@/lib/gameContext";
import { supabase, type LeaderboardEntry } from "@/lib/supabase";
import {
  Trophy,
  Clock,
  CheckCircle2,
  Home,
  RotateCcw,
  Medal,
} from "lucide-react";

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export default function VictoryScreen() {
  const { getElapsedSeconds, resetGame, goTo } = useGame();
  const [playerName, setPlayerName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(false);
  const [topEntries, setTopEntries] = useState<LeaderboardEntry[]>([]);

  const elapsed = getElapsedSeconds();

  const handleSubmit = async () => {
    if (!playerName.trim()) return;
    setSubmitting(true);
    setError(false);

    try {
      const { error: insertError } = await supabase
        .from("leaderboard")
        .insert({
          player_name: playerName.trim(),
          completion_time_seconds: elapsed,
        });

      if (insertError) throw insertError;

      const { data, error: fetchError } = await supabase
        .from("leaderboard")
        .select("*")
        .order("completion_time_seconds", { ascending: true })
        .limit(10);

      if (fetchError) throw fetchError;

      setTopEntries(data || []);
      setSubmitted(true);
    } catch {
      setError(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gray-950">
      {/* Celebration glow */}
      <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/15 blur-[120px]" />

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-12">
        <div className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-amber-500 bg-amber-500/10 shadow-[0_0_40px_rgba(245,158,11,0.3)]">
          <Trophy className="h-12 w-12 text-amber-400" />
        </div>

        <h1 className="mt-6 font-serif text-4xl font-bold text-amber-400 sm:text-5xl">
          HEIST COMPLETE
        </h1>
        <p className="mt-2 text-sm uppercase tracking-[0.3em] text-gray-500">
          You cracked the vault
        </p>

        {/* Time display */}
        <div className="mt-8 flex items-center gap-3 rounded-xl border border-amber-500/30 bg-gray-900 px-8 py-4">
          <Clock className="h-6 w-6 text-amber-400" />
          <span className="font-mono text-4xl font-bold tabular-nums text-amber-400">
            {formatTime(elapsed)}
          </span>
        </div>

        {!submitted ? (
          <div className="mt-8 w-full max-w-md">
            <p className="mb-4 text-center text-gray-400">
              Enter your name to record your time on the leaderboard:
            </p>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="Your name"
              maxLength={30}
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-center text-gray-200 outline-none transition-colors focus:border-amber-500"
              autoFocus
            />
            {error && (
              <p className="mt-2 text-center text-sm text-red-400">
                Could not submit. Please try again.
              </p>
            )}
            <button
              onClick={handleSubmit}
              disabled={!playerName.trim() || submitting}
              className={`mt-4 w-full rounded-lg border py-3 font-bold transition-all ${
                playerName.trim() && !submitting
                  ? "border-amber-500 bg-amber-500/20 text-amber-400 hover:bg-amber-500/30"
                  : "cursor-not-allowed border-gray-800 bg-gray-800/50 text-gray-600"
              }`}
            >
              {submitting ? "Submitting..." : "Submit My Time"}
            </button>
          </div>
        ) : (
          <div className="mt-8 w-full max-w-md">
            <div className="mb-4 flex items-center justify-center gap-2 text-green-400">
              <CheckCircle2 className="h-5 w-5" />
              <span className="text-sm">Time recorded!</span>
            </div>
            <div className="rounded-xl border border-amber-500/20 bg-gray-900 p-4">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-amber-400">
                <Medal className="h-4 w-4" />
                Top 10 Times
              </h3>
              <div className="space-y-2">
                {topEntries.map((entry, i) => {
                  const isYou =
                    entry.player_name === playerName.trim() &&
                    entry.completion_time_seconds === elapsed;
                  return (
                    <div
                      key={entry.id}
                      className={`flex items-center justify-between rounded-lg px-3 py-2 ${
                        isYou
                          ? "border border-amber-500/50 bg-amber-500/10"
                          : i === 0
                          ? "bg-amber-500/5"
                          : "bg-gray-800/50"
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <span
                          className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                            i === 0
                              ? "bg-amber-500 text-gray-950"
                              : i === 1
                              ? "bg-gray-400 text-gray-950"
                              : i === 2
                              ? "bg-amber-700 text-gray-950"
                              : "bg-gray-700 text-gray-300"
                          }`}
                        >
                          {i + 1}
                        </span>
                        <span className="text-sm text-gray-200">
                          {entry.player_name}
                        </span>
                      </span>
                      <span className="font-mono text-sm font-bold tabular-nums text-amber-400">
                        {formatTime(entry.completion_time_seconds)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="mt-8 flex gap-4">
          <button
            onClick={resetGame}
            className="flex items-center gap-2 rounded-xl border border-gray-700 bg-gray-800 px-6 py-3 font-bold text-gray-300 transition-all hover:border-amber-500 hover:text-amber-400"
          >
            <RotateCcw className="h-4 w-4" />
            Play Again
          </button>
          <button
            onClick={() => goTo("start")}
            className="flex items-center gap-2 rounded-xl border border-gray-700 bg-gray-800 px-6 py-3 font-bold text-gray-300 transition-all hover:border-amber-500 hover:text-amber-400"
          >
            <Home className="h-4 w-4" />
            Home
          </button>
        </div>
      </div>
    </div>
  );
}
