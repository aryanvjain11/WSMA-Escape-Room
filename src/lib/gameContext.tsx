import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { GameScreen, RoomId, CollectedClue } from "./types";

type GameContextValue = {
  screen: GameScreen;
  startTime: number | null;
  endTime: number | null;
  elapsedSeconds: number;
  clues: Record<string, CollectedClue>;
  completedRooms: Record<RoomId, boolean>;
  startGame: () => void;
  goTo: (screen: GameScreen) => void;
  addClue: (clue: CollectedClue) => void;
  completeRoom: (room: RoomId) => void;
  finishGame: () => void;
  resetGame: () => void;
  getElapsedSeconds: () => number;
};

const defaultCompleted: Record<RoomId, boolean> = {
  lobby: false,
  office: false,
  hallway: false,
  safe: false,
  vault: false,
};

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [screen, setScreen] = useState<GameScreen>("start");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [clues, setClues] = useState<Record<string, CollectedClue>>({});
  const [completedRooms, setCompletedRooms] =
    useState<Record<RoomId, boolean>>(defaultCompleted);

  const startGame = useCallback(() => {
    setStartTime(Date.now());
    setEndTime(null);
    setClues({});
    setCompletedRooms(defaultCompleted);
    setScreen("lobby");
  }, []);

  const goTo = useCallback((s: GameScreen) => {
    setScreen(s);
  }, []);

  const addClue = useCallback((clue: CollectedClue) => {
    setClues((prev) => ({ ...prev, [clue.room]: clue }));
  }, []);

  const completeRoom = useCallback((room: RoomId) => {
    setCompletedRooms((prev) => ({ ...prev, [room]: true }));
  }, []);

  const finishGame = useCallback(() => {
    setEndTime(Date.now());
    setScreen("victory");
  }, []);

  const resetGame = useCallback(() => {
    setScreen("start");
    setStartTime(null);
    setEndTime(null);
    setClues({});
    setCompletedRooms(defaultCompleted);
  }, []);

  const getElapsedSeconds = useCallback(() => {
    if (!startTime) return 0;
    const end = endTime ?? Date.now();
    return Math.floor((end - startTime) / 1000);
  }, [startTime, endTime]);

  const elapsedSeconds = getElapsedSeconds();

  return (
    <GameContext.Provider
      value={{
        screen,
        startTime,
        endTime,
        elapsedSeconds,
        clues,
        completedRooms,
        startGame,
        goTo,
        addClue,
        completeRoom,
        finishGame,
        resetGame,
        getElapsedSeconds,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used within GameProvider");
  return ctx;
}
