import { createServer } from "../src/server";
import { tokenStore } from "../src/services";

const server = createServer();

describe("/token", () => {
  it("returns an access token and stores it", async () => {
    const response = await server.inject({
      method: "GET",
      url: "/v5/token",
    });

    expect(response.statusCode).toBe(200);
    expect(response.json().token_type).toBe("bearer");
    expect(tokenStore.get(response.json().access_token)).not.toBeUndefined();
  });
});
