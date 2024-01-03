import { Buffer } from "buffer";
import { type APIGatewayEvent } from "aws-lambda";
import type { LambdaResponse } from "../types/lambda";
import { message } from "../utils/responses.js";
import { join } from "../utils/database.js";

const joinRoom = async (event: APIGatewayEvent): Promise<LambdaResponse> => {
    console.debug(`Event: ${JSON.stringify(event)}`);

    const id = event.pathParameters?.id;

    if (!id) {
        return message(400, "Room ID is required");
    }

    if (!event.body) {
        return message(400, "Request body not found");
    }

    const body = event.isBase64Encoded ? Buffer.from(event.body, "base64").toString() : event.body;

    const { memberId, memberName } = JSON.parse(body);

    if (!memberId || typeof memberId !== "string" || !memberName || typeof memberName !== "string") {
        return message(400, "Member ID & name required");
    }

    console.info(`${memberId}:${memberName} is joining room ${id}`);

    await join(id, memberId, memberName);

    return message(200, "OK");
};

export default joinRoom;
