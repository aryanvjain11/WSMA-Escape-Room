import { useState, useEffect, useCallback } from "react";
import { useGame } from "@/lib/gameContext";
import RoomHeader from "@/components/RoomHeader";
import PinInput from "@/components/PinInput";
import {
  Zap,
  Monitor,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  ArrowUp,
  ArrowRight as ArrowR,
  ArrowLeft,
  ArrowDown,
  Timer as TimerIcon,
  X,
  ShieldAlert,
} from "lucide-react";
import RoomBackground from "@/components/RoomBackground";

// Laser maze: navigate a grid from start to end
// Grid is 6x6, start at (0,0), end at (5,5)
// Correct path: R, R, D, R, D, D, R, D, R
// Represented as a sequence of moves
const GRID_SIZE = 6;
const CORRECT_PATH: ("up" | "down" | "left" | "right")[] = [
  "right",
  "right",
  "down",
  "right",
  "down",
  "down",
  "right",
  "down",
  "right",
];

// Final vault code: combine clues from all rooms
// Lobby: 7, Hallway: 5, Office: 3, Safe room: 4 (alarm answer: 4x+3=19 → x=4)
// Vault code = lobby(7) + hallway(5) + office(3) + safe(4) = 7534
const VAULT_CODE = "7534";

// Alarm math problem: 4x + 3 = 19 → x = 4
const ALARM_ANSWER = "4";

// Security override: 2x² - 8 = 0 → x = 2
const OVERRIDE_ANSWER = "2";

type Position = { row: number; col: number };

function applyMove(pos: Position, move: "up" | "down" | "left" | "right"): Position {
  switch (move) {
    case "up":
      return { row: Math.max(0, pos.row - 1), col: pos.col };
    case "down":
      return { row: Math.min(GRID_SIZE - 1, pos.row + 1), col: pos.col };
    case "left":
      return { row: pos.row, col: Math.max(0, pos.col - 1) };
    case "right":
      return { row: pos.row, col: Math.min(GRID_SIZE - 1, pos.col + 1) };
  }
}

