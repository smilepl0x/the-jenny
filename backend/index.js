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
});
fastify.register(sessionRoutes);
fastify.register(gamesRoutes);

// Run the server!
try {
  const { ADDRESS = "localhost", PORT = "3000" } = process.env;
  await fastify.listen({ host: ADDRESS, port: PORT });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}