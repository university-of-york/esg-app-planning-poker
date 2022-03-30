import {expect} from "@jest/globals";
import {mockedDynamoClient} from "../../helpers/mocks";
import {UUID_REGEX} from "../../helpers/constants";
// The below import is only valid following `npm run compile:test` - if you have IDE errors here, run that script first
import createRoom from "../../.build/functions/createRoom.js";

const client = mockedDynamoClient();

describe("Create Room function",  () => {
    beforeEach(() => {
        client.send.mockClear();
    });

    it("Throws an error if the POKER_TABLE env variable has not been set", async () => {
        const event = {
            body: JSON.stringify({
                name: "Test Room",
                hostId: "test-host-id",
                hostName: "Host"
            })
        };

        await expect(createRoom(event)).rejects.toThrow('Environment variable POKER_TABLE has not been initialised');

        expect(client.send).not.toHaveBeenCalled();
    });

    it("Returns 400 if event body not provided", async () => {
        const event = {};

        const result = await createRoom(event);

        expect(client.send).not.toHaveBeenCalled();

        expect(result).toEqual(
            expect.objectContaining({statusCode: 400})
        );
        expect(result.body).toContain("Request body not found");
    });

    it("Returns 400 if room name not specified", async () => {
        const event = {
            body: JSON.stringify({
                hostId: "test-host-id",
                hostName: "Host"
            })
        };

        const result = await createRoom(event);

        expect(client.send).not.toHaveBeenCalled();

        expect(result).toEqual(
            expect.objectContaining({statusCode: 400})
        );
        expect(result.body).toContain("Name & creator parameters required");
    });

    it("Returns 400 if host id not specified", async () => {
        const event = {
            body: JSON.stringify({
                name: "Test Room",
                hostName: "Host"
            })
        };

        const result = await createRoom(event);

        expect(client.send).not.toHaveBeenCalled();

        expect(result).toEqual(
            expect.objectContaining({statusCode: 400})
        );
        expect(result.body).toContain("Name & creator parameters required");
    });

    it("Returns 400 if host name not specified", async () => {
        const event = {
            body: JSON.stringify({
                name: "Test Room",
                hostId: "test-host-id",
            })
        };

        const result = await createRoom(event);

        expect(client.send).not.toHaveBeenCalled();

        expect(result).toEqual(
            expect.objectContaining({statusCode: 400})
        );
        expect(result.body).toContain("Name & creator parameters required");
    });

    it("Valid event sends PUT request to dynamodb and returns room ID", async () => {
        process.env.POKER_TABLE = 'poker-table';

        const event = {
            body: JSON.stringify({
                name: "Test Room",
                hostId: "test-host-id",
                hostName: "Host"
            })
        };

        const result = await createRoom(event);
        const body = JSON.parse(result.body);

        expect(client.send).toHaveBeenCalledWith(
            expect.objectContaining({
                Type: "PUT",
                TableName: "poker-table",
                Item: {
                    id: { S: expect.stringMatching(UUID_REGEX) },
                    name: { S: "Test Room" },
                    hostId: { S: "test-host-id" },
                    state: { S: "HIDDEN" },
                    members: {
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

        expect(result).toEqual(
            expect.objectContaining({statusCode: 200})
        );

        expect(body.status).toEqual(200);
        expect(body.message).toEqual("OK");
        expect(body.result.id).toMatch(UUID_REGEX);
    });
});
