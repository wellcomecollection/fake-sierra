import fastify, { FastifyServerOptions } from "fastify";

export const createServer = (options?: FastifyServerOptions) => {
  const server = fastify(options);

  server.get("/", async (req, reply) => {
    return "Hello world!";
  });

  return server;
};
