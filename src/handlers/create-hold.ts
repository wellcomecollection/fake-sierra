import MemoryStore from "../services/MemoryStore";
import { RouteHandler } from "fastify";

type UrlParams = {
  patronId: string;
};

// https://sandbox.iii.com/iii/sierra-api/docs/v5/patrons
type RequestBody = {
  recordType: string;
  recordNumber: number;
  pickupLocation: string;
  neededBy?: string;
  numberOfCopies?: number;
  note?: string;
};

export const createHold =
  (
    holdsStore: MemoryStore<string, string>
  ): RouteHandler<{ Params?: UrlParams; Body?: RequestBody }> =>
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
    if (holdsStore.has(itemId)) {
      reply.code(500).send({
        code: 132,
        specificCode: 2,
        httpStatus: 500,
        name: "XCirc error",
        description: "XCirc error : This record is not available",
      });
      return reply;
    }

    holdsStore.set(itemId, patronId);
    reply.code(204).send();
  };
