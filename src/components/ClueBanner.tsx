import { useGame } from "@/lib/gameContext";
import { Lightbulb } from "lucide-react";

export default function ClueBanner() {
  const { clues } = useGame();
  const collected = Object.values(clues);

  if (collected.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 max-w-xs">
      <div className="rounded-lg border border-amber-500/30 bg-gray-900/90 p-3 shadow-lg backdrop-blur-sm">
        <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-amber-400">
          <Lightbulb className="h-3 w-3" />
          Clues Collected ({collected.length})
        </div>
        <div className="space-y-1">
          {collected.map((clue) => (
            <div key={clue.room} className="text-xs text-gray-300">
              <span className="font-semibold text-gray-200">{clue.label}:</span>{" "}
              <span className="font-mono text-amber-300">{clue.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
