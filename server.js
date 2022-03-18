const path = require("path");
const next = require("next");
const app = next({});
const handle = app.getRequestHandler();
const express = require("express");

const server = express();

// serve static assets directly from the build-time-generated ".next" folder and specify how long to cache
server.use(`/_next`, express.static(path.join(__dirname, ".next"), { maxAge: "1d", immutable: true }));

// serve requests with Next by default
server.get("*", (req, res) => {
    // res.setHeader("Cache-Control", "public, max-age=86400");
    handle(req, res);
});

module.exports = server;
