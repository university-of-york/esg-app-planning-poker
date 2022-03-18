import { APIGatewayEvent } from 'aws-lambda';
import type {LambdaResponse} from "../types/lambda";
import {message, result} from "../utils/responses";
import {get} from "../utils/database";

const getRoom = async (event: APIGatewayEvent): Promise<LambdaResponse> => {
    const id = event.pathParameters?.id;

    if (!id) {
        return message(400, "Room ID is required");
    }

    const room = await get(id);

    return result({room});
};

module.exports = getRoom;
