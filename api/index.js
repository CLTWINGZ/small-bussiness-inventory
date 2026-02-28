import app from "../bc/app.js";

export const config = {
  api: {
    bodyParser: false,
  },
};

// Strip the /api prefix (Vercel sends full path) so Express routes like "/auth/login" match.
export default function handler(req, res) {
  req.url = req.url.replace(/^\/api/, "") || "/";
  return app(req, res);
}
