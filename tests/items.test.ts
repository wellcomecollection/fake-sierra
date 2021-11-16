import { createServer } from "../src/server";
import { ItemResultSet } from "../src/types/Item";
import { accessToken } from "./helpers";
import { defaultFields, mandatoryFields } from "../src/handlers/get-items";

describe("GET /v5/items", () => {
  it("returns items with the given IDs", async () => {
    const ids = ["1234567", "1234568"];
    const server = await createServer();
    const { authHeaders } = await accessToken(server);
    const response = await server.inject({
      method: "GET",
      path: "/v5/items",
      query: { ids: ids.join(",") },
      headers: authHeaders,
    });

    expect(response.statusCode).toBe(200);
    const responseData = response.json() as ItemResultSet;
    expect(responseData.total).toBe(ids.length);
    expect(responseData.entries.map((item) => item.id)).toIncludeSameMembers(
      ids
    );
    responseData.entries.forEach((item) => {
      expect(item).toContainKeys(defaultFields);
    });
  });

  it("returns 50 random items when IDs are not specified", async () => {
    const server = await createServer();
    const { authHeaders } = await accessToken(server);
    const response = await server.inject({
      method: "GET",
      path: "/v5/items",
      headers: authHeaders,
    });

    expect(response.statusCode).toBe(200);
    const responseData = response.json() as ItemResultSet;
    expect(responseData.total).toBe(50);
    responseData.entries.forEach((item) => {
      expect(item).toContainKeys(defaultFields);
    });
  });

  it("returns items with the specified fields", async () => {
    const id = "1234567";
    const fields = ["createdDate", "status", "itemType"];
    const server = await createServer();
    const { authHeaders } = await accessToken(server);
    const response = await server.inject({
      method: "GET",
      path: "/v5/items",
      query: { ids: id, fields: fields.join(",") },
      headers: authHeaders,
    });

    expect(response.statusCode).toBe(200);
    const responseData = response.json() as ItemResultSet;
    expect(responseData.total).toBe(1);
    expect(responseData.entries[0].id).toBe(id);
    expect(responseData.entries[0]).toContainAllKeys([
      ...mandatoryFields,
      ...fields,
    ]);
  });

  it("indicates that items are on hold", async () => {
    const id = "1234567";
    const server = await createServer();
    const { authHeaders } = await accessToken(server);
    const responseBeforeHold = await server.inject({
      method: "GET",
      path: "/v5/items",
      query: { ids: id, fields: "holdCount" },
      headers: authHeaders,
    });

    expect(responseBeforeHold.statusCode).toBe(200);
    expect(responseBeforeHold.json().entries[0].holdCount).toBe(0);

    server.holdsStore.set(id, "test_user_id");

    const responseAfterHold = await server.inject({
      method: "GET",
      path: "/v5/items",
      query: { ids: id, fields: "holdCount" },
      headers: authHeaders,
    });

    expect(responseAfterHold.statusCode).toBe(200);
    expect(responseAfterHold.json().entries[0].holdCount).toBe(1);
  });

  it("consistently returns the same item for the same ID", async () => {
    const id = "1234567";
    const server = await createServer();
    const { authHeaders } = await accessToken(server);
    const response1 = await server.inject({
      method: "GET",
      path: "/v5/items",
      query: { ids: id },
      headers: authHeaders,
    });
    const response2 = await server.inject({
      method: "GET",
      path: "/v5/items",
      query: { ids: id },
      headers: authHeaders,
    });

    expect(response1.statusCode).toBe(200);
    expect(response2.statusCode).toBe(200);
    expect(response1.json()).toEqual(response2.json());
  });
});
