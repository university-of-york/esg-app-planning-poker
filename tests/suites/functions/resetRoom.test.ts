import { expect } from "@jest/globals";
import { mockedDynamoClient } from "../../helpers/mocks";
// The below import is only valid following `npm run compile:test` - if you have IDE errors here, run that script first
import resetRoom from "../../.build/functions/resetRoom.js";

const client = mockedDynamoClient();

describe("Reset Room function", () => {
    beforeEach(() => {
        client.send.mockClear();
    });

    it("Throws an error if the POKER_TABLE env variable has not been set", async () => {
        const event = {
            pathParameters: {
                id: "test-id",
            },
        };

        await expect(resetRoom(event)).rejects.toThrow("Environment variable POKER_TABLE has not been initialised");

        expect(client.send).not.toHaveBeenCalled();
    });

    it("Returns 400 if ID path parameter not found", async () => {
        const event = {};

        const result = await resetRoom(event);

        expect(client.send).not.toHaveBeenCalled();

        expect(result).toEqual(expect.objectContaining({ statusCode: 400 }));
        expect(result.body).toContain("Room ID is required");
    });

    it("Valid event sends GET request & UPDATE request to dynamodb", async () => {
        process.env.POKER_TABLE = "poker-table";

        const event = {
            pathParameters: {
                id: "test-id",
            },
        };

        const result = await resetRoom(event);
        const body = JSON.parse(result.body);

        expect(client.send).toHaveBeenCalledWith(
            expect.objectContaining({
                Type: "GET",
                TableName: "poker-table",
                ConsistentRead: true,
                Key: {
                    id: { S: "test-id" },
                },
            })
        );

        expect(client.send).toHaveBeenCalledWith(
            expect.objectContaining({
                Type: "UPDATE",
                TableName: "poker-table",
                Key: {
                    id: { S: "test-id" },
                },
                UpdateExpression: "SET #state = :state, members = :members",
                ExpressionAttributeNames: {
                    "#state": "state",
                },
                ExpressionAttributeValues: {
                    ":state": { S: "HIDDEN" },
                    ":members": {
                        L: [
                            {
                                M: {
                                    id: { S: "test-host-id" },
                                    displayName: { S: "Host" },
                                    choice: { S: "" },
                                },
                            },
                        ],
                    },
                },
            })
        );

        expect(result).toEqual(expect.objectContaining({ statusCode: 200 }));

        expect(body.status).toEqual(200);
        expect(body.message).toEqual("OK");
        expect(body.result).toBeUndefined();
    });
});
