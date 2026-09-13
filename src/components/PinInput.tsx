import { useState, type KeyboardEvent } from "react";
import { Delete } from "lucide-react";

type PinInputProps = {
  length: number;
  onSubmit: (value: string) => void;
  hint?: string;
  digitFeedback?: (digit: string, index: number) => "correct" | "wrong" | null;
};

export default function PinInput({
  length,
  onSubmit,
  hint,
  digitFeedback,
}: PinInputProps) {
  const [value, setValue] = useState("");

  const handleKey = (key: string) => {
    if (key === "del") {
      setValue((v) => v.slice(0, -1));
    } else if (key === "enter") {
      onSubmit(value);
    } else if (value.length < length) {
      setValue((v) => v + key);
    }
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key >= "0" && e.key <= "9") handleKey(e.key);
    else if (e.key === "Backspace") handleKey("del");
    else if (e.key === "Enter") handleKey("enter");
  };

  return (
    <div className="flex flex-col items-center gap-4" tabIndex={0} onKeyDown={onKeyDown}>
      {hint && (
        <p className="text-center text-sm text-gray-400">{hint}</p>
      )}
      <div className="flex gap-2">
        {Array.from({ length }).map((_, i) => {
          const digit = value[i] ?? "";
          const feedback = value[i] ? digitFeedback?.(value[i], i) : null;
          return (
            <div
              key={i}
              className={`flex h-14 w-12 items-center justify-center rounded-lg border-2 font-mono text-2xl font-bold transition-all ${
                feedback === "correct"
                  ? "border-green-500 bg-green-500/20 text-green-400"
                  : feedback === "wrong"
                  ? "border-red-500 bg-red-500/20 text-red-400"
                  : digit
                  ? "border-amber-500 bg-amber-500/10 text-amber-400"
                  : "border-gray-700 bg-gray-800 text-gray-600"
              }`}
            >
              {digit || "•"}
            </div>
          );
        })}
      </div>
      <div className="grid grid-cols-3 gap-2">
        {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((n) => (
          <button
            key={n}
            onClick={() => handleKey(n)}
            className="h-12 w-12 rounded-lg border border-gray-700 bg-gray-800 font-mono text-lg font-bold text-gray-200 transition-all hover:border-amber-500 hover:bg-amber-500/10 hover:text-amber-400 active:scale-95"
          >
            {n}
          </button>
        ))}
        <button
          onClick={() => handleKey("del")}
          className="h-12 w-12 rounded-lg border border-gray-700 bg-gray-800 text-gray-400 transition-all hover:border-red-500 hover:text-red-400 active:scale-95"
        >
          <Delete className="mx-auto h-5 w-5" />
        </button>
        <button
          onClick={() => handleKey("0")}
          className="h-12 w-12 rounded-lg border border-gray-700 bg-gray-800 font-mono text-lg font-bold text-gray-200 transition-all hover:border-amber-500 hover:bg-amber-500/10 hover:text-amber-400 active:scale-95"
        >
          0
        </button>
        <button
          onClick={() => handleKey("enter")}
          className="h-12 w-12 rounded-lg border border-amber-500 bg-amber-500/20 font-bold text-amber-400 transition-all hover:bg-amber-500/30 active:scale-95"
        >
          OK
        </button>
      </div>
    </div>
  );
}
