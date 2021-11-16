import { Chance } from "chance";
import { Item } from "../types/items";

type ItemOptions = {
  id: string;
  onHold?: boolean;
};

const idOpts: Partial<Chance.StringOptions> = {
  alpha: true,
  numeric: true,
  casing: "upper",
};

export const createItem = (
  { id, onHold }: ItemOptions,
  override?: Partial<Item>
): Item => {
  const rand = new Chance(id);
  const { updatedDate, createdDate } = createDates(rand);
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
        label: "LOCATION",
        value: "abcde",
        display: "Closed Stores test",
      },
      "88": {
        label: "STATUS",
        value: "-",
        display: "Available",
      },
      "108": {
        label: "OPACMSG",
        value: "f",
        display: "Online request",
      },
    },
    varFields: [],
    volumes: [],
    ...override,
  };
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

export const randomIds = (n: number, seed: string | number): string[] => {
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
