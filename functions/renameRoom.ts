import { Buffer } from "buffer";
import { v4 as uuid } from "uuid";
import { APIGatewayEvent } from "aws-lambda";
import type { LambdaResponse } from "../types/lambda";
import { message, result } from "../utils/responses.js";
import { rename } from "../utils/database.js";

const renameRoom = async (event: APIGatewayEvent): Promise<LambdaResponse> => {
    console.debug(`Event: ${JSON.stringify(event)}`);

    const id = uuid();

    if (!event.body) {
        return message(400, "Request body not found");
    }

    const body = event.isBase64Encoded ? Buffer.from(event.body, "base64").toString() : event.body;

    const { name } = JSON.parse(body);

    if (!name) {
        return message(400, "Name parameter required");
    }

    console.info(`Renaming room ${id} to "${name}"`);

    await rename(id, name);

    return message(200, "OK");
};

export default renameRoom;
