import { APIGatewayEvent } from "aws-lambda";
import type { LambdaResponse } from "../types/lambda";
import { message } from "../utils/responses.js";
import { reset } from "../utils/database.js";

const resetRoom = async (event: APIGatewayEvent): Promise<LambdaResponse> => {
    console.debug(`Event: ${JSON.stringify(event)}`);

    const id = event.pathParameters?.id;

    if (!id) {
        return message(400, "Room ID is required");
    }

    await reset(id);

    return message(200, "OK");
};

export default resetRoom;
