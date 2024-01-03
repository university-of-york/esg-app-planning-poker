import path from "path";
import { type IncomingMessage, type ServerResponse } from "http";
import next from "next";
import express from "express";

const app = next({});
const handle = app.getRequestHandler();
const server = express();

// serve static assets directly from the build-time-generated ".next" folder and specify how long to cache
server.use(
    `/_next`,
    express.static(path.join(path.resolve(path.dirname("")), ".next"), { maxAge: "7d", immutable: true }),
);

// serve requests with Next by default
server.get("*", (req: IncomingMessage, res: ServerResponse) => {
    // res.setHeader("Cache-Control", "public, max-age=86400");
    handle(req, res);
});

export default server;
