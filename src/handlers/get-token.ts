import { RouteHandler } from "fastify";
import * as crypto from "crypto";
import MemoryStore from "../services/MemoryStore";

const TOKEN_LIFETIME_S = 60 * 60; // 1 hour

const getToken =
  (tokenStore: MemoryStore<string, boolean>): RouteHandler =>
  async (req, reply) => {
    const token = crypto.randomBytes(150).toString("hex");
    tokenStore.set(token, true, TOKEN_LIFETIME_S * 1000);

    reply.send({
      access_token: token,
      token_type: "bearer",
      expires_in: TOKEN_LIFETIME_S,
    });
  };

export default getToken;
