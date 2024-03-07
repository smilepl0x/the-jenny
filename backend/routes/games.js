import { GAMES } from "../sql/games.js";
import { replyHandler } from "./replyHandler.js";

const routes = async (fastify, options) => {
  // Get all games
  fastify.get("/games", async function handler(request, reply) {
    const [result, _] = await fastify.mysql.query(GAMES.FIND_GAMES);
    return replyHandler(reply, true, { games: result });
  });

  // Get game by identifier
  fastify.post("/game", async function handler(request, reply) {
    const { gameName = "", aliases = [] } = request.body;
    const [result, _] = await fastify.mysql.query(GAMES.FIND_GAME, [
      gameName,
      JSON.stringify(aliases),
    ]);
    return replyHandler(reply, true, { games: result.slice(2).flat() });
  });

  // Add a game
  fastify.post("/game/add", async function handler(request, reply) {
    const [result, _] = await fastify.mysql.query(GAMES.ADD_GAME, [
      request.body.roleId,
      request.body.gameName,
      request.body.maxPartySize,
      JSON.stringify(request.body.aliases),
    ]);
    replyHandler(reply, result?.affectedRows > 0);
  });
};

export default routes;
