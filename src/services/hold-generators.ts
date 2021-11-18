import { Chance } from "chance";
import { Hold } from "../types/patrons";

type CreateHoldOptions = {
  itemId: string;
  patronId: string;
  apiBaseUrl?: string;
};

const getDDMMYYY = (date: Date = new Date()) => {
  const yyyy = new Intl.DateTimeFormat("en", { year: "numeric" }).format(date);
  const mm = new Intl.DateTimeFormat("en", { month: "2-digit" }).format(date);
  const dd = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(date);
  return `${yyyy}-${mm}-${dd}`;
};

const nonSeededRandom = new Chance();

// IDs in holds are URLs to objects in the API - they are not
// necessarily implemented/dereferencable in fake sierra!
const defaultBaseUrl = "https://fake-sierra.wellcomecollection.org";

export const createHold = ({
  itemId,
  patronId,
  apiBaseUrl = defaultBaseUrl,
}: CreateHoldOptions): Hold => ({
  id: `${apiBaseUrl}/v5/patrons/holds/${nonSeededRandom
    .natural({ min: 1e5, max: 1e6 })
    .toString()}`,
  record: `${apiBaseUrl}/v5/items/${itemId}`,
  patron: `${apiBaseUrl}/v5/patrons/${patronId}`,
  frozen: false,
  placed: getDDMMYYY(),
  notWantedBeforeDate: getDDMMYYY(),
  pickupLocation: {
    code: "sgmed",
    name: "Library Enquiry Desk",
  },
  status: {
    code: "0",
    name: "on hold.",
  },
  recordType: "i",
  priority: 1,
});
