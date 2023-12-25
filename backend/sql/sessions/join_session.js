export const joinSessionQuery = `UPDATE sessions SET party_members=JSON_ARRAY_APPEND(party_members, "$", ?) where message_id=? AND NOT JSON_CONTAINS(party_members, JSON_QUOTE(?), "$")`;
