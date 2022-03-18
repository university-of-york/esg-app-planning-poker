const sls = require("serverless-http");

const binaryMimeTypes = require("./binaryMimeTypes.js");

const server = require("./server.js");

const handler = sls(server, {
    binary: binaryMimeTypes,
});

module.exports = {
    server: async (event, context) => {
        console.debug(`Event: ${JSON.stringify(event)}`);

        const response = await handler(event, context);

        console.debug(`Response: ${JSON.stringify(response)}`);

        return response;
    },
};
