export type RoomId =
  | "lobby"
  | "office"
  | "hallway"
  | "safe"
  | "vault";

export type GameScreen =
  | "start"
  | "lobby"
  | "office"
  | "hallway"
  | "safe"
  | "vault"
  | "victory"
  | "leaderboard";

export type CollectedClue = {
  room: RoomId;
  label: string;
  value: string;
  description: string;
};

export type GameState = {
  screen: GameScreen;
  startTime: number | null;
  endTime: number | null;
  clues: Record<string, CollectedClue>;
  completedRooms: Record<RoomId, boolean>;
};
