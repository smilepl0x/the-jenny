import { findGameQuery } from "../sql/games/find_game.js";

const routes = async (fastify, options) => {
  // Search games
  fastify.get("/game/:name", async function handler(request, reply) {
    // split reply handling out
    fastify.mysql.query(
      findGameQuery,
      [request.params.name, request.params.name],
      (err, result) => reply.send(err || result)
    );
    return reply;
  });
};

export default routes;
