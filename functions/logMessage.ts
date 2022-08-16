import { Buffer } from "buffer";
import { APIGatewayEvent } from "aws-lambda";
import { DateTime } from "luxon";
import { v4 as uuid } from "uuid";
import type { LambdaResponse } from "../types/lambda";
import { message } from "../utils/responses.js";
import { log } from "../utils/database.js";

const logMessage = async (event: APIGatewayEvent): Promise<LambdaResponse> => {
    console.debug(`Event: ${JSON.stringify(event)}`);

    const timestamp = DateTime.now().toISO();
    const id = uuid();

    if (!event.body) {
        return message(400, "Request body not found");
    }

    const body = event.isBase64Encoded ? Buffer.from(event.body, "base64").toString() : event.body;

    const { level, message: msg, stacktrace } = JSON.parse(body);

    console.info(`Received log: ${id}: ${level}: ${msg}`);

    await log(id, timestamp, level, msg, stacktrace);

    return message(200, "OK");
};

export default logMessage;
