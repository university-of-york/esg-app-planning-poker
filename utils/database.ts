import {
    DynamoDBClient,
    GetItemCommand,
    PutItemCommand,
    UpdateItemCommand,
    AttributeValue,
} from "@aws-sdk/client-dynamodb";
import type { Room } from "../types/room";
import { pokerTable } from "./environment.js";

const client = new DynamoDBClient({
    region: "eu-west-1",
});

const create = async (id: string, name: string, hostId: string, hostName: string): Promise<void> => {
    const command = new PutItemCommand({
        TableName: pokerTable(),
        Item: {
            id: { S: id },
            name: { S: name },
            hostId: { S: hostId },
            state: { S: "HIDDEN" },
            estimation: { S: "T-SHIRT" },
            ticketId: { S: "" },
            jiraTicket: { BOOL: true },
            members: {
                L: [
                    {
                        M: {
                            id: { S: hostId },
                            displayName: { S: hostName },
                            choice: { S: "" },
                        },
                    },
                ],
            },
        },
    });

    const result = await client.send(command);

    if (result.$metadata.httpStatusCode !== 200) {
        throw new Error(`Could not create room: ${id}`);
    }
};

const rename = async (id: string, name: string): Promise<void> => {
    const command = new UpdateItemCommand({
        TableName: pokerTable(),
        Key: {
            id: { S: id },
        },
        UpdateExpression: "SET #name = :name",
        ExpressionAttributeNames: {
            "#name": "name",
        },
        ExpressionAttributeValues: {
            ":name": { S: name },
        },
    });

    const result = await client.send(command);

    if (result.$metadata.httpStatusCode !== 200) {
        throw new Error(`Could not rename room: ${id} to: "${name}"`);
    }
};

const get = async (id: string): Promise<Room> => {
    const command = new GetItemCommand({
        TableName: pokerTable(),
        ConsistentRead: true,
        Key: {
            id: { S: id },
        },
    });

    const result = await client.send(command);

    if (result.$metadata.httpStatusCode !== 200 || !result.Item) {
        throw new Error(`Could not retrieve details for room: ${id}`);
    }

    const item = result.Item;

    const room = {
        id: item.id?.S,
        name: item.name?.S,
        hostId: item.hostId?.S,
        state: item.state?.S,
        estimation: item.estimation?.S,
        ticketId: item.ticketId?.S,
        jiraTicket: item.jiraTicket?.BOOL,
        members: item.members?.L?.map((value: AttributeValue) => {
            const member = value.M!;

            return {
                id: member.id?.S,
                displayName: member.displayName?.S,
                choice: member.choice?.S,
            };
        }),
    };

    return room as Room;
};

const join = async (id: string, memberId: string, memberName: string): Promise<void> => {
    const command = new UpdateItemCommand({
        TableName: pokerTable(),
        Key: {
            id: { S: id },
        },
        UpdateExpression: "SET members = list_append(members, :member)",
        ExpressionAttributeValues: {
            ":member": {
                L: [
                    {
                        M: {
                            id: { S: memberId },
                            displayName: { S: memberName },
                            choice: { S: "" },
                        },
                    },
                ],
            },
        },
    });

    const result = await client.send(command);

    if (result.$metadata.httpStatusCode !== 200) {
        throw new Error(`Could not join room: ${id} for member ${memberId}:${memberName}`);
    }
};

const leave = async (id: string, memberId: string): Promise<void> => {
    const existingRoom = await get(id);

    const remainingMembers = existingRoom.members.filter((member) => member.id !== memberId);

    const mappedMembers = remainingMembers.map((member) => ({
        M: {
            id: { S: member.id },
            displayName: { S: member.displayName },
            choice: { S: member.choice },
        },
    }));

    const command = new UpdateItemCommand({
        TableName: pokerTable(),
        Key: {
            id: { S: id },
        },
        UpdateExpression: "SET members = :members",
        ExpressionAttributeValues: {
            ":members": { L: mappedMembers },
        },
    });

    const result = await client.send(command);

    if (result.$metadata.httpStatusCode !== 200) {
        throw new Error(`Could not leave room: ${id} for member ${memberId}`);
    }
};

const submit = async (id: string, memberId: string, choice: string): Promise<void> => {
    const room = await get(id);

    const memberIndex = room.members.findIndex((member) => member.id === memberId);

    const command = new UpdateItemCommand({
        TableName: pokerTable(),
        Key: {
            id: { S: id },
        },
        UpdateExpression: `SET members[${memberIndex}].choice = :choice`,
        ExpressionAttributeValues: {
            ":choice": { S: choice },
        },
    });

    const result = await client.send(command);

    if (result.$metadata.httpStatusCode !== 200) {
        throw new Error(`Could not submit choice for member ${memberId} in room ${id}`);
    }
};

const reveal = async (id: string): Promise<void> => {
    const command = new UpdateItemCommand({
        TableName: pokerTable(),
        Key: {
            id: { S: id },
        },
        UpdateExpression: "SET #state = :state",
        ExpressionAttributeNames: {
            "#state": "state",
        },
        ExpressionAttributeValues: {
            ":state": { S: "REVEALED" },
        },
    });

    const result = await client.send(command);

    if (result.$metadata.httpStatusCode !== 200) {
        throw new Error(`Could not reveal room ${id}`);
    }
};

const reset = async (id: string): Promise<void> => {
    const existingRoom = await get(id);

    const resetMembers = existingRoom.members.map((member) => ({
        M: {
            id: { S: member.id },
            displayName: { S: member.displayName },
            choice: { S: "" },
        },
    }));

    const command = new UpdateItemCommand({
        TableName: pokerTable(),
        Key: {
            id: { S: id },
        },
        UpdateExpression: "SET #state = :state, members = :members",
        ExpressionAttributeNames: {
            "#state": "state",
        },
        ExpressionAttributeValues: {
            ":state": { S: "HIDDEN" },
            ":members": { L: resetMembers },
        },
    });

    const result = await client.send(command);

    if (result.$metadata.httpStatusCode !== 200) {
        throw new Error(`Could not reset room: ${id}`);
    }
};

const estimation = async (id: string, type: string): Promise<void> => {
    const existingRoom = await get(id);

    const resetMembers = existingRoom.members.map((member) => ({
        M: {
            id: { S: member.id },
            displayName: { S: member.displayName },
            choice: { S: "" },
        },
    }));

    const command = new UpdateItemCommand({
        TableName: pokerTable(),
        Key: {
            id: { S: id },
        },
        UpdateExpression: "SET estimation = :estimation, members = :members",
        ExpressionAttributeValues: {
            ":estimation": { S: type },
            ":members": { L: resetMembers },
        },
    });

    const result = await client.send(command);

    if (result.$metadata.httpStatusCode !== 200) {
        throw new Error(`Could not set estimation type: ${type} for room: ${id}`);
    }
};

const ticket = async (id: string, ticketId: string, jiraTicket: boolean): Promise<void> => {
    const command = new UpdateItemCommand({
        TableName: pokerTable(),
        Key: {
            id: { S: id },
        },
        UpdateExpression: "SET ticketId = :ticket, jiraTicket = :jira",
        ExpressionAttributeValues: {
            ":ticket": { S: ticketId },
            ":jira": { BOOL: jiraTicket },
        },
    });

    const result = await client.send(command);

    if (result.$metadata.httpStatusCode !== 200) {
        throw new Error(`Could not set ticket: ${ticketId} for room: ${id}`);
    }
};

export { create, rename, get, join, leave, submit, reveal, reset, estimation, ticket };
