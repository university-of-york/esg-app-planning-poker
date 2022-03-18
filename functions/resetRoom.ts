import {APIGatewayEvent} from "aws-lambda";
import type {LambdaResponse} from "../types/lambda";
import {message} from "../utils/responses";
import {reset} from "../utils/database";

const resetRoom = async (event: APIGatewayEvent): Promise<LambdaResponse> => {
    const id = event.pathParameters?.id;

    if (!id) {
        return message(400, "Room ID is required");
    }

    await reset(id);

    return message(200, 'OK');
};

module.exports = resetRoom;
