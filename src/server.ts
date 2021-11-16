import fastify, { FastifyServerOptions } from "fastify";
import privateRoutes from "./private-routes";
import getToken from "./handlers/get-token";
import MemoryStore from "./services/MemoryStore";

export const createServer = (options?: FastifyServerOptions) => {
  const server = fastify(options);
  server.decorate("tokenStore", new MemoryStore<string, boolean>());

  server.get("/management/healthcheck", async (_, reply) =>
    reply.send({ message: "ok" })
  );
  server.get("/token", getToken(server.tokenStore));
  server.register(privateRoutes, { prefix: "/v5" });

  return server;
};
