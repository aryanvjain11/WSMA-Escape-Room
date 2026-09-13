import { useState, useEffect } from "react";
import { useGame } from "@/lib/gameContext";
import { supabase, type LeaderboardEntry } from "@/lib/supabase";
import { Trophy, Home, Clock, BarChart3, Medal } from "lucide-react";

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export default function LeaderboardScreen() {
  const { goTo } = useGame();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [averageTime, setAverageTime] = useState(0);
  const [totalPlayers, setTotalPlayers] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from("leaderboard")
          .select("*")
          .order("completion_time_seconds", { ascending: true })
          .limit(10);

        if (fetchError) throw fetchError;
        setEntries(data || []);

        // Fetch average and total
        const { data: allData, error: allError } = await supabase
          .from("leaderboard")
          .select("completion_time_seconds");

        if (allError) throw allError;

        if (allData && allData.length > 0) {
          const total = allData.reduce(
            (sum, e) => sum + e.completion_time_seconds,
            0
          );
          setAverageTime(Math.round(total / allData.length));
          setTotalPlayers(allData.length);
        }
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gray-950">
      <div className="absolute left-1/2 top-0 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-amber-500/10 blur-[100px]" />

      <div className="relative z-10 mx-auto max-w-3xl px-4 py-12">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-amber-500/40 bg-amber-500/10">
              <Trophy className="h-6 w-6 text-amber-400" />
            </div>
            <div>
              <h1 className="font-serif text-3xl font-bold text-amber-400">
                Leaderboard
              </h1>
              <p className="text-sm text-gray-500">
                Master Access — Top 10 Fastest Heists
              </p>
            </div>
          </div>
          <button
            onClick={() => goTo("start")}
            className="flex items-center gap-2 rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-sm text-gray-300 transition-all hover:border-amber-500 hover:text-amber-400"
          >
            <Home className="h-4 w-4" />
            Home
          </button>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-2 gap-4">
          <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
            <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-gray-500">
              <BarChart3 className="h-4 w-4" />
              Average Time
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-6 w-6 text-amber-400" />
              <span className="font-mono text-3xl font-bold tabular-nums text-amber-400">
                {formatTime(averageTime)}
              </span>
            </div>
          </div>
          <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
            <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-gray-500">
              <Medal className="h-4 w-4" />
              Total Players
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-3xl font-bold tabular-nums text-gray-200">
                {totalPlayers}
              </span>
            </div>
          </div>
        </div>

        {/* Top 10 table */}
        <div className="rounded-xl border border-gray-800 bg-gray-900 overflow-hidden">
          <div className="border-b border-gray-800 bg-gray-800/50 px-4 py-3">
            <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-amber-400">
              <Trophy className="h-4 w-4" />
              Top 10 Fastest Escapes
            </h2>
          </div>

          {loading ? (
            <div className="p-8 text-center text-gray-500">
              Loading leaderboard...
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-400">
              Could not load leaderboard data.
            </div>
          ) : entries.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No times recorded yet. Be the first to complete the heist!
            </div>
          ) : (
            <div className="divide-y divide-gray-800">
              {/* Header row */}
              <div className="flex items-center px-4 py-2 text-xs font-bold uppercase tracking-wide text-gray-500">
                <span className="w-12">Rank</span>
                <span className="flex-1">Player</span>
                <span className="w-32 text-right">Time</span>
                <span className="hidden w-32 text-right sm:block">Date</span>
              </div>
              {entries.map((entry, i) => (
                <div
                  key={entry.id}
                  className={`flex items-center px-4 py-3 transition-colors hover:bg-gray-800/30 ${
                    i === 0 ? "bg-amber-500/5" : ""
                  }`}
                >
                  <span className="w-12">
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
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
                  </span>
                  <span className="flex-1 font-semibold text-gray-200">
                    {entry.player_name}
                  </span>
                  <span className="w-32 text-right font-mono font-bold tabular-nums text-amber-400">
                    {formatTime(entry.completion_time_seconds)}
                  </span>
                  <span className="hidden w-32 text-right text-xs text-gray-500 sm:block">
                    {new Date(entry.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Back to start */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => goTo("start")}
            className="flex items-center gap-2 rounded-xl border border-amber-500 bg-amber-500/10 px-8 py-3 font-bold text-amber-400 transition-all hover:bg-amber-500/20"
          >
            <Home className="h-4 w-4" />
            Back to Start
          </button>
        </div>
      </div>
    </div>
  );
}
