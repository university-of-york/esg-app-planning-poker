import { Buffer } from "buffer";
import { v4 as uuid } from "uuid";
import { APIGatewayEvent } from "aws-lambda";
import type { LambdaResponse } from "../types/lambda";
import { message, result } from "../utils/responses.js";
import { create } from "../utils/database.js";

const createRoom = async (event: APIGatewayEvent): Promise<LambdaResponse> => {
    console.debug(`Event: ${JSON.stringify(event)}`);

    const id = uuid();

    if (!event.body) {
        return message(400, "Request body not found");
    }

    const body = event.isBase64Encoded ? Buffer.from(event.body, "base64").toString() : event.body;

    const { name, hostId, hostName } = JSON.parse(body);

    if (!name || !hostId || !hostName) {
        return message(400, "Name & creator parameters required");
    }

    console.info(`Creating room ${id}:${name} for ${hostId}:${hostName}`);

    await create(id, name, hostId, hostName);

    return result({ id });
};

export default createRoom;
