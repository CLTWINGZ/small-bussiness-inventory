import app from "../bc/app.js";

export const config = {
  api: {
    bodyParser: false,
  },
};

// Minimal handler to avoid extra middleware layers that can add latency in serverless
export default function handler(req, res) {
  return app(req, res);
}
