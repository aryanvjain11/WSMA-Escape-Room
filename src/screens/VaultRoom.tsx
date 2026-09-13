import { useState } from "react";
import { useGame } from "@/lib/gameContext";
import RoomHeader from "@/components/RoomHeader";
import {
  Triangle,
  Square,
  Hexagon,
  Circle,
  Star,
  CheckCircle2,
  Trophy,
  ArrowRight,
  X,
  Sparkles,
  Lock,
} from "lucide-react";
import RoomBackground from "@/components/RoomBackground";

// Symbols scattered in the vault room:
// Triangle (3 sides) → 3
// Square (4 sides) → 4
// Hexagon (6 sides) → 6
// Circle (infinite/0 sides, but we use 1 for this puzzle) → 1
// Star (5 points) → 5

// Logic puzzle: arrange the 5 numbers in order based on clues
// Numbers: 3, 4, 6, 1, 5
// Clues:
// 1. The triangle (3) comes before the square (4)
// 2. The star (5) is in the middle
// 3. The circle (1) comes last
// 4. The hexagon (6) comes first
// 5. The square (4) comes before the star (5)
//
// Solution: 6, 3, 5, 4, 1 → but wait, check clue 1: 3 before 4 ✓
// clue 2: 5 in middle (position 3) ✓
// clue 3: 1 last ✓
// clue 4: 6 first ✓
// clue 5: 4 before 5 → 4 is position 4, 5 is position 3 → 4 after 5 ✗
//
// Let me redo: 4 before 5, and 5 is in the middle (position 3)
// So 4 must be position 1 or 2, but 6 is first → 4 is position 2
// 3 before 4 → 3 must be before position 2, but 6 is position 1
// So 3 can't be before 4 if 6 is first and 4 is second...
// Unless 3 is position 1? But 6 is first.
//
// Let me reconsider. Maybe 4 is position 2, 3 is position... 
// Actually 3 before 4 and 4 before 5, and 5 is in middle (pos 3 of 5)
// So order: _, 4, 5, _, 1 (1 is last)
// 3 before 4 → 3 is pos 1, but 6 is first → contradiction
//
// Let me adjust: 6 first, then 3, then 5, then 4, then 1
// Check: 3 before 4 ✓, 5 in middle (pos 3) ✓, 1 last ✓, 6 first ✓, 4 before 5 → pos 4 before pos 3 ✗
//
// New approach: 6, 4, 5, 3, 1
// 3 before 4 → pos 4 before pos 2 ✗
//
// OK let me just design it cleanly:
// Order: 6, 3, 4, 5, 1
// Clue 1: 3 before 4 ✓ (pos 2 before pos 3)
// Clue 2: 5 in the middle → pos 4 of 5, not middle ✗
//
// 5 items, middle = position 3
// Order: 6, 3, 5, 4, 1
// Clue 1: 3 before 4 ✓ (pos 2 before pos 4)
// Clue 2: 5 in middle ✓ (pos 3)
// Clue 3: 1 last ✓ (pos 5)
// Clue 4: 6 first ✓ (pos 1)
// Clue 5: 4 before 5 → pos 4 before pos 3 ✗
//
// Fix: change clue 5 to "The star (5) comes before the square (4)"
// Order: 6, 3, 5, 4, 1
// 5 before 4 → pos 3 before pos 4 ✓
// All clues pass!

const CORRECT_ORDER = [6, 3, 5, 4, 1];

const SYMBOLS = [
  { id: "hexagon", value: 6, icon: Hexagon, name: "Hexagon", sides: "6 sides" },
  { id: "triangle", value: 3, icon: Triangle, name: "Triangle", sides: "3 sides" },
  { id: "star", value: 5, icon: Star, name: "Star", sides: "5 points" },
  { id: "square", value: 4, icon: Square, name: "Square", sides: "4 sides" },
  { id: "circle", value: 1, icon: Circle, name: "Circle", sides: "1 (unity)" },
];

const CLUES = [
  "The triangle (3) comes before the square (4).",
  "The star (5) is in the middle position.",
  "The circle (1) comes last.",
  "The hexagon (6) comes first.",
  "The star (5) comes before the square (4).",
];

