import MemoryStore from "./MemoryStore";
import { Hold } from "../types/patrons";
import { createHold } from "./hold-generators";

class HoldsStore {
  private holds = new MemoryStore<string, Hold>(); // item id -> hold
  private patrons = new MemoryStore<string, string[]>(); // patron id -> item ids

  public holdExistsForItem(itemId: string): boolean {
    return this.holds.has(itemId);
  }

  public deleteForPatron(patronId: string): void {
    const itemIds = this.patrons.get(patronId);
    if (itemIds) {
      itemIds.forEach((id) => this.holds.delete(id));
    }
    this.patrons.set(patronId, []);
  }

  public create({
    patronId,
    itemId,
  }: {
    patronId: string;
    itemId: string;
  }): Hold | undefined {
    if (this.holdExistsForItem(itemId)) {
      return undefined;
    }

    const hold = createHold({ patronId, itemId });
    this.holds.set(itemId, hold);
    const oldPatronItemIds = this.patrons.get(patronId) || [];
    this.patrons.set(patronId, [...oldPatronItemIds, itemId]);
  }

  public patronHolds(patronId: string): Hold[] {
    const patronItemIds = this.patrons.get(patronId) || [];
    return patronItemIds
      .map((itemId) => this.holds.get(itemId))
      .filter((hold): hold is Hold => typeof hold !== "undefined");
  }
}

export default HoldsStore;
