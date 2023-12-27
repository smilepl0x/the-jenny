import { GAMES } from "../sql/games.js";
import { findGameQuery } from "../sql/games/find_game.js";
import { replyHandler } from "./replyHandler.js";

const routes = async (fastify, options) => {
  // Search games
  fastify.get("/game/:name", async function handler(request, reply) {
    // split reply handling out
    const [result, _] = await fastify.mysql.query(findGameQuery, [
      request.params.name,
    ]);
    return replyHandler(reply, true, result[1][0]);
  });

  // Add a game
  fastify.post("/game/add", async function handler(request, reply) {
    const [result, _] = await fastify.mysql.query(GAMES.ADD_GAME, [
      request.body.roleId,
      request.body.gameName,
      request.body.maxPartySize,
      request.body.registrationEmoji,
      JSON.stringify(request.body.aliases),
    ]);
    replyHandler(reply, result?.affectedRows > 0);
  });
};

export default routes;
