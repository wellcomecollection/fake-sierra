import { createServer } from "../src/server";
import { accessToken } from "./helpers";
import { HoldResultSet } from "../src/types/patrons";

describe("POST /v5/patrons/:patronId/holds/requests", () => {
  it("creates a hold on an item", async () => {
    const patronId = "1234567";
    const itemId = "7654320"; // Closed stores
    const server = await createServer();
    const { authHeaders } = await accessToken(server);
    const response = await server.inject({
      method: "POST",
      path: `/v5/patrons/${patronId}/holds/requests`,
      headers: authHeaders,
      payload: {
        recordType: "i",
        recordNumber: parseInt(itemId),
        pickupLocation: "unspecified",
      },
    });

    expect(response.statusCode).toBe(204);
    expect(server.holdsStore.holdExistsForItem(itemId)).toBeTrue();
    expect(server.holdsStore.patronHolds(patronId)[0].record).toEndWith(itemId);
  });

  it("fails if there is already a hold for an item", async () => {
    const patronId = "1234567";
    const itemId = "7654320"; // Closed stores
    const server = await createServer();
    const { authHeaders } = await accessToken(server);

    server.holdsStore.create({ itemId, patronId });
    const response = await server.inject({
      method: "POST",
      path: `/v5/patrons/${patronId}/holds/requests`,
      headers: authHeaders,
      payload: {
        recordType: "i",
        recordNumber: parseInt(itemId),
        pickupLocation: "unspecified",
      },
    });

    expect(response.statusCode).toBe(500);
  });

  it("fails if the item is not requestable", async () => {
    const patronId = "1234567";
    const itemId = "7654321"; // Open shelves
    const server = await createServer();
    const { authHeaders } = await accessToken(server);

    const response = await server.inject({
      method: "POST",
      path: `/v5/patrons/${patronId}/holds/requests`,
      headers: authHeaders,
      payload: {
        recordType: "i",
        recordNumber: parseInt(itemId),
        pickupLocation: "unspecified",
      },
    });

    expect(response.statusCode).toBe(500);
  });
});

describe("GET /v5/patrons/:patronId/holds", () => {
  it("gets a list of the patron's holds", async () => {
    const patronId = "1234567";
    const holdItemIds = ["1000000", "2000000"];
    const server = await createServer();
    const { authHeaders } = await accessToken(server);

    holdItemIds.forEach((itemId) => {
      server.holdsStore.create({ patronId, itemId });
    });
    const response = await server.inject({
      method: "GET",
      path: `/v5/patrons/${patronId}/holds`,
      headers: authHeaders,
    });

    expect(response.statusCode).toBe(200);
    const responseData: HoldResultSet = response.json();
    expect(responseData.total).toBe(holdItemIds.length);
    expect(
      responseData.entries.map((hold) =>
        hold.record?.slice(hold?.record.length - 7)
      )
    ).toContainAllValues(holdItemIds);
  });

  it("returns an empty list if the patron doesn't exist", async () => {
    const server = await createServer();
    const { authHeaders } = await accessToken(server);

    const response = await server.inject({
      method: "GET",
      path: `/v5/patrons/1111111/holds`,
      headers: authHeaders,
    });

    expect(response.statusCode).toBe(200);
    const responseData: HoldResultSet = response.json();
    expect(responseData.total).toBe(0);
    expect(responseData.entries).toBeEmpty();
  });
});

describe("DELETE /v5/patrons/:patronId/holds", () => {
  it("deletes all of the patron's holds", async () => {
    const patronId = "1234567";
    const holdItemIds = ["1000000", "2000000"];
    const server = await createServer();
    const { authHeaders } = await accessToken(server);

    holdItemIds.forEach((itemId) => {
      server.holdsStore.create({ patronId, itemId });
    });
    const response = await server.inject({
      method: "DELETE",
      path: `/v5/patrons/${patronId}/holds`,
      headers: authHeaders,
    });

    expect(response.statusCode).toBe(204);
    expect(server.holdsStore.patronHolds(patronId)).toBeEmpty();
  });
});
