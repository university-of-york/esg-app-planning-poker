import { expect } from "@jest/globals";
import { mockedDynamoClient } from "../../helpers/mocks";
// The below import is only valid following `npm run compile:test` - if you have IDE errors here, run that script first
import joinRoom from "../../.build/functions/joinRoom.js";

const client = mockedDynamoClient();

describe("Join Room function", () => {
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

        await expect(joinRoom(event)).rejects.toThrow("Environment variable POKER_TABLE has not been initialised");

        expect(client.send).not.toHaveBeenCalled();
    });

    it("Returns 400 if ID path parameter not found", async () => {
        const event = {};

        const result = await joinRoom(event);

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

        const result = await joinRoom(event);

        expect(client.send).not.toHaveBeenCalled();

        expect(result).toEqual(expect.objectContaining({ statusCode: 400 }));
        expect(result.body).toContain("Request body not found");
    });

    it("Returns 400 if member ID not provided", async () => {
        const event = {
            pathParameters: {
                id: "test-id",
            },
            body: JSON.stringify({
                memberName: "Member",
            }),
        };

        const result = await joinRoom(event);

        expect(client.send).not.toHaveBeenCalled();

        expect(result).toEqual(expect.objectContaining({ statusCode: 400 }));
        expect(result.body).toContain("Member ID & name required");
    });

    it("Returns 400 if member name not provided", async () => {
        const event = {
            pathParameters: {
                id: "test-id",
            },
            body: JSON.stringify({
                memberId: "test-host-id",
            }),
        };

        const result = await joinRoom(event);

        expect(client.send).not.toHaveBeenCalled();

        expect(result).toEqual(expect.objectContaining({ statusCode: 400 }));
        expect(result.body).toContain("Member ID & name required");
    });

    it("Valid event sends UPDATE request to dynamodb", async () => {
        process.env.POKER_TABLE = "poker-table";

        const event = {
            pathParameters: {
                id: "test-id",
            },
            body: JSON.stringify({
                memberId: "test-host-id",
                memberName: "Member",
            }),
        };

        const result = await joinRoom(event);
        const body = JSON.parse(result.body);

        expect(client.send).toHaveBeenCalledWith(
            expect.objectContaining({
                Type: "UPDATE",
                TableName: "poker-table",
                Key: {
                    id: { S: "test-id" },
                },
                UpdateExpression: "SET members = list_append(members, :member)",
                ExpressionAttributeValues: {
                    ":member": {
                        L: [
                            {
                                M: {
                                    id: { S: "test-host-id" },
                                    displayName: { S: "Member" },
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