export default function VaultRoom() {
  const { finishGame, addClue, completeRoom } = useGame();
  const [collected, setCollected] = useState<Set<string>>(new Set());
  const [showPuzzle, setShowPuzzle] = useState(false);
  const [arrangement, setArrangement] = useState<number[]>([]);
  const [puzzleError, setPuzzleError] = useState(false);
  const [solved, setSolved] = useState(false);

  const allCollected = collected.size === SYMBOLS.length;

  const collectSymbol = (id: string) => {
    setCollected((prev) => new Set(prev).add(id));
  };

  const addToArrangement = (value: number) => {
    if (arrangement.includes(value)) return;
    if (arrangement.length >= 5) return;
    setArrangement((prev) => [...prev, value]);
  };

  const removeFromArrangement = (index: number) => {
    setArrangement((prev) => prev.filter((_, i) => i !== index));
  };

  const checkArrangement = () => {
    if (
      arrangement.length === 5 &&
      arrangement.every((v, i) => v === CORRECT_ORDER[i])
    ) {
      setSolved(true);
      setPuzzleError(false);
      addClue({
        room: "vault",
        label: "Vault Clue",
        value: "5",
        description: "Final digit from the vault logic puzzle",
      });
      completeRoom("vault");
    } else {
      setPuzzleError(true);
      setTimeout(() => setPuzzleError(false), 1500);
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-950 px-4 py-6 sm:px-8">
      <RoomBackground
        image="https://images.pexels.com/photos/23322329/pexels-photo-23322329.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
        overlay="from-gray-950/95 via-gray-950/75 to-gray-950/95"
      />
      {/* Vault ambient glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/10 blur-[120px]" />

      <RoomHeader
        title="The Vault"
        subtitle="The final room. Collect symbols and solve the logic puzzle to crack the vault."
      />

      <div className="relative z-10 mx-auto max-w-4xl">
        {/* Symbol collection area */}
        <div className="mb-8">
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-amber-400">
            Collect Symbols ({collected.size}/{SYMBOLS.length})
          </h3>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
            {SYMBOLS.map((sym) => {
              const isCollected = collected.has(sym.id);
              const Icon = sym.icon;
              return (
                <button
                  key={sym.id}
                  onClick={() => collectSymbol(sym.id)}
                  disabled={isCollected}
                  className={`group relative flex flex-col items-center justify-center overflow-hidden rounded-xl border p-6 shadow-lg transition-all ${
                    isCollected
                      ? "border-green-500/50 bg-green-500/10"
                      : "border-gray-700 bg-gradient-to-br from-gray-800 to-gray-900 hover:scale-105 hover:border-amber-500/50"
                  }`}
                >
                  {!isCollected && (
                    <img
                      src="https://images.pexels.com/photos/8442330/pexels-photo-8442330.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover opacity-20 transition-opacity group-hover:opacity-30"
                    />
                  )}
                  {isCollected ? (
                    <CheckCircle2 className="relative z-10 mb-2 h-10 w-10 text-green-500" />
                  ) : (
                    <Icon className="relative z-10 mb-2 h-10 w-10 text-gray-500 group-hover:text-amber-400" />
                  )}
                  <span className="relative z-10 text-xs font-semibold text-gray-300">
                    {sym.name}
                  </span>
                  {isCollected && (
                    <span className="relative z-10 mt-1 font-mono text-lg font-bold text-amber-400">
                      {sym.value}
                    </span>
                  )}
                  {!isCollected && (
                    <span className="relative z-10 mt-1 text-xs text-gray-500">
                      {sym.sides}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Puzzle button */}
        {allCollected && !solved && (
          <div className="flex justify-center">
            <button
              onClick={() => setShowPuzzle(true)}
              className="flex items-center gap-3 rounded-xl border border-amber-500 bg-amber-500/10 px-8 py-4 font-bold text-amber-400 transition-all hover:bg-amber-500/20"
            >
              <Lock className="h-5 w-5" />
              Solve the Logic Puzzle
            </button>
          </div>
        )}

        {/* Status */}
        <div className="mt-6 space-y-3">
          {!allCollected && (
            <div className="flex items-center gap-2 rounded-lg border border-gray-800 bg-gray-900/50 px-4 py-3 text-sm text-gray-500">
              <Sparkles className="h-4 w-4" />
              Collect all 5 symbols. Each shape's number of sides tells you its
              value.
            </div>
          )}
        </div>

        {/* Victory */}
        {solved && (
          <div className="mt-8 flex flex-col items-center gap-6">
            <div className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-amber-500 bg-amber-500/10 shadow-[0_0_40px_rgba(245,158,11,0.3)]">
              <Trophy className="h-12 w-12 text-amber-400" />
            </div>
            <h2 className="font-serif text-3xl font-bold text-amber-400">
              VAULT CRACKED
            </h2>
            <p className="text-center text-gray-400">
              The vault door swings open. You've completed the heist!
            </p>
            <button
              onClick={finishGame}
              className="group flex items-center gap-3 rounded-xl border border-amber-500 bg-amber-500/10 px-8 py-4 font-bold text-amber-400 transition-all hover:bg-amber-500 hover:text-gray-950 hover:shadow-[0_0_30px_rgba(245,158,11,0.4)]"
            >
              Claim Your Prize
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        )}
      </div>

      {/* Logic Puzzle Modal */}
      {showPuzzle && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => !solved && setShowPuzzle(false)}
        >
          <div
            className="relative w-full max-w-2xl rounded-2xl border border-amber-500/30 bg-gray-900 p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowPuzzle(false)}
              className="absolute right-4 top-4 text-gray-500 hover:text-amber-400"
            >
              <X className="h-5 w-5" />
            </button>
            <h2 className="mb-4 font-serif text-xl font-bold text-amber-400">
              Vault Logic Puzzle
            </h2>

            {solved ? (
              <div className="space-y-4 text-center">
                <CheckCircle2 className="mx-auto h-16 w-16 text-green-500" />
                <p className="text-gray-300">
                  The correct order is: {CORRECT_ORDER.join(" → ")}
                </p>
                <p className="text-sm text-amber-400">
                  The vault is unlocked!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Clues */}
                <div className="rounded-lg border border-gray-800 bg-gray-950 p-4">
                  <p className="mb-2 text-sm font-bold text-gray-300">
                    Clues:
                  </p>
                  <ul className="space-y-1">
                    {CLUES.map((clue, i) => (
                      <li key={i} className="text-sm text-gray-400">
                        {i + 1}. {clue}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Arrangement slots */}
                <div>
                  <p className="mb-2 text-sm font-bold text-gray-300">
                    Arrange the numbers in order:
                  </p>
                  <div className="flex justify-center gap-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() =>
                          arrangement[i] !== undefined &&
                          removeFromArrangement(i)
                        }
                        className={`flex h-14 w-14 items-center justify-center rounded-lg border-2 font-mono text-2xl font-bold transition-all ${
                          arrangement[i] !== undefined
                            ? puzzleError
                              ? "border-red-500 bg-red-500/20 text-red-400"
                              : "border-amber-500 bg-amber-500/10 text-amber-400"
                            : "border-gray-700 bg-gray-800 text-gray-600"
                        }`}
                      >
                        {arrangement[i] ?? "•"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Available numbers */}
                <div>
                  <p className="mb-2 text-sm font-bold text-gray-300">
                    Available numbers (click to add):
                  </p>
                  <div className="flex justify-center gap-2">
                    {SYMBOLS.map((sym) => {
                      const used = arrangement.includes(sym.value);
                      return (
                        <button
                          key={sym.id}
                          onClick={() => addToArrangement(sym.value)}
                          disabled={used}
                          className={`flex h-12 w-12 items-center justify-center rounded-lg border font-mono text-lg font-bold transition-all ${
                            used
                              ? "border-gray-800 bg-gray-800/50 text-gray-600 opacity-30"
                              : "border-gray-700 bg-gray-800 text-gray-200 hover:border-amber-500 hover:text-amber-400"
                          }`}
                        >
                          {sym.value}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {puzzleError && (
                  <p className="text-center text-sm text-red-400">
                    Incorrect order. Try again!
                  </p>
                )}

                <button
                  onClick={checkArrangement}
                  disabled={arrangement.length !== 5}
                  className={`w-full rounded-lg border py-3 font-bold transition-all ${
                    arrangement.length === 5
                      ? "border-amber-500 bg-amber-500/20 text-amber-400 hover:bg-amber-500/30"
                      : "cursor-not-allowed border-gray-800 bg-gray-800/50 text-gray-600"
                  }`}
                >
                  Submit Order
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
