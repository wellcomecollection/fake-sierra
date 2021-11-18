import { RouteHandler } from "fastify";
import { Hold, HoldResultSet } from "../types/patrons";
import HoldsStore from "../services/HoldsStore";

type UrlParams = {
  patronId: string;
};

export const getHolds =
  (
    holdsStore: HoldsStore
  ): RouteHandler<{ Params?: UrlParams }> =>
  (request, reply) => {
    const { patronId } = request.params || {};
    const holds: Hold[] = patronId ? holdsStore.patronHolds(patronId) : [];
    const response: HoldResultSet = {
      total: holds.length,
      start: 0,
      entries: holds,
    };
    reply.send(response);
  };
