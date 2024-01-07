export const SESSIONS = {
  ADD_SESSION: `INSERT INTO sessions (channel_id, message_id, party_members, game_id) VALUES (?, ?, ?, ?)`,
  REMOVE_SESSION: `DELETE FROM sessions WHERE message_id=?`,
  JOIN_SESSION: `UPDATE sessions SET party_members=JSON_ARRAY_APPEND(party_members, "$", ?) where message_id=? AND NOT JSON_CONTAINS(party_members, JSON_QUOTE(?), "$")`,
  LEAVE_SESSION: `UPDATE sessions SET party_members=JSON_REMOVE(party_members, JSON_UNQUOTE(JSON_SEARCH(party_members, 'one', ?))) where message_id=? AND JSON_CONTAINS(party_members, JSON_QUOTE(?), "$")`,
  GET_SESSION_WITH_GAME: `SELECT * FROM sessions s LEFT JOIN games g ON g.game_id = s.game_id WHERE message_id=?`,
  GET_EXPIRED_SESSIONS: `SELECT * FROM sessions WHERE TIMESTAMPDIFF(SECOND, start_time, NOW()) > ?;`,
  REMOVE_EXPIRED_SESSIONS: `DELETE FROM sessions WHERE TIMESTAMPDIFF(SECOND, start_time, NOW()) > ?;`,
};
