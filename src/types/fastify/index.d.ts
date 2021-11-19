import { IncomingMessage, Server, ServerResponse } from "http";
import MemoryStore from "../../services/MemoryStore";
import HoldsStore from "../../services/HoldsStore";

// This needs to be here to hold the decorated server instance

declare module "fastify" {
  export interface FastifyInstance<
    HttpServer = Server,
    HttpRequest = IncomingMessage,
    HttpResponse = ServerResponse
  > {
    tokenStore: MemoryStore<string, boolean>;
    holdsStore: HoldsStore;
  }
}
