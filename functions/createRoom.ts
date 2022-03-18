import {v4 as uuid} from 'uuid';
import {APIGatewayEvent} from "aws-lambda";
import type {LambdaResponse} from "../types/lambda";
import {message, result} from "../utils/responses";
import {create} from "../utils/database";

const createRoom = async (event: APIGatewayEvent): Promise<LambdaResponse> => {
    const id = uuid();

    if (!event.body) {
        return message(400, "Request body not found");
    }

    const {name, creatorId, creatorName} = JSON.parse(event.body);

    if (!name || !creatorId || !creatorName) {
        return message(400, "Name & creator parameters required");
    }

    await create(id, name, creatorId, creatorName);

    return result({id});
};

module.exports = createRoom;
