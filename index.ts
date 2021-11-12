import { createServer } from "./src/server";

const server = createServer({ logger: true });

const start = async () => {
  try {
    await server.listen(process.env.PORT ?? 8000, "0.0.0.0");
  } catch (error) {
    server.log.error(error);
    process.exit(1);
  }
};

start();
