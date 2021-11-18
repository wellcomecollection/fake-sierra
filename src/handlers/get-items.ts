import { FastifyInstance, RouteHandler } from "fastify";
import { Item, ItemResultSet } from "../types/items";
import { createItem, randomIds } from "../services/item-generators";

type Parameters = {
  id?: string;
  fields?: string;
};

export const mandatoryFields: Array<keyof Item> = ["id"];
export const defaultFields: Array<keyof Item> = [
  "id",
  "updatedDate",
  "createdDate",
  "deleted",
  "bibIds",
  "location",
  "status",
  "volumes",
  "barcode",
  "callNumber",
];

const pickFields = <T extends Record<string, unknown>>(
  fields: (number | string)[],
  object: T
): T =>
  Object.assign({}, ...fields.map((field) => ({ [field]: object[field] })));

export const getItems =
  (
    holdsStore: FastifyInstance["holdsStore"]
  ): RouteHandler<{ Querystring?: Parameters }> =>
  (request, reply) => {
    const { id, fields } = request.query ?? {};
    const idList = id?.split(",") ?? randomIds(50, "SEED");
    const fieldList = fields?.split(",") ?? defaultFields;
    const fieldSet = [...new Set([...fieldList, ...mandatoryFields])];

    const items: Item[] = idList.map((id) => {
      const onHold = holdsStore.holdExistsForItem(id);
      const fullItem = createItem({ id, onHold });
      return pickFields(fieldSet, fullItem);
    });

    const response: ItemResultSet = {
      total: items.length,
      start: 0,
      entries: items,
    };
    reply.send(response);
  };
