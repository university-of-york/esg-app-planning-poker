const sls = require("serverless-http");

const binaryMimeTypes = require("./binaryMimeTypes.js");

const server = require("./server.js");
const getRoom = require('./functions/getRoom.js');
const createRoom = require('./functions/createRoom.js');
const joinRoom = require('./functions/joinRoom.js');
const resetRoom = require('./functions/resetRoom.js');
const revealRoom = require('./functions/revealRoom.js');
const submitChoice = require('./functions/submitChoice.js');

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
    getRoom,
    createRoom,
    joinRoom,
    resetRoom,
    revealRoom,
    submitChoice,
};
