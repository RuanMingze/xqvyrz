const { createServer } = require("https");
const { parse } = require("url");
const next = require("next");
const fs = require("fs");
const path = require("path");

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(
    {
      key: fs.readFileSync(path.join(__dirname, "localhost-key.pem")),
      cert: fs.readFileSync(path.join(__dirname, "localhost.pem")),
    },
    async (req, res) => {
      try {
        const parsedUrl = parse(req.url, true);
        await handle(req, res, parsedUrl);
      } catch (err) {
        console.error("Error occurred handling", req.url, err);
        res.statusCode = 500;
        res.end("internal server error");
      }
    }
  ).listen(port, () => {
    console.log(`> Ready on https://${hostname}:${port}`);
  });
});
