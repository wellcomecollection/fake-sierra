import HoldsStore from "../services/HoldsStore";
import { RouteHandler } from "fastify";

type UrlParams = {
  patronId: string;
};

export const deletePatronHolds =
  (holdsStore: HoldsStore): RouteHandler<{ Params?: UrlParams }> =>
  (request, reply) => {
    const patronId = request.params?.patronId;
    if (patronId) {
      holdsStore.deleteForPatron(patronId);
    }
    reply.code(204).send();
  };
