import fastify, { FastifyServerOptions } from "fastify";
import getToken from "./handlers/get-token";

export const createServer = (options?: FastifyServerOptions) => {
  const server = fastify(options);
  server.get("/token", getToken);
  return server;
};
