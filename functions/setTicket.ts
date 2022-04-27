import { Buffer } from "buffer";
import { APIGatewayEvent } from "aws-lambda";
import type { LambdaResponse } from "../types/lambda";
import { message } from "../utils/responses.js";
import { ticket } from "../utils/database.js";

const setTicket = async (event: APIGatewayEvent): Promise<LambdaResponse> => {
    console.debug(`Event: ${JSON.stringify(event)}`);

    const id = event.pathParameters?.id;

    if (!id) {
        return message(400, "Room ID is required");
    }

    if (!event.body) {
        return message(400, "Request body not found");
    }

    const body = event.isBase64Encoded ? Buffer.from(event.body, "base64").toString() : event.body;

    const { ticketId } = JSON.parse(body);

    if (!ticketId) {
        return message(400, "Ticket ID required");
    }

    console.info(`Setting ticket to ${ticketId}`);

    await ticket(id, ticketId);

    return message(200, "OK");
};

export default setTicket;
