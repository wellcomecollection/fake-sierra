import { FastifyPluginAsync, onRequestHookHandler } from "fastify";
import MemoryStore from "./services/MemoryStore";
import { getItems } from "./handlers/get-items";
import { createHold } from "./handlers/create-hold";
import { getHolds } from "./handlers/get-holds";

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
  server.get("/items", getItems(server.holdsStore));
  server.post(
    "/patrons/:patronId/holds/requests",
    createHold(server.holdsStore)
  );
  server.get("/patrons/:patronId/holds", getHolds(server.holdsStore));
};

export default privateRoutes;
