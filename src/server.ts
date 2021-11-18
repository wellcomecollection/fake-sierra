import fastify, { FastifyServerOptions } from "fastify";
import privateRoutes from "./private-routes";
import getToken from "./handlers/get-token";
import MemoryStore from "./services/MemoryStore";
import HoldsStore from "./services/HoldsStore";

export const createServer = (options?: FastifyServerOptions) => {
  const server = fastify(options);
  server.decorate("tokenStore", new MemoryStore<string, boolean>());
  server.decorate("holdsStore", new HoldsStore());

  server.post("/token", getToken(server.tokenStore));
  server.register(privateRoutes, { prefix: "/v5" });

  return server;
};
