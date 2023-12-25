import { addSessionSchema } from "../schemas/sessions/add_session.js";
import { findGameQuery } from "../sql/games/find_game.js";
import { addSessionQuery } from "../sql/sessions/add_session.js";
import { joinSessionQuery } from "../sql/sessions/join_session.js";
import { removeSessionQuery } from "../sql/sessions/remove_session.js";
import { replyHandler } from "./replyHandler.js";

const MESSAGES = {
  ADD_SUCCESS: "",
};

const routes = async (fastify, options) => {
  // Create a new session
  fastify.post(
    "/session",
    addSessionSchema,
    async function handler(request, reply) {
      // Find the game in the game table if it already exists
      const [games, _a] = await fastify.mysql.query(findGameQuery, [
        request.body.gameName,
        request.body.gameName,
      ]);
      // Add the session
      const [result, _b] = await fastify.mysql.query(addSessionQuery, [
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
    const [result, _] = await fastify.mysql.query(removeSessionQuery, [
      request.params.id,
    ]);
    replyHandler(reply, result?.affectedRows > 0);
  });

  // Join a session by message id
  fastify.patch("/session/join", async function handler(request, reply) {
    const [result, _] = await fastify.mysql.query(joinSessionQuery, [
      request.body.partyMember,
      request.body.messageId,
      request.body.partyMember,
    ]);
    console.log(result);
    replyHandler(reply, result?.changedRows > 0);
  });
  // session/leave/:id
};

export default routes;
