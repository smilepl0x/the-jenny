import { addSessionSchema } from "../schemas/sessions/add_session.js";
import { sessionsSchema } from "../schemas/sessions/sessions.js";
import { GAMES } from "../sql/games.js";
import { SESSIONS } from "../sql/sessions.js";
import { replyHandler } from "./replyHandler.js";

const routes = async (fastify, options) => {
  // Get all sessions in progress
  fastify.get("/sessions", async function handler(request, reply) {
    const [sessions] = await fastify.mysql.query(SESSIONS.GET_SESSIONS);
    replyHandler(reply, true, { sessions: Object.values(sessions) });
  });

  // Delete expired sessions, return affected
  fastify.patch(
    "/sessions",
    sessionsSchema,
    async function handler(request, reply) {
      const [expiredSessions] = await fastify.mysql.query(
        SESSIONS.GET_EXPIRED_SESSIONS,
        [request.query.sl]
      );
      await fastify.mysql.query(SESSIONS.REMOVE_EXPIRED_SESSIONS, [
        request.query.sl,
      ]);
      replyHandler(reply, true, expiredSessions);
    }
  );

  // Create a new session
  fastify.post(
    "/session",
    addSessionSchema,
    async function handler(request, reply) {
      // Find the game in the game table if it already exists
      const { gameName = "", aliases = [] } = request.body;
      const [games, _a] = await fastify.mysql.query(GAMES.FIND_GAME, [
        gameName,
        JSON.stringify(aliases),
      ]);
      // Add the session
      const [result, _b] = await fastify.mysql.query(SESSIONS.ADD_SESSION, [
        request.body.channelId,
        request.body.messageId,
        JSON.stringify(request.body.partyMembers),
        games.slice(2).flat()[0]?.game_id || null, // include a reference to the game if it existed
      ]);
      replyHandler(reply, result?.affectedRows > 0);
    }
  );

  // Get a session by message id - has game info included.
  fastify.get("/session/:id", async function handler(request, reply) {
    const [result, _] = await fastify.mysql.query(
      SESSIONS.GET_SESSION_WITH_GAME,
      [request.params.id]
    );
    replyHandler(reply, result.length > 0, result[0]);
  });

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

  // Leave a session by message id
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
