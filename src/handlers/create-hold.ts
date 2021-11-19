import { RouteHandler } from "fastify";
import { createItem } from "../services/item-generators";
import { isRequestable } from "../services/item-predicates";
import HoldsStore from "../services/HoldsStore";
import { PatronHoldPost } from "../types/patrons";

type UrlParams = {
  patronId: string;
};

export const createHold =
  (
    holdsStore: HoldsStore
  ): RouteHandler<{ Params?: UrlParams; Body?: PatronHoldPost }> =>
  async (request, reply) => {
    const { patronId } = request.params || {};
    if (!patronId || !request.body?.recordNumber) {
      reply.code(400).send({
        code: 115,
        specificCode: 0,
        httpStatus: 400,
        name: "Invalid JSON",
        description: "JSON object missing field or field has invalid data",
      });
      return reply;
    }

    const itemId = request.body!.recordNumber.toString();
    const item = createItem({
      id: itemId,
      onHold: holdsStore.holdExistsForItem(itemId),
    });
    if (!isRequestable(item)) {
      reply.code(500).send({
        code: 132,
        specificCode: 2,
        httpStatus: 500,
        name: "XCirc error",
        description: "XCirc error : This record is not available",
      });
      return reply;
    }

    holdsStore.create({ patronId, itemId });
    reply.code(204).send();
  };
