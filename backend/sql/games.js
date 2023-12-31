export const GAMES = {
  FIND_GAMES: `SELECT * from games`,
  FIND_GAME: `SET @game_name := ?; SET @registration_emoji := ? COLLATE utf8mb4_bin; SET @aliases := ?; SELECT * FROM games WHERE game_name=@game_name; SELECT * FROM games WHERE registration_emoji=@registration_emoji; SELECT * FROM games WHERE JSON_CONTAINS(aliases, JSON_QUOTE(@aliases), '$');`,
  ADD_GAME: `INSERT INTO games (role_id, game_name, max_party_size, registration_emoji, aliases) VALUES (?, ?, ?, ?, ?)`,
};
