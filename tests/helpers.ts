import { FastifyInstance } from "fastify";

export const accessToken = async (
  server: FastifyInstance
): Promise<{ access_token: string; expires_in: number }> => {
  const response = await server.inject({
    method: "GET",
    url: "/token",
  });

  return response.json();
};
