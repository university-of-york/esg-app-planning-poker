import { APIGatewayEvent } from "aws-lambda";
import type { LambdaResponse } from "../types/lambda";
import { message } from "../utils/responses.js";
import { submit } from "../utils/database.js";

const submitChoice = async (event: APIGatewayEvent): Promise<LambdaResponse> => {
    console.debug(`Event: ${JSON.stringify(event)}`);

    const id = event.pathParameters?.id;

    if (!id) {
        return message(400, "Room ID is required");
    }

    if (!event.body) {
        return message(400, "Request body not found");
    }

    const body = event.isBase64Encoded ? Buffer.from(event.body, 'base64').toString() : event.body;

    const {memberId, choice } = JSON.parse(body);

    if (!memberId || !choice) {
        return message(400, "Member & choice parameters required");
    }

    console.info(`Submitting choice ${choice} for ${memberId}`);

    await submit(id, memberId, choice);

    return message(200, "OK");
};

export default submitChoice;
