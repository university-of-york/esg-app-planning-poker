import { APIGatewayEvent } from "aws-lambda";
import type { LambdaResponse } from "../types/lambda";
import { message, result } from "../utils/responses.js";
import { get } from "../utils/database.js";

const getRoom = async (event: APIGatewayEvent): Promise<LambdaResponse> => {
    console.debug(`Event: ${JSON.stringify(event)}`);

    const id = event.pathParameters?.id;

    if (!id) {
        return message(400, "Room ID is required");
    }

    const room = await get(id);

    return result({ room });
};

export default getRoom;
