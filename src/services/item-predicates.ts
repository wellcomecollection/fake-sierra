import { Item } from "../types/items";

export const isRequestable = (item: Item): boolean => {
  // https://github.com/wellcomecollection/catalogue-api/blob/main/requests/src/main/scala/weco/api/requests/services/SierraRequestsService.scala#L118
  if (item.deleted || item.suppressed) {
    return false;
  }

  // https://github.com/wellcomecollection/catalogue-api/blob/main/requests/src/main/scala/weco/api/requests/services/SierraRequestsService.scala#L129
  if ((item.holdCount || 0) > 0) {
    return false;
  }

  // https://github.com/wellcomecollection/catalogue-api/blob/main/common/stacks/src/main/scala/weco/catalogue/source_model/sierra/rules/SierraItemAccess.scala#L90-L98
  // We ignore rules for requesting here
  return !!(
    item.location?.name.toLowerCase().includes("closed stores") &&
    item.status?.code === "-"
  );
};
