import { expect } from "@jest/globals";
import { mockedDynamoClient } from "../../helpers/mocks";
// The below import is only valid following `npm run compile:test` - if you have IDE errors here, run that script first
import revealRoom from "../../.build/functions/revealRoom.js";

const client = mockedDynamoClient();

describe("Reveal Room function", () => {
    beforeEach(() => {
        client.send.mockClear();
    });

    it("Throws an error if the POKER_TABLE env variable has not been set", async () => {
        const event = {
            pathParameters: {
                id: "test-id",
            },
        };

        await expect(revealRoom(event)).rejects.toThrow("Environment variable POKER_TABLE has not been initialised");

        expect(client.send).not.toHaveBeenCalled();
    });

    it("Returns 400 if ID path parameter not found", async () => {
        const event = {};

        const result = await revealRoom(event);

        expect(client.send).not.toHaveBeenCalled();

        expect(result).toEqual(expect.objectContaining({ statusCode: 400 }));
        expect(result.body).toContain("Room ID is required");
    });

    it("Valid event sends UPDATE request to dynamodb", async () => {
        process.env.POKER_TABLE = "poker-table";

        const event = {
            pathParameters: {
                id: "test-id",
            },
        };

        const result = await revealRoom(event);
        const body = JSON.parse(result.body);

        expect(client.send).toHaveBeenCalledWith(
            expect.objectContaining({
                Type: "UPDATE",
                TableName: "poker-table",
                Key: {
                    id: { S: "test-id" },
                },
                UpdateExpression: "SET #state = :state",
                ExpressionAttributeNames: {
                    "#state": "state",
                },
                ExpressionAttributeValues: {
                    ":state": { S: "REVEALED" },
                },
            })
        );

        expect(result).toEqual(expect.objectContaining({ statusCode: 200 }));

        expect(body.status).toEqual(200);
        expect(body.message).toEqual("OK");
        expect(body.result).toBeUndefined();
    });
});
