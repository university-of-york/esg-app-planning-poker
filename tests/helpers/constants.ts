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

export { TEST_DB_POKER_ROOM };
