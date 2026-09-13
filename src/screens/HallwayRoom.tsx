import { useState } from "react";
import { useGame } from "@/lib/gameContext";
import RoomHeader from "@/components/RoomHeader";
import {
  Frame,
  Grid3x3,
  DoorOpen,
  CheckCircle2,
  ArrowRight,
  AlertCircle,
  X,
} from "lucide-react";
import RoomBackground from "@/components/RoomBackground";

// System of equations:
// 2x + y = 7  →  y = 7 - 2x
// x - y = -1  →  y = x + 1
// Solving: 7 - 2x = x + 1  →  6 = 3x  →  x = 2, y = 3
const SOLUTION_X = 2;
const SOLUTION_Y = 3;
// Tile sequence: click tiles at (x=2, y=3) — but we make it a path
// The correct sequence is tiles at positions: (0,0), (1,1), (2,2), (2,3), (3,3)
// Actually simpler: the grid is 5x5, click tiles at column x=2, row y=3
// Let's make it: click tile (2,3) then tile (3,2) — representing (x,y) and (y,x)
// Even simpler: the solutions are x=2, y=3. Click the tile at row 3, column 2.
const CORRECT_TILE = { row: 3, col: 2 };

// The riddle says: "The door with the number equal to x + y opens."
// x + y = 2 + 3 = 5
const CORRECT_DOOR = 5;

