/* global process */
import app from './app.js';

const preferredPort = Number(process.env.PORT) || 4000;

function start(port) {
  const server = app.listen(port, () => {
    console.log(`API running on http://localhost:${port}`);
  });

  server.on("error", (err) => {
    if (err.code === "EADDRINUSE" && port < preferredPort + 5) {
      const next = port + 1;
      console.warn(`Port ${port} in use, trying ${next}...`);
      start(next);
    } else {
      console.error("Failed to start server:", err);
      process.exit(1);
    }
  });
}

start(preferredPort);
