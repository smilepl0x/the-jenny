export const findGameQuery = `SELECT * FROM games WHERE game_name=? OR JSON_CONTAINS(aliases, JSON_QUOTE(?), "$")`;
