/**
 * an item record
 */
export interface Item {
  /**
   * the item record ID
   */
  id: string;
  /**
   * the date and time of the last update to the record, in ISO 8601 format (yyyy-MM-dd'T'HH:mm:ssZZ)
   */
  updatedDate?: string;
  /**
   * the date and time the record was created, in ISO 8601 format (yyyy-MM-dd'T'HH:mm:ssZZ)
   */
  createdDate?: string;
  /**
   * the date the record was deleted, in ISO 8601 format (yyyy-MM-dd)
   */
  deletedDate?: string;
  /**
   * whether the record has been deleted
   */
  deleted: boolean;
  /**
   * whether the record has been suppressed
   */
  suppressed: boolean;
  /**
   * the IDs of the bibliographic records to which this item is linked
   */
  bibIds: string[];
  location?: Location;
  status?: ItemStatus;
  /**
   * the links to the volume records associated with this item
   */
  volumes?: string[];
  /**
   * the barcode found in the item record
   */
  barcode?: string;
  /**
   * the call number found in the item record
   */
  callNumber?: string;
  /**
   * the type of the item record
   */
  itemType?: string;
  transitInfo?: ItemTransitInfo;
  /**
   * indicates which copy of the title corresponds to the item record
   */
  copyNo?: number;
  /**
   * the number of holds associated with the item
   */
  holdCount?: number;
  /**
   * the fixed-length fields from the item record
   */
  fixedFields: {
    [k: number | string]: FixedField;
  };
  /**
   * the variable-length fields from the item record
   */
  varFields: VarField[];
  [k: string]: unknown;
}
/**
 * the location of the item with the location code and name
 */
export interface Location {
  /**
   * the location code
   */
  code: string;
  /**
   * the location display name
   */
  name: string;
  [k: string]: unknown;
}
/**
 * the status of the item, with the code and display value, and a due date if the item is checked out
 */
export interface ItemStatus {
  /**
   * the item status code
   */
  code?: string;
  /**
   * the display value of the item status
   */
  display?: string;
  /**
   * the due date of a checked-out item, in ISO 8601 format (yyyyMMdd'T'HHmmssZ)
   */
  duedate?: string;
  [k: string]: unknown;
}
/**
 * transit information for the item record
 */
export interface ItemTransitInfo {
  to: Location;
  /**
   * in transit for hold
   */
  forHold: boolean;
  [k: string]: unknown;
}
/**
 * a variable-length field for a bibliographic record or item record
 */
export interface VarField {
  /**
   * the Innovative variable-length field type tag
   */
  fieldTag: string;
  /**
   * the MARC tag
   */
  marcTag?: string;
  /**
   * the first MARC indicator, if present
   */
  ind1?: string;
  /**
   * the second MARC indicator, if present
   */
  ind2?: string;
  /**
   * the field content for varfields with no subfields
   */
  content?: string;
  /**
   * a list of subfields, if present
   */
  subfields?: SubField[];
  [k: string]: unknown;
}
/**
 * a subfield of a variable-length field
 */
export interface SubField {
  /**
   * a subfield code
   */
  tag: string;
  /**
   * the subfield content
   */
  content: string;
  [k: string]: unknown;
}

/**
 * a fixed-length field from a bibliographic record or item record
 */
export interface FixedField<T = string> {
  /**
   * the customizable label for the field
   */
  label: string;
  /**
   * the stored value of the field
   */
  value?: T;
  /**
   * the display value of the field
   */
  display: string;
}

/**
 * a paged set of item results
 */
export interface ItemResultSet {
  /**
   * the total number of results
   */
  total?: number;
  /**
   * the starting position of this set
   */
  start?: number;
  /**
   * the items in this set
   */
  entries: Item[];
  [k: string]: unknown;
}
