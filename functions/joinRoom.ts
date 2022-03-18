import {APIGatewayEvent} from "aws-lambda";
import type {LambdaResponse} from "../types/lambda";
import {message} from "../utils/responses";
import {join} from "../utils/database";

const joinRoom = async (event: APIGatewayEvent): Promise<LambdaResponse> => {
    const id = event.pathParameters?.id;

    if (!id) {
        return message(400, "Room ID is required");
    }

    if (!event.body) {
        return message(400, "Request body not found");
    }

    const {member} = JSON.parse(event.body);

    if (!member) {
        return message(400, "Member ID required");
    }

    await join(id, member);

    return message(200, 'OK');
};

module.exports = joinRoom;
