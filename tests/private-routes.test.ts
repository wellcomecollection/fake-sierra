import { createServer } from "../src/server";
import { accessToken } from "./helpers";

describe("private routes", () => {
  it("are rejected when no token is present", async () => {
    const server = createServer();
    const response = await server.inject({
      method: "GET",
      url: "/v5/items",
    });

    expect(response.statusCode).toBe(401);
  });

  it("are rejected when an invalid token is present", async () => {
    const server = createServer();
    const response = await server.inject({
      method: "GET",
      url: "/v5/items",
      headers: {
        Authorization: "beep boop",
      },
    });

    expect(response.statusCode).toBe(401);
  });

  it("are accepted when a valid token is present", async () => {
    const server = createServer();
    const { access_token } = await accessToken(server);
    const response = await server.inject({
      method: "GET",
      url: "/v5/items",
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    expect(response.statusCode).toBe(200);
  });
});
