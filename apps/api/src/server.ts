import { Server } from "http";
import app from "./app.js";
import { env } from "./app/config/env.js";

let server: Server;

async function main() {
  server = app.listen(env.PORT, () => {
    console.log(`🚀 API server running on http://localhost:${env.PORT}`);
  });
}

main();

process.on("unhandledRejection", (err) => {
  console.error("😈 Unhandled rejection detected, shutting down...", err);
  if (server) {
    server.close(() => process.exit(1));
  } else {
    process.exit(1);
  }
});

process.on("uncaughtException", (err) => {
  console.error("😈 Uncaught exception detected, shutting down...", err);
  process.exit(1);
});
