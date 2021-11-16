import { createItem } from "../src/services/item-generators";

describe("item variant generation", () => {
  it("generates Closed Stores / Available items for IDs matching xxxxxx0", () => {
    const item = createItem({ id: "1234560" });
    expect(item.location?.name.toLowerCase()).toContain("closed stores");
    expect(item.fixedFields["79"]?.display?.toLowerCase()).toContain(
      "closed stores"
    );
    expect(item.fixedFields["108"]?.value).toBe("f");
    expect(item.status?.code).toBe("-");
    expect(item.fixedFields["88"].value).toEqual("-");
  });

  it("generates Open Shelves / Available items for IDs matching xxxxxx1", () => {
    const item = createItem({ id: "1234561" });
    expect(item.location?.name.toLowerCase()).toContain("open shelves");
    expect(item.fixedFields["79"]?.display?.toLowerCase()).toContain(
      "open shelves"
    );
    expect(item.fixedFields["108"]?.value).toBe("o");
    expect(item.status?.code).toBe("-");
    expect(item.fixedFields["88"].value).toEqual("-");
  });

  it("generates Closed Stores / Available items for other IDs", () => {
    const item = createItem({ id: "1234567" });
    expect(item.location?.name.toLowerCase()).toContain("closed stores");
    expect(item.fixedFields["79"]?.display?.toLowerCase()).toContain(
      "closed stores"
    );
    expect(item.fixedFields["108"]?.value).toBe("f");
    expect(item.status?.code).toBe("-");
    expect(item.fixedFields["88"].value).toEqual("-");
  });
});
