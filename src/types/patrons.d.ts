import { Location } from "./items";

/**
 * the data describing a hold
 */
export interface Hold {
  /**
   * the hold ID
   */
  id: string;
  /**
   * the bib, item, or volume record number associated with the hold (the endpoint returned for volume holds is not a valid API endpoint; it is returned for volume record ID information only)
   */
  record?: string;
  /**
   * the patron record number associated with the hold
   */
  patron: string;
  /**
   * whether the record is frozen
   */
  frozen?: boolean;
  /**
   * the date the hold was placed, in ISO 8601 format (yyyy-MM-dd)
   */
  placed?: string;
  /**
   * the date the hold expires, in ISO 8601 format (yyyy-MM-dd)
   */
  notNeededAfterDate?: string;
  /**
   * the date before which the system should not fill the hold, in ISO 8601 format (yyyy-MM-dd)
   */
  notWantedBeforeDate?: string;
  /**
   * the date by which the hold must be picked up (in ISO 8601 format (yyyy-MM-dd'T'HH:mm:ssZZ))
   */
  pickupByDate?: string;
  location?: Location;
  pickupLocation?: Location1;
  status?: HoldStatus;
  /**
   * a record type code, i.e., bib (b), item (i), or volume (j)
   */
  recordType?: string;
  /**
   * the priority (place in line) of the hold
   */
  priority?: number;
  /**
   * the length of the hold queue
   */
  priorityQueueLength?: number;
  /**
   * an informational note related to the hold
   */
  note?: string;
  /**
   * whether the record can be frozen
   */
  canFreeze?: boolean;
  [k: string]: unknown;
}

/**
 * the hold status code and description
 */
export interface HoldStatus {
  /**
   * the hold status code
   */
  code: string;
  /**
   * the description of the status
   */
  name: string;
  [k: string]: unknown;
}

/**
 * a paged set of hold results
 */
export interface HoldResultSet {
  /**
   * the total number of results
   */
  total?: number;
  /**
   * the starting position of this set
   */
  start?: number;
  /**
   * the hold entries
   */
  entries: Hold[];
  [k: string]: unknown;
}
