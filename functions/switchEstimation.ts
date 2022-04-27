import { Buffer } from "buffer";
import { APIGatewayEvent } from "aws-lambda";
import type { LambdaResponse } from "../types/lambda";
import { message } from "../utils/responses.js";
import { estimation } from "../utils/database.js";

const switchEstimation = async (event: APIGatewayEvent): Promise<LambdaResponse> => {
    console.debug(`Event: ${JSON.stringify(event)}`);

    const id = event.pathParameters?.id;

    if (!id) {
        return message(400, "Room ID is required");
    }

    if (!event.body) {
        return message(400, "Request body not found");
    }

    const body = event.isBase64Encoded ? Buffer.from(event.body, "base64").toString() : event.body;

    const { estimationType } = JSON.parse(body);

    if (!estimationType) {
        return message(400, "Estimation type required");
    }

    console.info(`Switching to estimation type ${estimationType}`);

    await estimation(id, estimationType);

    return message(200, "OK");
};

export default switchEstimation;
