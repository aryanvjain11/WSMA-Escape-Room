/*
# Create leaderboard table for escape room heist game

## Purpose
Stores completion times for the heist escape room game. Players who complete all rooms
submit their time, and the leaderboard masterpage (password-locked) displays the top 10
fastest times and the average completion time.

## New Tables
- `leaderboard`
  - `id` (uuid, primary key, auto-generated)
  - `player_name` (text, not null) — the name the player enters on victory
  - `completion_time_seconds` (integer, not null) — total time taken to escape, in seconds
  - `created_at` (timestamptz, defaults to now) — when the record was submitted

## Security
- RLS enabled on `leaderboard`.
- This is a no-auth (no sign-in) app, so policies use `TO anon, authenticated`:
  - SELECT: anyone can read leaderboard entries (needed for the masterpage display).
  - INSERT: anyone can insert a new completion time (needed when a player finishes).
  - No UPDATE or DELETE policies — records are immutable once submitted.

## Important Notes
1. The leaderboard masterpage is password-locked on the frontend. The password is
   checked client-side only (no auth table). This is by design for a classroom game.
2. `completion_time_seconds` is stored as integer for easy sorting and averaging.
3. An index on `completion_time_seconds` ascending ensures fast top-10 queries.
*/

CREATE TABLE IF NOT EXISTS leaderboard (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_name text NOT NULL,
  completion_time_seconds integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;

-- Allow anyone (anon + authenticated) to read leaderboard entries
DROP POLICY IF EXISTS "anon_select_leaderboard" ON leaderboard;
CREATE POLICY "anon_select_leaderboard" ON leaderboard FOR SELECT
  TO anon, authenticated USING (true);

-- Allow anyone (anon + authenticated) to insert a new completion time
DROP POLICY IF EXISTS "anon_insert_leaderboard" ON leaderboard;
CREATE POLICY "anon_insert_leaderboard" ON leaderboard FOR INSERT
  TO anon, authenticated WITH CHECK (true);

-- Create index for fast top-10 ordering
CREATE INDEX IF NOT EXISTS idx_leaderboard_time_asc ON leaderboard (completion_time_seconds ASC);
