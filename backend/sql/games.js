export const GAMES = {
  FIND_GAMES: `SELECT * from games`,
  FIND_GAME: `SELECT @game_name := ? COLLATE utf8mb4_bin; SELECT * FROM games WHERE game_name=@game_name OR JSON_CONTAINS(aliases, JSON_QUOTE(@game_name), '$') OR registration_emoji=@game_name;`,
  ADD_GAME: `INSERT INTO games (role_id, game_name, max_party_size, registration_emoji, aliases) VALUES (?, ?, ?, ?, ?)`,
};
