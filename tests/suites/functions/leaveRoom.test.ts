import { expect } from "@jest/globals";
import { mockedDynamoClient } from "../../helpers/mocks";
// The below import is only valid following `npm run compile:test` - if you have IDE errors here, run that script first
import leaveRoom from "../../.build/functions/leaveRoom.js";

const client = mockedDynamoClient();

describe("Leave Room function", () => {
    beforeEach(() => {
        client.send.mockClear();
    });

    it("Throws an error if the POKER_TABLE env variable has not been set", async () => {
        const event = {
            pathParameters: {
                id: "test-id",
            },
            body: JSON.stringify({
                memberId: "test-host-id",
                memberName: "Member",
            }),
        };

        await expect(leaveRoom(event)).rejects.toThrow("Environment variable POKER_TABLE has not been initialised");

        expect(client.send).not.toHaveBeenCalled();
    });

    it("Returns 400 if ID path parameter not found", async () => {
        const event = {};

        const result = await leaveRoom(event);

        expect(client.send).not.toHaveBeenCalled();

        expect(result).toEqual(expect.objectContaining({ statusCode: 400 }));
        expect(result.body).toContain("Room ID is required");
    });

    it("Returns 400 if event body not provided", async () => {
        const event = {
            pathParameters: {
                id: "test-id",
            },
        };

        const result = await leaveRoom(event);

        expect(client.send).not.toHaveBeenCalled();

        expect(result).toEqual(expect.objectContaining({ statusCode: 400 }));
        expect(result.body).toContain("Request body not found");
    });

    it("Returns 400 if member ID not provided", async () => {
        const event = {
            pathParameters: {
                id: "test-id",
            },
            body: JSON.stringify({}),
        };

        const result = await leaveRoom(event);

        expect(client.send).not.toHaveBeenCalled();

        expect(result).toEqual(expect.objectContaining({ statusCode: 400 }));
        expect(result.body).toContain("Member ID required");
    });

    it("Valid event sends GET request & UPDATE request to dynamodb", async () => {
        process.env.POKER_TABLE = "poker-table";

        const event = {
            pathParameters: {
                id: "test-id",
            },
            body: JSON.stringify({
                memberId: "test-host-id",
            }),
        };

        const result = await leaveRoom(event);
        const body = JSON.parse(result.body);

        expect(client.send).toHaveBeenCalledWith(
            expect.objectContaining({
                Type: "GET",
                TableName: "poker-table",
                ConsistentRead: true,
                Key: {
                    id: { S: "test-id" },
                },
            }),
        );

        expect(client.send).toHaveBeenCalledWith(
            expect.objectContaining({
                Type: "UPDATE",
                TableName: "poker-table",
                Key: {
                    id: { S: "test-id" },
                },
                UpdateExpression: "SET members = :members",
                ExpressionAttributeValues: {
                    ":members": { L: [] },
                },
            }),
        );

        expect(result).toEqual(expect.objectContaining({ statusCode: 200 }));

        expect(body.status).toEqual(200);
        expect(body.message).toEqual("OK");
        expect(body.result).toBeUndefined();
    });
});
