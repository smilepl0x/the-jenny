import { findGameQuery } from "../sql/games/find_game.js";
import { replyHandler } from "./replyHandler.js";

const routes = async (fastify, options) => {
  // Search games
  fastify.get("/game/:name", async function handler(request, reply) {
    // split reply handling out
    const [result, _] = await fastify.mysql.query(findGameQuery, [
      request.params.name,
      request.params.name,
    ]);
    return replyHandler(reply, true, result[0]);
  });
};

export default routes;
