import sls from "serverless-http";
import binaryMimeTypes from "./binaryMimeTypes.js";

import server from "./server.js";
import getRoom from "./functions/getRoom.js";
import createRoom from "./functions/createRoom.js";
import joinRoom from "./functions/joinRoom.js";
import resetRoom from "./functions/resetRoom.js";
import revealRoom from "./functions/revealRoom.js";
import submitChoice from "./functions/submitChoice.js";

const handler = sls(server, {
    binary: binaryMimeTypes,
});

const serverHandler = async (event, context) => {
    console.debug(`Event: ${JSON.stringify(event)}`);

    const response = await handler(event, context);

    console.debug(`Response: ${JSON.stringify(response)}`);

    return response;
};

export { serverHandler as server, getRoom, createRoom, joinRoom, resetRoom, revealRoom, submitChoice };
