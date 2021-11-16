import { RouteHandler } from "fastify";
import { Chance } from "chance";
import { Item } from "../types/Item";
import MemoryStore from "../services/MemoryStore";
import { ItemResultSet } from "../types/Item";

type Parameters = {
  ids?: string;
  fields?: string;
};

type ItemOptions = {
  id: string;
  onHold?: boolean;
};

const createDates = (rand: Chance.Chance) => {
  const createdDate = rand.date({
    year: parseInt(rand.year({ min: 1995, max: 2020 })),
  }) as Date;
  const msToUpdate = rand.natural({
    max:
      new Date(2020, 11, 31, 23, 59, 59, 999).getTime() - createdDate.getTime(),
  });
  const updatedDate = new Date(
    createdDate.getTime() + msToUpdate
  ).toISOString();
  return { updatedDate, createdDate: createdDate.toISOString() };
};

const createItem = (
  { id, onHold }: ItemOptions,
  override?: Partial<Item>
): Item => {
  const rand = new Chance(id);
  const { updatedDate, createdDate } = createDates(rand);
  const idOpts: Partial<Chance.StringOptions> = {
    alpha: true,
    numeric: true,
    casing: "upper",
  };
  return {
    id,
    createdDate,
    updatedDate,
    location: { code: "abcde", name: "Closed Stores test" },
    status: {
      code: "-",
      display: "Available",
    },
    deleted: false,
    suppressed: false,
    holdCount: onHold ? 1 : 0,
    callNumber: rand.string({ ...idOpts, length: 5 }),
    barcode: rand.string({ ...idOpts, length: 5 }),
    bibIds: [rand.natural({ min: 1e6, max: 1e7 }).toString()],
    copyNo: 1,
    itemType: "book",
    fixedFields: {
      "79": {
        value: "abcde",
        display: "Closed Stores test",
      },
    },
    varFields: [],
    volumes: [],
    ...override,
  };
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

const randomIds = (n: number, seed: string | number): string[] => {
  const rand = new Chance(seed);
  const array = Array.from({ length: n }).map(() =>
    rand.natural({ min: 1e6, max: 1e7 }).toString()
  );

  // Prevent collisions
  if (new Set(array).size === array.length) {
    return array;
  } else {
    return randomIds(n, seed);
  }
};

export const getItems =
  (
    holdsStore: MemoryStore<string, string>
  ): RouteHandler<{ Querystring?: Parameters }> =>
  (request, reply) => {
    const { ids, fields } = request.query ?? {};
    const idList = ids?.split(",") ?? randomIds(50, "SEED");
    const fieldList = fields?.split(",") ?? defaultFields;

    const items: Item[] = idList.map((id) => {
      const onHold = holdsStore.has(id);
      const fullItem = createItem({ id, onHold });
      const fieldSet = new Set([...fieldList, ...mandatoryFields]);
      return Object.assign(
        {},
        ...Array.from(fieldSet.values()).map((field) => ({
          [field]: fullItem[field],
        }))
      );
    });

    const response: ItemResultSet = {
      total: items.length,
      start: 0,
      entries: items,
    };
    reply.send(response);
  };
