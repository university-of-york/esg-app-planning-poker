import { Buffer } from "buffer";
import { type APIGatewayEvent } from "aws-lambda";
import { DateTime } from "luxon";
import { v4 as uuid } from "uuid";
import type { LambdaResponse } from "../types/lambda";
import { message, result } from "../utils/responses.js";
import { log } from "../utils/database.js";

const logMessage = async (event: APIGatewayEvent): Promise<LambdaResponse> => {
    console.debug(`Event: ${JSON.stringify(event)}`);

    const timestamp = DateTime.now().toISO();
    const id = uuid();

    if (!event.body) {
        return message(400, "Request body not found");
    }

    const body = event.isBase64Encoded ? Buffer.from(event.body, "base64").toString() : event.body;

    const { level, message: message_, stacktrace } = JSON.parse(body);

    if (!level || typeof level !== "string" || !message_ || typeof message_ !== "string") {
        return message(400, "Level and message are required");
    }

    const stack = typeof stacktrace === "string" ? stacktrace : undefined;

    console.info(`Received log: ${id}: ${level}: ${message_}`);

    await log(id, timestamp, level, message_, stack);

    return result({ id });
};

export default logMessage;