export default function SafeRoom() {
  const { goTo, addClue, completeRoom, clues } = useGame();
  const [showLaser, setShowLaser] = useState(false);
  const [showComputer, setShowComputer] = useState(false);
  const [laserSolved, setLaserSolved] = useState(false);
  const [playerPos, setPlayerPos] = useState<Position>({ row: 0, col: 0 });
  const [moveSequence, setMoveSequence] = useState<
    ("up" | "down" | "left" | "right")[]
  >([]);
  const [laserError, setLaserError] = useState(false);

  // Alarm state
  const [alarmActive, setAlarmActive] = useState(false);
  const [alarmTimeLeft, setAlarmTimeLeft] = useState(30);
  const [showAlarm, setShowAlarm] = useState(false);
  const [alarmSolved, setAlarmSolved] = useState(false);
  const [alarmError, setAlarmError] = useState(false);
  const [showOverride, setShowOverride] = useState(false);
  const [overrideError, setOverrideError] = useState(false);

  // Vault code
  const [vaultUnlocked, setVaultUnlocked] = useState(false);
  const [vaultError, setVaultError] = useState(false);

  const handleMove = useCallback(
    (move: "up" | "down" | "left" | "right") => {
      if (laserSolved) return;
      const newPos = applyMove(playerPos, move);
      const newSeq = [...moveSequence, move];
      setPlayerPos(newPos);
      setMoveSequence(newSeq);

      // Check if the sequence so far matches the correct path
      const matchesSoFar = newSeq.every(
        (m, i) => m === CORRECT_PATH[i]
      );

      if (!matchesSoFar) {
        setLaserError(true);
        setTimeout(() => {
          setPlayerPos({ row: 0, col: 0 });
          setMoveSequence([]);
          setLaserError(false);
        }, 1000);
        return;
      }

      // Check if we've completed the path
      if (newSeq.length === CORRECT_PATH.length) {
        setLaserSolved(true);
      }
    },
    [playerPos, moveSequence, laserSolved]
  );

  // Alarm countdown
  useEffect(() => {
    if (!alarmActive || alarmSolved) return;
    if (alarmTimeLeft <= 0) {
      setShowOverride(true);
      setAlarmActive(false);
      return;
    }
    const timer = setTimeout(() => {
      setAlarmTimeLeft((t) => t - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [alarmActive, alarmTimeLeft, alarmSolved]);

  const handleAlarmSubmit = (value: string) => {
    if (value === ALARM_ANSWER) {
      setAlarmSolved(true);
      setAlarmActive(false);
      setShowAlarm(false);
      setAlarmError(false);
    } else {
      setAlarmError(true);
      setTimeout(() => setAlarmError(false), 1500);
    }
  };

  const handleOverrideSubmit = (value: string) => {
    if (value === OVERRIDE_ANSWER) {
      setAlarmSolved(true);
      setAlarmActive(false);
      setShowOverride(false);
      setShowAlarm(false);
      setOverrideError(false);
    } else {
      setOverrideError(true);
      setTimeout(() => setOverrideError(false), 1500);
    }
  };

  const handleVaultSubmit = (value: string) => {
    if (value === VAULT_CODE) {
      setVaultUnlocked(true);
      setVaultError(false);
    } else {
      setVaultError(true);
      setTimeout(() => setVaultError(false), 1500);
    }
  };

  const handleProceed = () => {
    addClue({
      room: "safe",
      label: "Safe Room Clue",
      value: ALARM_ANSWER,
      description: "The alarm answer (x from 4x + 3 = 19)",
    });
    completeRoom("safe");
    goTo("vault");
  };

  const triggerAlarm = () => {
    setAlarmActive(true);
    setAlarmTimeLeft(30);
    setShowAlarm(true);
  };

  const canProceed = laserSolved && vaultUnlocked && alarmSolved;

  return (
    <div className="relative min-h-screen bg-gray-950 px-4 py-6 sm:px-8">
      <RoomBackground
        image="https://images.pexels.com/photos/18545023/pexels-photo-18545023.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
        overlay="from-gray-950/95 via-gray-950/80 to-gray-950/95"
      />
      <RoomHeader
        title="Pre-Vault Safe Room"
        subtitle="A laser grid blocks access to the vault computer."
      />

      <div className="relative z-10 mx-auto max-w-4xl">
        {/* Scene */}
        <div className="grid gap-6 sm:grid-cols-2">
          {/* Laser Maze */}
          <button
            onClick={() => setShowLaser(true)}
            className="group relative flex flex-col items-center justify-center overflow-hidden rounded-xl border border-red-500/30 bg-gradient-to-br from-gray-800 to-gray-900 p-8 shadow-lg transition-all hover:scale-105 hover:border-red-400"
          >
            <div className="absolute inset-0 opacity-30 transition-opacity group-hover:opacity-50">
              <img src="https://images.pexels.com/photos/18545023/pexels-photo-18545023.jpeg?auto=compress&cs=tinysrgb&h=650&w=940" alt="" className="h-full w-full object-cover" />
            </div>
            {laserSolved ? (
              <CheckCircle2 className="relative z-10 mb-2 h-10 w-10 text-green-500" />
            ) : (
              <Zap className="relative z-10 mb-2 h-10 w-10 text-red-400 group-hover:text-amber-400" />
            )}
            <span className="relative z-10 text-sm font-semibold text-gray-300">
              Laser Maze
            </span>
            <span className="relative z-10 mt-1 text-xs text-gray-500">
              {laserSolved ? "Disabled" : "Navigate the grid"}
            </span>
          </button>

          {/* Vault Computer */}
          <button
            onClick={() => {
              if (laserSolved) {
                setShowComputer(true);
                if (!alarmActive && !alarmSolved) {
                  triggerAlarm();
                }
              }
            }}
            disabled={!laserSolved}
            className={`group relative flex flex-col items-center justify-center overflow-hidden rounded-xl border p-8 shadow-lg transition-all ${
              laserSolved
                ? "border-gray-700 bg-gradient-to-br from-gray-800 to-gray-900 hover:scale-105 hover:border-amber-500/50"
                : "cursor-not-allowed border-gray-800 bg-gray-900/50 opacity-50"
            }`}
          >
            {laserSolved && (
              <div className="absolute inset-0 opacity-25 transition-opacity group-hover:opacity-40">
                <img src="https://images.pexels.com/photos/19882101/pexels-photo-19882101.jpeg?auto=compress&cs=tinysrgb&h=650&w=940" alt="" className="h-full w-full object-cover" />
              </div>
            )}
            {vaultUnlocked ? (
              <CheckCircle2 className="relative z-10 mb-2 h-10 w-10 text-green-500" />
            ) : (
              <Monitor className="relative z-10 mb-2 h-10 w-10 text-gray-500 group-hover:text-amber-400" />
            )}
            <span className="relative z-10 text-sm font-semibold text-gray-300">
              Vault Computer
            </span>
            <span className="relative z-10 mt-1 text-xs text-gray-500">
              {vaultUnlocked
                ? "Unlocked"
                : laserSolved
                ? "Enter the code"
                : "Disabled by laser"}
            </span>
          </button>
        </div>

        {/* Clues summary */}
        <div className="mt-8 rounded-xl border border-amber-500/20 bg-gray-900/50 p-4">
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-amber-400">
            Clues So Far
          </h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { room: "lobby", label: "Lobby", value: "7" },
              { room: "office", label: "Office", value: "3" },
              { room: "hallway", label: "Hallway", value: "5" },
              { room: "safe", label: "Safe Room", value: alarmSolved ? ALARM_ANSWER : "?" }
            ].map((c) => (
              <div
                key={c.room}
                className="rounded-lg border border-gray-700 bg-gray-800 p-3 text-center"
              >
                <p className="text-xs text-gray-500">{c.label}</p>
                <p className="mt-1 font-mono text-2xl font-bold text-amber-400">
                  {clues[c.room]?.value ?? c.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Status */}
        <div className="mt-6 space-y-3">
          {!laserSolved && (
            <div className="flex items-center gap-2 rounded-lg border border-gray-800 bg-gray-900/50 px-4 py-3 text-sm text-gray-500">
              <AlertTriangle className="h-4 w-4" />
              Disable the laser maze first to access the vault computer.
            </div>
          )}
          {laserSolved && !vaultUnlocked && !alarmActive && !alarmSolved && (
            <div className="flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/5 px-4 py-3 text-sm text-amber-400">
              <AlertTriangle className="h-4 w-4" />
              Access the vault computer to enter the code.
            </div>
          )}
          {alarmActive && (
            <div className="flex items-center gap-2 rounded-lg border border-red-500/50 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              <ShieldAlert className="h-4 w-4 animate-pulse" />
              ALARM ACTIVE! {alarmTimeLeft}s until lockdown!
            </div>
          )}
        </div>

        {/* Proceed */}
        {canProceed && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={handleProceed}
              className="group flex items-center gap-3 rounded-xl border border-amber-500 bg-amber-500/10 px-8 py-4 font-bold text-amber-400 transition-all hover:bg-amber-500 hover:text-gray-950 hover:shadow-[0_0_30px_rgba(245,158,11,0.4)]"
            >
              Enter the Vault
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        )}
      </div>

      {/* Laser Maze Modal */}
      {showLaser && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => setShowLaser(false)}
        >
          <div
            className="relative w-full max-w-lg rounded-2xl border border-amber-500/30 bg-gray-900 p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowLaser(false)}
              className="absolute right-4 top-4 text-gray-500 hover:text-amber-400"
            >
              <X className="h-5 w-5" />
            </button>
            <h2 className="mb-4 font-serif text-xl font-bold text-amber-400">
              Laser Maze
            </h2>
            {laserSolved ? (
              <div className="space-y-4 text-center">
                <CheckCircle2 className="mx-auto h-16 w-16 text-green-500" />
                <p className="text-gray-300">
                  Laser system disabled! You can now access the vault computer.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-center text-sm text-gray-400">
                  Navigate from the top-left corner to the bottom-right.
                  Use the arrow buttons. One wrong move resets the maze.
                </p>
                {/* Grid */}
                <div className="flex justify-center">
                  <div
                    className="grid gap-1"
                    style={{
                      gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
                    }}
                  >
                    {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
                      const row = Math.floor(i / GRID_SIZE);
                      const col = i % GRID_SIZE;
                      const isPlayer = playerPos.row === row && playerPos.col === col;
                      const isStart = row === 0 && col === 0;
                      const isEnd = row === GRID_SIZE - 1 && col === GRID_SIZE - 1;
                      return (
                        <div
                          key={i}
                          className={`flex h-10 w-10 items-center justify-center rounded border-2 text-xs ${
                            isPlayer
                              ? laserError
                                ? "border-red-500 bg-red-500/40"
                                : "border-amber-500 bg-amber-500/40"
                              : isEnd
                              ? "border-green-500/50 bg-green-500/10"
                              : isStart
                              ? "border-blue-500/50 bg-blue-500/10"
                              : "border-gray-700 bg-gray-800"
                          }`}
                        >
                          {isPlayer ? "●" : isEnd ? "★" : isStart ? "S" : ""}
                        </div>
                      );
                    })}
                  </div>
                </div>
                {/* Move counter */}
                <p className="text-center text-xs text-gray-500">
                  Moves: {moveSequence.length} / {CORRECT_PATH.length}
                </p>
                {/* Controls */}
                <div className="mx-auto flex max-w-[200px] flex-col items-center gap-2">
                  <button
                    onClick={() => handleMove("up")}
                    className="rounded-lg border border-gray-700 bg-gray-800 p-3 text-gray-300 transition-all hover:border-amber-500 hover:text-amber-400 active:scale-95"
                  >
                    <ArrowUp className="h-5 w-5" />
                  </button>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleMove("left")}
                      className="rounded-lg border border-gray-700 bg-gray-800 p-3 text-gray-300 transition-all hover:border-amber-500 hover:text-amber-400 active:scale-95"
                    >
                      <ArrowLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleMove("down")}
                      className="rounded-lg border border-gray-700 bg-gray-800 p-3 text-gray-300 transition-all hover:border-amber-500 hover:text-amber-400 active:scale-95"
                    >
                      <ArrowDown className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleMove("right")}
                      className="rounded-lg border border-gray-700 bg-gray-800 p-3 text-gray-300 transition-all hover:border-amber-500 hover:text-amber-400 active:scale-95"
                    >
                      <ArrowR className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                {laserError && (
                  <p className="text-center text-sm text-red-400">
                    Wrong move! Maze reset.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Vault Computer Modal */}
      {showComputer && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => setShowComputer(false)}
        >
          <div
            className="relative w-full max-w-lg rounded-2xl border border-amber-500/30 bg-gray-900 p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowComputer(false)}
              className="absolute right-4 top-4 text-gray-500 hover:text-amber-400"
            >
              <X className="h-5 w-5" />
            </button>
            <h2 className="mb-4 font-serif text-xl font-bold text-amber-400">
              Vault Computer
            </h2>
            {vaultUnlocked ? (
              <div className="space-y-4 text-center">
                <CheckCircle2 className="mx-auto h-16 w-16 text-green-500" />
                <p className="text-gray-300">
                  Vault access granted! Proceed to the vault.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="rounded-lg border border-gray-800 bg-gray-950 p-4">
                  <p className="mb-2 font-mono text-sm text-green-400">
                    &gt; VAULT ACCESS PROTOCOL
                  </p>
                  <p className="text-sm text-gray-300">
                    Combine the clues from each room to form the vault code:
                  </p>
                  <div className="mt-3 space-y-1 text-sm text-gray-400">
                    <p>
                      Lobby clue (digit 1):{" "}
                      <span className="font-mono text-amber-400">
                        {clues.lobby?.value ?? "7"}
                      </span>
                    </p>
                    <p>
                      Hallway clue (digit 2):{" "}
                      <span className="font-mono text-amber-400">
                        {clues.hallway?.value ?? "9"}
                      </span>
                    </p>
                    <p>
                      Office clue (digit 3):{" "}
                      <span className="font-mono text-amber-400">
                        {clues.office?.value ?? "3"}
                      </span>
                    </p>
                    <p>
                      Safe room clue (digit 4):{" "}
                      <span className="font-mono text-amber-400">
                        {alarmSolved ? ALARM_ANSWER : "Solve the alarm first!"}
                      </span>
                    </p>
                  </div>
                  <p className="mt-3 text-sm text-gray-300">
                    Arrange: digit1, digit2, digit3, digit4
                  </p>
                </div>
                <PinInput
                  length={4}
                  onSubmit={handleVaultSubmit}
                  hint={
                    vaultError
                      ? "Incorrect code. Try again."
                      : "Enter the 4-digit vault code"
                  }
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Alarm Modal */}
      {showAlarm && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-red-950/80 p-4 backdrop-blur-sm"
        >
          <div className="w-full max-w-md rounded-2xl border-2 border-red-500 bg-gray-900 p-6 shadow-2xl">
            <div className="mb-4 flex items-center gap-3">
              <ShieldAlert className="h-8 w-8 animate-pulse text-red-500" />
              <h2 className="font-serif text-2xl font-bold text-red-400">
                SECURITY ALARM
              </h2>
            </div>
            <div className="mb-4 flex items-center justify-center gap-2">
              <TimerIcon className="h-6 w-6 text-red-400" />
              <span className="font-mono text-4xl font-bold text-red-400">
                {alarmTimeLeft.toString().padStart(2, "0")}
              </span>
              <span className="text-sm text-red-400">seconds</span>
            </div>
            <p className="mb-4 text-center text-sm text-gray-300">
              Solve this equation to disable the alarm before lockdown:
            </p>
            <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/5 p-4 text-center">
              <p className="font-mono text-xl text-amber-400">4x + 3 = 19</p>
              <p className="mt-1 text-xs text-gray-500">Find x</p>
            </div>
            <PinInput
              length={1}
              onSubmit={handleAlarmSubmit}
              hint={
                alarmError
                  ? "Wrong answer! Hurry!"
                  : "Enter the value of x"
              }
            />
          </div>
        </div>
      )}

      {/* Security Override Modal */}
      {showOverride && !alarmSolved && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
        >
          <div className="w-full max-w-md rounded-2xl border-2 border-amber-500 bg-gray-900 p-6 shadow-2xl">
            <div className="mb-4 flex items-center gap-3">
              <AlertTriangle className="h-8 w-8 text-amber-400" />
              <h2 className="font-serif text-2xl font-bold text-amber-400">
                Security Override
              </h2>
            </div>
            <p className="mb-4 text-center text-sm text-gray-300">
              The alarm timed out, but you get one more chance. Solve this
              equation:
            </p>
            <div className="mb-4 rounded-lg border border-amber-500/30 bg-amber-500/5 p-4 text-center">
              <p className="font-mono text-xl text-amber-400">2x² - 8 = 0</p>
              <p className="mt-1 text-xs text-gray-500">
                Find the positive value of x
              </p>
            </div>
            <PinInput
              length={1}
              onSubmit={handleOverrideSubmit}
              hint={
                overrideError
                  ? "Wrong answer! Try again."
                  : "Enter the positive value of x"
              }
            />
          </div>
        </div>
      )}
    </div>
  );
}
