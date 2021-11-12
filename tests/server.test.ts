import { createServer } from "../src/server";

const server = createServer();

describe("server", () => {
  it("responds to requests", async () => {
    const response = await server.inject({
      method: "GET",
      url: "/",
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toBe("Hello world!");
  });
});
