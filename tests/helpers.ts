import { FastifyInstance } from "fastify";
import { OutgoingHttpHeaders } from "http";

export const accessToken = async (
  server: FastifyInstance
): Promise<{
  access_token: string;
  expires_in: number;
  authHeaders: OutgoingHttpHeaders;
}> => {
  const response = await server.inject({
    method: "POST",
    url: "/token",
  });
  const data = response.json();
  return {
    ...data,
    authHeaders: {
      Authorization: `Bearer ${data.access_token}`,
    },
  };
};
