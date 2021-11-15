import { FastifyPluginAsync, onRequestHookHandler } from "fastify";
import MemoryStore from "./services/MemoryStore";

const authenticateRequest = (
  tokenStore: MemoryStore<string, boolean>
): onRequestHookHandler =>
  async function (request, reply) {
    const authHeader = request.raw.headers.authorization;
    const tokenMatch = /^Bearer (.+)$/.exec(authHeader || "");
    if (!tokenMatch) {
      reply.code(401).send({
        code: 113,
        specificCode: 0,
        httpStatus: 401,
        name: "Unauthorized",
        description: "Invalid or missing authorization header",
      });
      return reply;
    }

    const tokenIsValid = tokenStore.get(tokenMatch[1]);
    if (!tokenIsValid) {
      reply.code(401).send({
        code: 123,
        specificCode: 0,
        httpStatus: 401,
        name: "Unauthorized",
        description: "invalid_grant",
      });
      return reply;
    }
  };

const privateRoutes: FastifyPluginAsync = async (server) => {
  server.addHook("onRequest", authenticateRequest(server.tokenStore));
  server.get("/items", async (req, reply) => {
    reply.send("test");
  });
};

export default privateRoutes;
