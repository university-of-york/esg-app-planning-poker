const TEST_DB_POKER_ROOM = {
    id: { S: "test-room-id" },
    name: { S: "Test Room" },
    hostId: { S: "test-host-id" },
    state: { S: "HIDDEN" },
    members: {
        L: [
            {
                M: {
                    id: { S: "test-host-id" },
                    displayName: { S: "Host" },
                    choice: { S: "M" },
                },
            },
        ],
    },
};

const UUID_REGEX = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/;

export { TEST_DB_POKER_ROOM, UUID_REGEX };
