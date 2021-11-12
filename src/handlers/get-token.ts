import { RouteHandler } from "fastify";
import * as crypto from "crypto";
import { tokenStore } from "../services";

const TOKEN_LIFETIME_S = 60 * 60; // 1 hour

const getToken: RouteHandler = async (req, reply) => {
  const token = crypto.randomBytes(150).toString("hex");

  reply.send({
    access_token: token,
    token_type: "bearer",
    expires_in: TOKEN_LIFETIME_S,
  });

  tokenStore.set(token, true, TOKEN_LIFETIME_S * 1000);
};

export default getToken;
