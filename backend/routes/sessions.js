import { addSessionSchema } from "../schemas/sessions/add_session.js";
import { findGameQuery } from "../sql/games/find_game.js";
import { SESSIONS } from "../sql/sessions.js";
import { replyHandler } from "./replyHandler.js";

const routes = async (fastify, options) => {
  // Create a new session
  fastify.post(
    "/session",
    addSessionSchema,
    async function handler(request, reply) {
      // Find the game in the game table if it already exists
      const [games, _a] = await fastify.mysql.query(findGameQuery, [
        request.body.game,
        request.body.game,
      ]);
      // Add the session
      const [result, _b] = await fastify.mysql.query(SESSIONS.ADD_SESSION, [
        request.body.channelId,
        request.body.messageId,
        JSON.stringify(request.body.partyMembers),
        games[0]?.game_id || null, // include a reference to the game if it existed
      ]);
      replyHandler(reply, result?.affectedRows > 0);
    }
  );

  // Remove a session by message id
  fastify.delete("/session/:id", async function handler(request, reply) {
    const [result, _] = await fastify.mysql.query(SESSIONS.REMOVE_SESSION, [
      request.params.id,
    ]);
    replyHandler(reply, result?.affectedRows > 0);
  });

  // Join a session by message id
  fastify.patch("/session/join", async function handler(request, reply) {
    const { partyMember, messageId } = request.body;
    const [result, _b] = await fastify.mysql.query(SESSIONS.JOIN_SESSION, [
      partyMember,
      messageId,
      partyMember,
    ]);
    const [session, _a] = await fastify.mysql.query(
      SESSIONS.GET_SESSION_WITH_GAME,
      [messageId]
    );
    replyHandler(reply, result?.changedRows > 0, session[0]);
  });
  // session/leave/:id
  // Join a session by message id
  fastify.patch("/session/leave", async function handler(request, reply) {
    const { partyMember, messageId } = request.body;
    const [result, _b] = await fastify.mysql.query(SESSIONS.LEAVE_SESSION, [
      partyMember,
      messageId,
      partyMember,
    ]);
    const [session, _a] = await fastify.mysql.query(
      SESSIONS.GET_SESSION_WITH_GAME,
      [messageId]
    );
    replyHandler(reply, result?.changedRows > 0, session[0]);
  });
};

export default routes;
