export const GAMES = {
  FIND_GAMES: `SELECT * from games`,
  FIND_GAME: `SET @game_name := ?; SET @aliases := ?; SELECT * FROM games WHERE game_name=@game_name; SELECT * FROM games WHERE JSON_OVERLAPS(aliases, @aliases);`,
  ADD_GAME: `INSERT INTO games (role_id, game_name, max_party_size, aliases) VALUES (?, ?, ?, ?)`,
};
