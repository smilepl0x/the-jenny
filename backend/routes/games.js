import { GAMES } from "../sql/games.js";
import { replyHandler } from "./replyHandler.js";

const routes = async (fastify, options) => {
  // Get all games
  fastify.get("/games", async function handler(request, reply) {
    const [result, _] = await fastify.mysql.query(GAMES.FIND_GAMES);
    return replyHandler(reply, true, result);
  });

  // Get game by identifier
  fastify.post("/game", async function handler(request, reply) {
    const { gameName, registrationEmoji = "", aliases } = request.body;
    const [result, _] = await fastify.mysql.query(GAMES.FIND_GAME, [
      gameName,
      registrationEmoji,
      aliases,
    ]);
    return replyHandler(reply, true, { games: result.slice(3).flat() });
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
