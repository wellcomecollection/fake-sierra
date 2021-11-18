import { Chance } from "chance";
import { FixedField, Item, ItemStatus, Location } from "../types/items";

type ItemVariant = "closed-stores-available" | "open-shelves-available";

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

  const variant = getVariantForId(id);
  const location = getLocation(variant);
  const status = getStatus(variant);
  const opacMsg = getOpacMsg(variant);
  const { updatedDate, createdDate } = createDates(rand);

  return {
    id,
    createdDate,
    updatedDate,
    location,
    status,
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
        value: location.code,
        display: location.name,
      },
      "88": {
        label: "STATUS",
        value: status.code,
        display: status.display || "",
      },
      "108": {
        label: "OPACMSG",
        ...opacMsg,
      },
    },
    varFields: [],
    volumes: [],
    ...override,
  };
};
// See behaviour described in README
const getVariantForId = (id: string): ItemVariant => {
  if (id.length === 7 && id.endsWith("0")) {
    return "closed-stores-available";
  }
  if (id.length === 7 && id.endsWith("1")) {
    return "open-shelves-available";
  }
  return "closed-stores-available";
};

// See https://github.com/wellcomecollection/catalogue-api/blob/main/common/stacks/src/main/scala/weco/catalogue/source_model/sierra/rules/SierraPhysicalLocationType.scala
const getLocation = (variant: ItemVariant): Location => {
  switch (variant) {
    case "closed-stores-available":
      return {
        code: "abcde",
        name: "Closed stores test",
      };
    case "open-shelves-available":
      return {
        code: "bcdef",
        name: "Open shelves test",
      };
  }
};

// See https://github.com/wellcomecollection/catalogue-api/blob/main/common/stacks/src/main/scala/weco/catalogue/source_model/sierra/source/Status.scala
const getStatus = (variant: ItemVariant): ItemStatus => {
  switch (variant) {
    case "closed-stores-available":
    case "open-shelves-available":
      return {
        code: "-",
        display: "Available",
      };
  }
};

// See https://github.com/wellcomecollection/catalogue-api/blob/main/common/stacks/src/main/scala/weco/catalogue/source_model/sierra/source/OpacMsg.scala
const getOpacMsg = (variant: ItemVariant): Omit<FixedField, "label"> => {
  switch (variant) {
    case "closed-stores-available":
      return {
        value: "f",
        display: "Online request",
      };
    case "open-shelves-available":
      return {
        value: "o",
        display: "Open shelves",
      };
  }
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
