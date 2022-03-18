import {APIGatewayEvent} from "aws-lambda";
import type {LambdaResponse} from "../types/lambda";
import {message} from "../utils/responses";
import {submit} from "../utils/database";

const submitChoice = async (event: APIGatewayEvent): Promise<LambdaResponse> => {
    const id = event.pathParameters?.id;

    if (!id) {
        return message(400, "Room ID is required");
    }

    if (!event.body) {
        return message(400, "Request body not found");
    }

    const {member, choice} = JSON.parse(event.body);

    if (!member || !choice) {
        return message(400, "Member & choice parameters required");
    }

    await submit(id, member, choice);

    return message(200, 'OK');
};

module.exports = submitChoice;