export default function HallwayRoom() {
  const { goTo, addClue, completeRoom } = useGame();
  const [showPainting, setShowPainting] = useState(false);
  const [showTilePanel, setShowTilePanel] = useState(false);
  const [paintingOpened, setPaintingOpened] = useState(false);
  const [panelRevealed, setPanelRevealed] = useState(false);
  const [tileSolved, setTileSolved] = useState(false);
  const [clickedTiles, setClickedTiles] = useState<
    Record<string, boolean>
  >({});
  const [tileError, setTileError] = useState(false);
  const [selectedDoor, setSelectedDoor] = useState<number | null>(null);
  const [doorError, setDoorError] = useState(false);

  const handleTileClick = (row: number, col: number) => {
    const key = `${row}-${col}`;
    if (clickedTiles[key]) return;

    if (row === CORRECT_TILE.row && col === CORRECT_TILE.col) {
      setClickedTiles((prev) => ({ ...prev, [key]: true }));
      setTileSolved(true);
      setTileError(false);
      setPanelRevealed(true);
    } else {
      setClickedTiles((prev) => ({ ...prev, [key]: true }));
      setTileError(true);
      setTimeout(() => {
        setClickedTiles((prev) => {
          const next = { ...prev };
          delete next[key];
          return next;
        });
        setTileError(false);
      }, 1000);
    }
  };

  const handleDoorSelect = (door: number) => {
    setSelectedDoor(door);
    if (door === CORRECT_DOOR) {
      setDoorError(false);
    } else {
      setDoorError(true);
      setTimeout(() => {
        setSelectedDoor(null);
        setDoorError(false);
      }, 1500);
    }
  };

  const handleProceed = () => {
    addClue({
      room: "hallway",
      label: "Hallway Clue",
      value: String(CORRECT_DOOR),
      description: "The correct door number (x + y = 5)",
    });
    completeRoom("hallway");
    goTo("safe");
  };

  const canProceed = tileSolved && selectedDoor === CORRECT_DOOR;

  return (
    <div className="relative min-h-screen bg-gray-950 px-4 py-6 sm:px-8">
      <RoomBackground
        image="https://images.pexels.com/photos/18192551/pexels-photo-18192551.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
        overlay="from-gray-950/95 via-gray-950/85 to-gray-950/95"
      />
      <RoomHeader
        title="The Hallway"
        subtitle="A long corridor with a painting on the wall and several doors."
      />

      <div className="relative z-10 mx-auto max-w-4xl">
        {/* Hallway scene */}
        <div className="grid gap-6 sm:grid-cols-2">
          {/* Painting */}
          <button
            onClick={() => setShowPainting(true)}
            className="group relative flex flex-col items-center justify-center overflow-hidden rounded-xl border border-gray-700 bg-gradient-to-br from-gray-800 to-gray-900 p-8 shadow-lg transition-all hover:scale-105 hover:border-amber-500/50"
          >
            <div className="absolute inset-0 opacity-30 transition-opacity group-hover:opacity-45">
              <img src="https://images.pexels.com/photos/26605624/pexels-photo-26605624.jpeg?auto=compress&cs=tinysrgb&h=650&w=940" alt="" className="h-full w-full object-cover" />
            </div>
            {paintingOpened ? (
              <CheckCircle2 className="relative z-10 mb-2 h-10 w-10 text-green-500" />
            ) : (
              <Frame className="relative z-10 mb-2 h-10 w-10 text-gray-500 group-hover:text-amber-400" />
            )}
            <span className="relative z-10 text-sm font-semibold text-gray-300">
              Painting
            </span>
            <span className="relative z-10 mt-1 text-xs text-gray-500">
              {paintingOpened ? "Examined" : "Look behind it"}
            </span>
          </button>

          {/* Floor Panel */}
          <button
            onClick={() => setShowTilePanel(true)}
            disabled={!panelRevealed}
            className={`group relative flex flex-col items-center justify-center overflow-hidden rounded-xl border p-8 shadow-lg transition-all ${
              panelRevealed
                ? "border-gray-700 bg-gradient-to-br from-gray-800 to-gray-900 hover:scale-105 hover:border-amber-500/50"
                : "cursor-not-allowed border-gray-800 bg-gray-900/50 opacity-50"
            }`}
          >
            {panelRevealed && (
              <div className="absolute inset-0 opacity-25 transition-opacity group-hover:opacity-40">
                <img src="https://images.pexels.com/photos/5412637/pexels-photo-5412637.jpeg?auto=compress&cs=tinysrgb&h=650&w=940" alt="" className="h-full w-full object-cover" />
              </div>
            )}
            {tileSolved ? (
              <CheckCircle2 className="relative z-10 mb-2 h-10 w-10 text-green-500" />
            ) : (
              <Grid3x3 className="relative z-10 mb-2 h-10 w-10 text-gray-500 group-hover:text-amber-400" />
            )}
            <span className="relative z-10 text-sm font-semibold text-gray-300">
              Floor Panel
            </span>
            <span className="relative z-10 mt-1 text-xs text-gray-500">
              {panelRevealed
                ? tileSolved
                  ? "Solved"
                  : "Tile grid"
                : "Not yet revealed"}
            </span>
          </button>
        </div>

        {/* Doors */}
        {tileSolved && (
          <div className="mt-8">
            <h3 className="mb-4 text-center text-sm font-bold uppercase tracking-wide text-amber-400">
              Choose the correct door
            </h3>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
              {[1, 2, 3, 4, 5, 6].map((door) => (
                <button
                  key={door}
                  onClick={() => handleDoorSelect(door)}
                  className={`flex flex-col items-center justify-center rounded-xl border-2 p-6 transition-all ${
                    selectedDoor === door
                      ? doorError
                        ? "border-red-500 bg-red-500/20"
                        : "border-green-500 bg-green-500/20"
                      : "border-gray-700 bg-gray-800 hover:border-amber-500/50"
                  }`}
                >
                  <DoorOpen className="mb-2 h-8 w-8 text-gray-400" />
                  <span className="font-mono text-2xl font-bold text-gray-200">
                    {door}
                  </span>
                </button>
              ))}
            </div>
            {doorError && (
              <p className="mt-3 text-center text-sm text-red-400">
                Wrong door! Try again.
              </p>
            )}
            {selectedDoor === CORRECT_DOOR && !doorError && (
              <p className="mt-3 text-center text-sm text-green-400">
                Correct! The riddle says: "The door whose number equals x + y."
              </p>
            )}
          </div>
        )}

        {/* Status */}
        <div className="mt-8 space-y-3">
          {!paintingOpened && (
            <div className="flex items-center gap-2 rounded-lg border border-gray-800 bg-gray-900/50 px-4 py-3 text-sm text-gray-500">
              <AlertCircle className="h-4 w-4" />
              There's a painting at the end of the corridor. Check behind it.
            </div>
          )}
          {paintingOpened && !panelRevealed && (
            <div className="flex items-center gap-2 rounded-lg border border-gray-800 bg-gray-900/50 px-4 py-3 text-sm text-gray-500">
              <AlertCircle className="h-4 w-4" />
              A seam in the floor has opened. Click the floor panel to reveal
              a tile grid.
            </div>
          )}
          {panelRevealed && !tileSolved && (
            <div className="flex items-center gap-2 rounded-lg border border-gray-800 bg-gray-900/50 px-4 py-3 text-sm text-gray-500">
              <AlertCircle className="h-4 w-4" />
              Solve the system of equations to find which tile to click. The
              grid is 5x5 (rows 0-4, columns 0-4). Click the tile at (row=y,
              col=x).
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
              Go to Safe Room
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        )}
      </div>

      {/* Painting Modal */}
      {showPainting && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={() => setShowPainting(false)}
        >
          <div
            className="relative w-full max-w-lg rounded-2xl border border-amber-500/30 bg-gray-900 p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowPainting(false)}
              className="absolute right-4 top-4 text-gray-500 hover:text-amber-400"
            >
              <X className="h-5 w-5" />
            </button>
            <h2 className="mb-4 font-serif text-xl font-bold text-amber-400">
              Behind the Painting
            </h2>
            <div className="space-y-4">
              <div className="rounded-lg border border-gray-800 bg-gray-950 p-4">
                <p className="mb-2 text-sm font-bold text-gray-300">
                  System of Equations:
                </p>
                <p className="font-mono text-lg text-amber-400">
                  2x + y = 7
                </p>
                <p className="font-mono text-lg text-amber-400">
                  x - y = -1
                </p>
              </div>
              <div className="rounded-lg border border-gray-800 bg-gray-950 p-4">
                <p className="mb-2 text-sm font-bold text-gray-300">
                  Riddle:
                </p>
                <p className="text-sm text-gray-400">
                  "Solve for x and y. The tile grid reveals a path — click the
                  tile at row y, column x. Then find the door whose number
                  equals x + y."
                </p>
              </div>
              {!paintingOpened && (
                <button
                  onClick={() => {
                    setPaintingOpened(true);
                    setPanelRevealed(true);
                    setShowPainting(false);
                  }}
                  className="w-full rounded-lg border border-amber-500 bg-amber-500/20 py-3 font-bold text-amber-400 transition-colors hover:bg-amber-500/30"
                >
                  Reveal Floor Panel
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tile Panel Modal */}
      {showTilePanel && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={() => setShowTilePanel(false)}
        >
          <div
            className="relative w-full max-w-lg rounded-2xl border border-amber-500/30 bg-gray-900 p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowTilePanel(false)}
              className="absolute right-4 top-4 text-gray-500 hover:text-amber-400"
            >
              <X className="h-5 w-5" />
            </button>
            <h2 className="mb-4 font-serif text-xl font-bold text-amber-400">
              Floor Tile Grid
            </h2>
            {tileSolved ? (
              <div className="space-y-4 text-center">
                <CheckCircle2 className="mx-auto h-16 w-16 text-green-500" />
                <p className="text-gray-300">
                  You clicked tile at row {CORRECT_TILE.row}, column{" "}
                  {CORRECT_TILE.col} — matching (y={SOLUTION_Y}, x={SOLUTION_X}
                  ).
                </p>
                <p className="text-sm text-gray-500">
                  x + y = {SOLUTION_X} + {SOLUTION_Y} = {CORRECT_DOOR}. Choose
                  door #{CORRECT_DOOR}.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-center text-sm text-gray-400">
                  Click the tile at row y, column x. Rows go top to bottom
                  (0-4), columns left to right (0-4).
                </p>
                <div className="flex justify-center">
                  <div className="grid grid-cols-5 gap-1">
                    {Array.from({ length: 25 }).map((_, i) => {
                      const row = Math.floor(i / 5);
                      const col = i % 5;
                      const key = `${row}-${col}`;
                      const isClicked = clickedTiles[key];
                      return (
                        <button
                          key={i}
                          onClick={() => handleTileClick(row, col)}
                          className={`h-12 w-12 rounded-md border-2 font-mono text-xs transition-all ${
                            isClicked
                              ? tileError
                                ? "border-red-500 bg-red-500/30"
                                : "border-green-500 bg-green-500/30"
                              : "border-gray-700 bg-gray-800 hover:border-amber-500/50 hover:bg-gray-700"
                          }`}
                        >
                          {row},{col}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="flex justify-center gap-6 text-xs text-gray-500">
                  <span>← columns (x) →</span>
                </div>
                <p className="text-center text-xs text-gray-500">
                  ↑ rows (y) ↓
                </p>
                {tileError && (
                  <p className="text-center text-sm text-red-400">
                    Wrong tile! Try again.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
