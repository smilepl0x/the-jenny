import Fastify from "fastify";
import sessionRoutes from "./routes/sessions.js";
import { fastifyMysql } from "@fastify/mysql";
import gamesRoutes from "./routes/games.js";

const fastify = Fastify({ logger: true });

fastify.register(fastifyMysql, {
  promise: true,
  // connectionString: "mysql://root:example@db:3306/jenny",
  host: "db",
  user: "root",
  password: process.env.MYSQL_ROOT_PASSWORD,
  port: "3306",
  database: "jenny",
  multipleStatements: true,
  charset: "utf8mb4_0900_ai_ci",
});
fastify.register(sessionRoutes);
fastify.register(gamesRoutes);

try {
  // Run the server!
  const { ADDRESS = "localhost", PORT = "3000" } = process.env;
  fastify.listen({ host: ADDRESS, port: PORT });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
