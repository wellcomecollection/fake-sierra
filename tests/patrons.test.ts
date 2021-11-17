import { createServer } from "../src/server";
import { accessToken } from "./helpers";

describe("POST /v5/patrons/:patronId/holds/requests", () => {
  it("creates a hold on an item", async () => {
    const patronId = "1234567";
    const itemId = "7654321";
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
    expect(server.holdsStore.has(itemId)).toBeTrue();
    expect(server.holdsStore.get(itemId)).toBe(patronId);
  });

  it("fails if there is already a hold for an item", async () => {
    const patronId = "1234567";
    const itemId = "7654321";
    const server = await createServer();
    const { authHeaders } = await accessToken(server);

    server.holdsStore.set(itemId, patronId);
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
