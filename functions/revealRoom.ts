import {APIGatewayEvent} from "aws-lambda";
import type {LambdaResponse} from "../types/lambda";
import {message} from "../utils/responses";
import {reveal} from "../utils/database";

const revealRoom = async (event: APIGatewayEvent): Promise<LambdaResponse> => {
    const id = event.pathParameters?.id;

    if (!id) {
        return message(400, "Room ID is required");
    }

    await reveal(id);

    return message(200, 'OK');
};

module.exports = revealRoom;
