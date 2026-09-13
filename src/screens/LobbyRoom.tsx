import { useState } from "react";
import { useGame } from "@/lib/gameContext";
import RoomHeader from "@/components/RoomHeader";
import Modal from "@/components/Modal";
import PinInput from "@/components/PinInput";
import {
  StickyNote,
  Lock as LockIcon,
  Monitor,
  CreditCard,
  Map as MapIcon,
  Camera,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import RoomBackground from "@/components/RoomBackground";

const STICKY_CIPHER = "FRPPHQW";
const STICKY_SHIFT = 3;
const COMPUTER_PASSWORD = "COMMENT";
const ENCODED_SAFE_DIGITS = "4068";
const SAFE_CODE = "7391";

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

export default function LobbyRoom() {
  const { goTo, addClue, completeRoom } = useGame();
  const [showSticky, setShowSticky] = useState(false);
  const [showSafe, setShowSafe] = useState(false);
  const [showComputer, setShowComputer] = useState(false);
  const [safeUnlocked, setSafeUnlocked] = useState(false);
  const [computerUnlocked, setComputerUnlocked] = useState(false);
  const [safeError, setSafeError] = useState(false);
  const [computerError, setComputerError] = useState(false);
  const [computerPassword, setComputerPassword] = useState("");
  const [hasKeycard, setHasKeycard] = useState(false);
  const [hasMap, setHasMap] = useState(false);
  const [camerasViewed, setCamerasViewed] = useState(false);

  const decoded = caesarDecode(STICKY_CIPHER, STICKY_SHIFT);

  const handleSafeSubmit = (value: string) => {
    if (value === SAFE_CODE) {
      setSafeUnlocked(true);
      setSafeError(false);
      setHasKeycard(true);
      setHasMap(true);
    } else {
      setSafeError(true);
      setTimeout(() => setSafeError(false), 1500);
    }
  };

  const handleComputerLogin = () => {
    if (computerPassword.toUpperCase() === decoded) {
      setComputerUnlocked(true);
      setComputerError(false);
    } else {
      setComputerError(true);
      setTimeout(() => setComputerError(false), 1500);
    }
  };

  const handleProceed = () => {
    addClue({
      room: "lobby",
      label: "Lobby Clue",
      value: "7",
      description: "First digit from the safe code",
    });
    completeRoom("lobby");
    goTo("office");
  };

  const canProceed = hasKeycard && camerasViewed;

  return (
    <div className="relative min-h-screen bg-gray-950 px-4 py-6 sm:px-8">
      <RoomBackground
        image="https://images.pexels.com/photos/518244/pexels-photo-518244.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
        overlay="from-gray-950/95 via-gray-950/85 to-gray-950/95"
      />

      <RoomHeader
        title="Front Desk"
        subtitle="The bank lobby. A reception desk sits in the center."
      />

      <div className="relative z-10 mx-auto max-w-4xl">
        {/* Desk scene */}
        <div className="grid gap-6 sm:grid-cols-3">
          {/* Sticky Note */}
          <button
            onClick={() => setShowSticky(true)}
            className="group relative flex flex-col items-center justify-center overflow-hidden rounded-xl border border-yellow-600/50 bg-gradient-to-br from-yellow-100 to-yellow-200 p-8 shadow-lg transition-all hover:scale-105 hover:shadow-xl"
            style={{ transform: "rotate(-2deg)" }}
          >
            <div className="absolute inset-0 opacity-20 transition-opacity group-hover:opacity-30">
              <img src="https://images.pexels.com/photos/8071651/pexels-photo-8071651.jpeg?auto=compress&cs=tinysrgb&h=650&w=940" alt="" className="h-full w-full object-cover" />
            </div>
            <StickyNote className="relative z-10 mb-2 h-10 w-10 text-gray-700" />
            <span className="relative z-10 text-sm font-semibold text-gray-700">
              Sticky Note
            </span>
            <span className="relative z-10 mt-1 text-xs text-gray-500">
              Click to read
            </span>
          </button>

          {/* Mini-box Safe */}
          <button
            onClick={() => setShowSafe(true)}
            className="group relative flex flex-col items-center justify-center overflow-hidden rounded-xl border border-gray-700 bg-gradient-to-br from-gray-800 to-gray-900 p-8 shadow-lg transition-all hover:scale-105 hover:border-amber-500/50 hover:shadow-xl"
          >
            <div className="absolute inset-0 opacity-25 transition-opacity group-hover:opacity-40">
              <img src="https://images.pexels.com/photos/8466227/pexels-photo-8466227.jpeg?auto=compress&cs=tinysrgb&h=650&w=940" alt="" className="h-full w-full object-cover" />
            </div>
            {safeUnlocked ? (
              <CheckCircle2 className="relative z-10 mb-2 h-10 w-10 text-green-500" />
            ) : (
              <LockIcon className="relative z-10 mb-2 h-10 w-10 text-gray-500 group-hover:text-amber-400" />
            )}
            <span className="relative z-10 text-sm font-semibold text-gray-300">
              Mini-Box Safe
            </span>
            <span className="relative z-10 mt-1 text-xs text-gray-500">
              {safeUnlocked ? "Unlocked" : "Locked"}
            </span>
          </button>

          {/* Computer */}
          <button
            onClick={() => setShowComputer(true)}
            className="group relative flex flex-col items-center justify-center overflow-hidden rounded-xl border border-gray-700 bg-gradient-to-br from-gray-800 to-gray-900 p-8 shadow-lg transition-all hover:scale-105 hover:border-amber-500/50 hover:shadow-xl"
          >
            <div className="absolute inset-0 opacity-25 transition-opacity group-hover:opacity-40">
              <img src="https://images.pexels.com/photos/880989/pexels-photo-880989.jpeg?auto=compress&cs=tinysrgb&h=650&w=940" alt="" className="h-full w-full object-cover" />
            </div>
            <Monitor className="relative z-10 mb-2 h-10 w-10 text-gray-500 group-hover:text-amber-400" />
            <span className="relative z-10 text-sm font-semibold text-gray-300">
              Computer
            </span>
            <span className="relative z-10 mt-1 text-xs text-gray-500">
              {computerUnlocked ? "Logged in" : "Locked"}
            </span>
          </button>
        </div>

        {/* Items found */}
        {(hasKeycard || hasMap) && (
          <div className="mt-8 rounded-xl border border-amber-500/20 bg-gray-900/50 p-4">
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-amber-400">
              Items Found
            </h3>
            <div className="flex flex-wrap gap-4">
              {hasKeycard && (
                <div className="flex items-center gap-2 rounded-lg border border-gray-700 bg-gray-800 px-3 py-2">
                  <CreditCard className="h-5 w-5 text-amber-400" />
                  <span className="text-sm text-gray-300">Key Card</span>
                </div>
              )}
              {hasMap && (
                <div className="flex items-center gap-2 rounded-lg border border-gray-700 bg-gray-800 px-3 py-2">
                  <MapIcon className="h-5 w-5 text-amber-400" />
                  <span className="text-sm text-gray-300">Bank Layout</span>
                </div>
              )}
            </div>
            {hasMap && (
              <div className="mt-4 rounded-lg border border-gray-800 bg-gray-950 p-4">
                <p className="mb-2 text-xs font-bold uppercase text-gray-500">
                  Bank Layout
                </p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {["Lobby", "Office", "Hallway", "Safe", "Vault"].map(
                    (room, i) => (
                      <div
                        key={room}
                        className={`rounded-lg border p-3 text-center text-xs ${
                          i === 0
                            ? "border-green-500 bg-green-500/10 text-green-400"
                            : "border-gray-700 bg-gray-800 text-gray-400"
                        }`}
                      >
                        {room}
                      </div>
                    )
                  )}
                </div>
                <p className="mt-3 text-xs text-gray-500">
                  The computer says: "Use the office computer to disable
                  cameras. See Mr. Chen in the office."
                </p>
              </div>
            )}
          </div>
        )}

        {/* Proceed button */}
        {canProceed && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={handleProceed}
              className="group flex items-center gap-3 rounded-xl border border-amber-500 bg-amber-500/10 px-8 py-4 font-bold text-amber-400 transition-all hover:bg-amber-500 hover:text-gray-950 hover:shadow-[0_0_30px_rgba(245,158,11,0.4)]"
            >
              Go to Office
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        )}

        {/* Hint */}
        {!hasKeycard && (
          <p className="mt-8 text-center text-sm text-gray-500">
            Explore the desk. The sticky note may hold a code...
          </p>
        )}
        {hasKeycard && !camerasViewed && (
          <p className="mt-8 text-center text-sm text-gray-500">
            Check the computer to view the security cameras.
          </p>
        )}
      </div>

      {/* Sticky Note Modal */}
      <Modal
        open={showSticky}
        onClose={() => setShowSticky(false)}
        title="Sticky Note"
      >
        <div className="space-y-4">
          <div
            className="rounded-lg border border-yellow-300 bg-yellow-100 p-6 shadow-md"
            style={{ transform: "rotate(1deg)" }}
          >
            {/* Part 1: Safe code puzzle */}
            <p className="mb-2 text-sm font-bold text-gray-700">
              Safe Code Puzzle:
            </p>
            <p className="text-sm text-gray-600">
              Start with the number{" "}
              <span className="font-mono text-lg font-bold text-gray-800">
                {ENCODED_SAFE_DIGITS}
              </span>
              .
            </p>
            <p className="mt-1 text-sm text-gray-600">
              Add 3 to each digit. If a digit goes above 9, keep only the
              last digit (e.g., 8 + 3 = 11 → keep 1).
            </p>
            <div className="mt-3 rounded bg-yellow-200/50 p-2 text-center">
              <p className="text-xs text-gray-500">
                4 + 3 = 7, 0 + 3 = 3, 6 + 3 = 9, 8 + 3 = 11 → 1
              </p>
            </div>

            <div className="my-4 border-t border-yellow-400" />

            {/* Part 2: Computer password cipher */}
            <p className="mb-2 text-sm font-bold text-gray-700">
              Computer Password (Caesar cipher):
            </p>
            <p className="mb-2 font-mono text-2xl font-bold tracking-widest text-gray-800">
              {STICKY_CIPHER}
            </p>
            <p className="text-sm text-gray-600">
              Shift each letter {STICKY_SHIFT} to the left to decode.
            </p>
            <div className="mt-3 border-t border-yellow-400 pt-3">
              <p className="text-xs text-gray-500">
                A B C D E F G H I J K L M
              </p>
              <p className="text-xs text-gray-500">
                N O P Q R S T U V W X Y Z
              </p>
              <p className="mt-1 text-xs text-gray-400">← shift left ←</p>
            </div>
          </div>
          <p className="text-center text-sm text-gray-400">
            Solve both puzzles: the digit puzzle gives the safe code, the
            cipher gives the computer password.
          </p>
        </div>
      </Modal>

      {/* Safe Modal */}
      <Modal
        open={showSafe}
        onClose={() => setShowSafe(false)}
        title="Mini-Box Safe"
      >
        {safeUnlocked ? (
          <div className="space-y-4 text-center">
            <CheckCircle2 className="mx-auto h-16 w-16 text-green-500" />
            <p className="text-gray-300">
              The safe swings open. Inside you find:
            </p>
            <div className="flex justify-center gap-6">
              <div className="flex flex-col items-center gap-2">
                <CreditCard className="h-12 w-12 text-amber-400" />
                <span className="text-sm text-gray-300">Key Card</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <MapIcon className="h-12 w-12 text-amber-400" />
                <span className="text-sm text-gray-300">Bank Layout</span>
              </div>
            </div>
            <p className="text-sm text-gray-500">
              The safe code was {SAFE_CODE}. Remember the first digit:{" "}
              <span className="font-bold text-amber-400">7</span>
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-center text-sm text-gray-400">
              Enter the 4-digit code to unlock the safe.
            </p>
            <PinInput
              length={4}
              onSubmit={handleSafeSubmit}
              hint={safeError ? "Incorrect code. Try again." : "Read the sticky note — solve the digit puzzle to get the safe code."}
            />
          </div>
        )}
      </Modal>

      {/* Computer Modal */}
      <Modal
        open={showComputer}
        onClose={() => setShowComputer(false)}
        title="Reception Computer"
        maxWidth="max-w-2xl"
      >
        {!computerUnlocked ? (
          <div className="space-y-4">
            <div className="rounded-lg border border-gray-800 bg-gray-950 p-4">
              <p className="font-mono text-sm text-green-400">
                &gt; SYSTEM: Password required to log in.
              </p>
              <p className="font-mono text-sm text-green-400">
                &gt; HINT: Check the sticky note on the desk.
              </p>
            </div>
            <input
              type="text"
              value={computerPassword}
              onChange={(e) => {
                setComputerPassword(e.target.value);
                setComputerError(false);
              }}
              onKeyDown={(e) => e.key === "Enter" && handleComputerLogin()}
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
              <p className="mb-2 font-mono text-sm text-green-400">
                &gt; ACCESS GRANTED. Welcome.
              </p>
            </div>
            <div className="rounded-lg border border-gray-800 bg-gray-950 p-4">
              <div className="mb-3 flex items-center gap-2">
                <Camera className="h-5 w-5 text-amber-400" />
                <span className="font-bold text-gray-200">
                  Security Cameras
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {["Lobby", "Office", "Hallway", "Safe Room", "Vault", "Exit"].map(
                  (cam) => (
                    <div
                      key={cam}
                      className="relative overflow-hidden rounded-lg border border-gray-700 bg-gray-800 p-3"
                    >
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
                        {cam}
                      </div>
                      <div className="mt-2 h-16 rounded bg-gray-900/50" />
                    </div>
                  )
                )}
              </div>
              <p className="mt-3 text-xs text-gray-500">
                Cameras are active. You cannot turn them off from here. Go to
                Mr. Chen's office to disable them.
              </p>
            </div>
            <button
              onClick={() => {
                setCamerasViewed(true);
                setShowComputer(false);
              }}
              className="w-full rounded-lg border border-amber-500 bg-amber-500/20 py-3 font-bold text-amber-400 transition-colors hover:bg-amber-500/30"
            >
              Acknowledge & Continue
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}
