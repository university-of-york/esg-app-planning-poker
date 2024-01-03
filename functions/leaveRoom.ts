import { Buffer } from "buffer";
import { type APIGatewayEvent } from "aws-lambda";
import type { LambdaResponse } from "../types/lambda";
import { message } from "../utils/responses.js";
import { leave } from "../utils/database.js";

const leaveRoom = async (event: APIGatewayEvent): Promise<LambdaResponse> => {
    console.debug(`Event: ${JSON.stringify(event)}`);

    const id = event.pathParameters?.id;

    if (!id) {
        return message(400, "Room ID is required");
    }

    if (!event.body) {
        return message(400, "Request body not found");
    }

    const body = event.isBase64Encoded ? Buffer.from(event.body, "base64").toString() : event.body;

    const { memberId } = JSON.parse(body);

    if (!memberId || typeof memberId !== "string") {
        return message(400, "Member ID required");
    }

    console.info(`${memberId} is leaving room ${id}`);

    await leave(id, memberId);

    return message(200, "OK");
};

export default leaveRoom;
