import { useState } from "react";
import { useGame } from "@/lib/gameContext";
import RoomHeader from "@/components/RoomHeader";
import PinInput from "@/components/PinInput";
import {
  Archive,
  Monitor,
  Camera,
  CameraOff,
  CheckCircle2,
  ArrowRight,
  ClipboardList,
  StickyNote,
  AlertCircle,
} from "lucide-react";
import RoomBackground from "@/components/RoomBackground";

const CIPHER_TEXT = "ZVPD";
const CIPHER_SHIFT = 3;
const CIPHER_ANSWER = "WSMA";

const MATH_ANSWER = "1369";

function caesarDecode(text: string, shift: number) {
  return text
    .split("")
    .map((c) => {
      const code = c.charCodeAt(0);
      if (code >= 65 && code <= 90) {
        return String.fromCharCode(((code - 65 - shift + 26) % 26) + 65);
      }
      return c;
    })
    .join("");
}

export default function OfficeRoom() {
  const { goTo, addClue, completeRoom } = useGame();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showSticky, setShowSticky] = useState(false);
  const [showComputer, setShowComputer] = useState(false);
  const [showRiddle, setShowRiddle] = useState(false);
  const [computerUnlocked, setComputerUnlocked] = useState(false);
  const [computerPassword, setComputerPassword] = useState("");
  const [computerError, setComputerError] = useState(false);
  const [camerasDisabled, setCamerasDisabled] = useState(false);
  const [riddleSolved, setRiddleSolved] = useState(false);
  const [riddleError, setRiddleError] = useState(false);

  const handleComputerLogin = () => {
    if (computerPassword.toUpperCase() === CIPHER_ANSWER) {
      setComputerUnlocked(true);
      setComputerError(false);
    } else {
      setComputerError(true);
      setTimeout(() => setComputerError(false), 1500);
    }
  };

  const handleRiddleSubmit = (value: string) => {
    if (value === MATH_ANSWER) {
      setRiddleSolved(true);
      setRiddleError(false);
    } else {
      setRiddleError(true);
      setTimeout(() => setRiddleError(false), 1500);
    }
  };

  const digitFeedback = (digit: string, index: number) => {
    const correct = MATH_ANSWER[index];
    if (digit === correct) return "correct";
    return "wrong";
  };

  const handleProceed = () => {
    addClue({
      room: "office",
      label: "Office Clue",
      value: "3",
      description: "Second digit from the math riddle answer",
    });
    completeRoom("office");
    goTo("hallway");
  };

  const canProceed = camerasDisabled && riddleSolved;

  return (
    <div className="relative min-h-screen bg-gray-950 px-4 py-6 sm:px-8">
      <RoomBackground
        image="https://images.pexels.com/photos/880989/pexels-photo-880989.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
        overlay="from-gray-950/95 via-gray-950/85 to-gray-950/95"
      />
      <RoomHeader
        title="Mr. Chen's Office"
        subtitle="A cluttered office with a desk, a computer, and a bulletin board."
      />

      <div className="relative z-10 mx-auto max-w-4xl">
        {/* Office scene */}
        <div className="grid gap-6 sm:grid-cols-3">
          {/* Desk Drawer */}
          <button
            onClick={() => {
              setDrawerOpen(true);
            }}
            className="group relative flex flex-col items-center justify-center overflow-hidden rounded-xl border border-gray-700 bg-gradient-to-br from-gray-800 to-gray-900 p-8 shadow-lg transition-all hover:scale-105 hover:border-amber-500/50"
          >
            <div className="absolute inset-0 opacity-25 transition-opacity group-hover:opacity-40">
              <img src="https://images.pexels.com/photos/3944802/pexels-photo-3944802.jpeg?auto=compress&cs=tinysrgb&h=650&w=940" alt="" className="h-full w-full object-cover" />
            </div>
            <Archive className="relative z-10 mb-2 h-10 w-10 text-gray-500 group-hover:text-amber-400" />
            <span className="relative z-10 text-sm font-semibold text-gray-300">
              Desk Drawer
            </span>
            <span className="relative z-10 mt-1 text-xs text-gray-500">
              {drawerOpen ? "Searched" : "Search it"}
            </span>
          </button>

          {/* Computer */}
          <button
            onClick={() => setShowComputer(true)}
            className="group relative flex flex-col items-center justify-center overflow-hidden rounded-xl border border-gray-700 bg-gradient-to-br from-gray-800 to-gray-900 p-8 shadow-lg transition-all hover:scale-105 hover:border-amber-500/50"
          >
            <div className="absolute inset-0 opacity-25 transition-opacity group-hover:opacity-40">
              <img src="https://images.pexels.com/photos/30692441/pexels-photo-30692441.jpeg?auto=compress&cs=tinysrgb&h=650&w=940" alt="" className="h-full w-full object-cover" />
            </div>
            {computerUnlocked ? (
              <CheckCircle2 className="relative z-10 mb-2 h-10 w-10 text-green-500" />
            ) : (
              <Monitor className="relative z-10 mb-2 h-10 w-10 text-gray-500 group-hover:text-amber-400" />
            )}
            <span className="relative z-10 text-sm font-semibold text-gray-300">
              Office Computer
            </span>
            <span className="relative z-10 mt-1 text-xs text-gray-500">
              {computerUnlocked
                ? camerasDisabled
                  ? "Cameras off"
                  : "Disable cameras"
                : "Locked"}
            </span>
          </button>

          {/* Bulletin Board */}
          <button
            onClick={() => setShowRiddle(true)}
            className="group relative flex flex-col items-center justify-center overflow-hidden rounded-xl border border-gray-700 bg-gradient-to-br from-gray-800 to-gray-900 p-8 shadow-lg transition-all hover:scale-105 hover:border-amber-500/50"
          >
            <div className="absolute inset-0 opacity-25 transition-opacity group-hover:opacity-40">
              <img src="https://images.pexels.com/photos/8581050/pexels-photo-8581050.jpeg?auto=compress&cs=tinysrgb&h=650&w=940" alt="" className="h-full w-full object-cover" />
            </div>
            {riddleSolved ? (
              <CheckCircle2 className="relative z-10 mb-2 h-10 w-10 text-green-500" />
            ) : (
              <ClipboardList className="relative z-10 mb-2 h-10 w-10 text-gray-500 group-hover:text-amber-400" />
            )}
            <span className="relative z-10 text-sm font-semibold text-gray-300">
              Bulletin Board
            </span>
            <span className="relative z-10 mt-1 text-xs text-gray-500">
              {riddleSolved ? "Solved" : "Read riddle"}
            </span>
          </button>
        </div>

        {/* Status */}
        <div className="mt-8 space-y-3">
          {!drawerOpen && (
            <div className="flex items-center gap-2 rounded-lg border border-gray-800 bg-gray-900/50 px-4 py-3 text-sm text-gray-500">
              <AlertCircle className="h-4 w-4" />
              Search the desk drawer to find something useful.
            </div>
          )}
          {drawerOpen && !computerUnlocked && (
            <div className="flex items-center gap-2 rounded-lg border border-gray-800 bg-gray-900/50 px-4 py-3 text-sm text-gray-500">
              <AlertCircle className="h-4 w-4" />
              Decipher the sticky note code to log into the computer.
            </div>
          )}
          {computerUnlocked && !camerasDisabled && (
            <div className="flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/5 px-4 py-3 text-sm text-amber-400">
              <AlertCircle className="h-4 w-4" />
              Disable the cameras on the computer!
            </div>
          )}
          {camerasDisabled && !riddleSolved && (
            <div className="flex items-center gap-2 rounded-lg border border-gray-800 bg-gray-900/50 px-4 py-3 text-sm text-gray-500">
              <AlertCircle className="h-4 w-4" />
              Check the bulletin board for the next room's code.
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
              Go to Hallway
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        )}
      </div>

      {/* Desk Drawer Modal */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={() => setDrawerOpen(false)}
        >
          <div
            className="relative w-full max-w-md rounded-2xl border border-amber-500/30 bg-gray-900 p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setDrawerOpen(false)}
              className="absolute right-4 top-4 text-gray-500 hover:text-amber-400"
            >
              ✕
            </button>
            <h2 className="mb-4 font-serif text-xl font-bold text-amber-400">
              Desk Drawer
            </h2>
            <p className="mb-4 text-sm text-gray-400">
              You rummage through the desk drawer and find a sticky note.
            </p>
            <button
              onClick={() => {
                setShowSticky(true);
                setDrawerOpen(false);
              }}
              className="flex w-full items-center gap-3 rounded-lg border border-yellow-300 bg-yellow-100 p-4 text-left transition-all hover:bg-yellow-200"
              style={{ transform: "rotate(-1deg)" }}
            >
              <StickyNote className="h-8 w-8 text-gray-700" />
              <div>
                <p className="font-semibold text-gray-800">Sticky Note</p>
                <p className="text-xs text-gray-600">Click to read</p>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Sticky Note Modal */}
      {showSticky && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={() => setShowSticky(false)}
        >
          <div
            className="relative w-full max-w-md rounded-2xl border border-yellow-300 bg-yellow-100 p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            style={{ transform: "rotate(1deg)" }}
          >
            <button
              onClick={() => setShowSticky(false)}
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-800"
            >
              ✕
            </button>
            <h2 className="mb-4 font-serif text-xl font-bold text-gray-800">
              Sticky Note
            </h2>
            <div className="space-y-4">
              <p className="text-sm text-gray-700">
                "Decipher this code to get the password to the computer:"
              </p>
              <p className="font-mono text-3xl font-bold tracking-widest text-gray-900">
                {CIPHER_TEXT}
              </p>
              <p className="text-sm text-gray-600">
                Shift 3 to the left.
              </p>
              <div className="border-t border-yellow-400 pt-3">
                <p className="text-xs text-gray-500">
                  A B C D E F G H I J K L M
                </p>
                <p className="text-xs text-gray-500">
                  N O P Q R S T U V W X Y Z
                </p>
                <p className="mt-1 text-xs text-gray-400">← shift left ←</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Computer Modal */}
      {showComputer && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={() => setShowComputer(false)}
        >
          <div
            className="relative w-full max-w-2xl rounded-2xl border border-amber-500/30 bg-gray-900 p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowComputer(false)}
              className="absolute right-4 top-4 text-gray-500 hover:text-amber-400"
            >
              ✕
            </button>
            <h2 className="mb-4 font-serif text-xl font-bold text-amber-400">
              Office Computer
            </h2>
            {!computerUnlocked ? (
              <div className="space-y-4">
                <div className="rounded-lg border border-gray-800 bg-gray-950 p-4">
                  <p className="font-mono text-sm text-green-400">
                    &gt; SYSTEM: Password required.
                  </p>
                  <p className="font-mono text-sm text-green-400">
                    &gt; HINT: Decipher the sticky note code.
                  </p>
                </div>
                <input
                  type="text"
                  value={computerPassword}
                  onChange={(e) => {
                    setComputerPassword(e.target.value);
                    setComputerError(false);
                  }}
                  onKeyDown={(e) =>
                    e.key === "Enter" && handleComputerLogin()
                  }
                  placeholder="Enter password"
                  className={`w-full rounded-lg border bg-gray-800 px-4 py-3 text-center font-mono text-lg uppercase tracking-widest text-gray-200 outline-none transition-colors ${
                    computerError
                      ? "border-red-500"
                      : "border-gray-700 focus:border-amber-500"
                  }`}
                  autoFocus
                />
                {computerError && (
                  <p className="text-center text-sm text-red-400">
                    Incorrect password.
                  </p>
                )}
                <button
                  onClick={handleComputerLogin}
                  className="w-full rounded-lg border border-amber-500 bg-amber-500/20 py-3 font-bold text-amber-400 transition-colors hover:bg-amber-500/30"
                >
                  Log In
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="rounded-lg border border-green-500/30 bg-green-500/5 p-4">
                  <p className="font-mono text-sm text-green-400">
                    &gt; ACCESS GRANTED. Welcome, Mr. Chen.
                  </p>
                </div>
                {!camerasDisabled ? (
                  <div className="rounded-lg border border-gray-800 bg-gray-950 p-4">
                    <div className="mb-3 flex items-center gap-2">
                      <Camera className="h-5 w-5 text-red-400" />
                      <span className="font-bold text-gray-200">
                        Security Camera System
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {["Lobby", "Office", "Hallway", "Safe", "Vault", "Exit"].map(
                        (cam) => (
                          <div
                            key={cam}
                            className="rounded-lg border border-gray-700 bg-gray-800 p-3"
                          >
                            <div className="flex items-center gap-1 text-xs text-gray-400">
                              <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
                              {cam}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                    <button
                      onClick={() => setCamerasDisabled(true)}
                      className="mt-4 w-full rounded-lg border border-red-500 bg-red-500/20 py-3 font-bold text-red-400 transition-colors hover:bg-red-500/30"
                    >
                      Disable All Cameras
                    </button>
                  </div>
                ) : (
                  <div className="rounded-lg border border-green-500/30 bg-green-500/5 p-4 text-center">
                    <CameraOff className="mx-auto mb-2 h-10 w-10 text-green-500" />
                    <p className="text-green-400">
                      All cameras have been disabled. You can move freely now.
                    </p>
                  </div>
                )}
                <button
                  onClick={() => setShowComputer(false)}
                  className="w-full rounded-lg border border-gray-700 bg-gray-800 py-2 text-gray-400 transition-colors hover:text-gray-200"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Riddle Modal */}
      {showRiddle && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={() => setShowRiddle(false)}
        >
          <div
            className="relative w-full max-w-lg rounded-2xl border border-amber-500/30 bg-gray-900 p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowRiddle(false)}
              className="absolute right-4 top-4 text-gray-500 hover:text-amber-400"
            >
              ✕
            </button>
            <h2 className="mb-4 font-serif text-xl font-bold text-amber-400">
              Bulletin Board Riddle
            </h2>
            {riddleSolved ? (
              <div className="space-y-4 text-center">
                <CheckCircle2 className="mx-auto h-16 w-16 text-green-500" />
                <p className="text-gray-300">
                  The answer is <span className="font-bold text-amber-400">1369</span>.
                </p>
                <p className="text-sm text-gray-500">
                  1369 = 37² (a perfect square). First digit: 1 = 1². Last
                  digit: 9 = 3². Middle two digits: 36 = 6². All conditions
                  satisfied!
                </p>
                <p className="text-sm text-amber-400">
                  The code to the next room is 1369. Remember the second
                  digit: <span className="font-bold">3</span>
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="rounded-lg border border-gray-800 bg-gray-950 p-4">
                  <p className="text-sm text-gray-300">
                    I am a 4-digit number. I am a perfect square, and I am not
                    prime. My first digit is a perfect square, my last digit is
                    a perfect square, and my middle two digits together form a
                    perfect square as well. I am the code to the next room.
                    What am I?
                  </p>
                </div>
                <p className="text-center text-xs text-gray-500">
                  Hint: Correct digits turn green, wrong ones turn red.
                </p>
                <PinInput
                  length={4}
                  onSubmit={handleRiddleSubmit}
                  hint={
                    riddleError
                      ? "Not quite. Try again."
                      : "Enter the 4-digit answer"
                  }
                  digitFeedback={digitFeedback}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
