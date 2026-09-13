import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { useGame } from "@/lib/gameContext";

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export default function Timer() {
  const { startTime, endTime } = useGame();
  const [, force] = useState(0);

  useEffect(() => {
    if (endTime || !startTime) return;
    const interval = setInterval(() => force((n) => n + 1), 1000);
    return () => clearInterval(interval);
  }, [startTime, endTime]);

  if (!startTime) return null;

  const end = endTime ?? Date.now();
  const seconds = Math.floor((end - startTime) / 1000);

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-2 rounded-lg border border-amber-500/40 bg-gray-900/90 px-4 py-2 font-mono text-amber-400 shadow-lg backdrop-blur-sm">
      <Clock className="h-4 w-4" />
      <span className="text-lg font-bold tabular-nums tracking-wider">
        {formatTime(seconds)}
      </span>
    </div>
  );
}
