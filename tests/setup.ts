import React from "react";
import "@testing-library/jest-dom/extend-expect";
import fetchMock from "jest-fetch-mock";
import { TEST_DB_POKER_ROOM } from "./helpers/constants";

global.React = React;

fetchMock.enableMocks();

jest.mock("@aws-sdk/client-dynamodb", () => ({
    DynamoDBClient: jest.fn().mockImplementation(() => {
        const mockedClient = {
            send: jest.fn().mockImplementation(() => ({
                $metadata: { httpStatusCode: 200 },
                Item: TEST_DB_POKER_ROOM,
            })),
        };
        // Globally store the mocked client so that we can use it for interaction testing - see helpers/mocks.ts
        (global as any).dynamoClient = mockedClient;
        return mockedClient;
    }),
    GetItemCommand: jest.fn().mockImplementation((input) => ({
        ...input,
        Type: "GET",
    })),
    PutItemCommand: jest.fn().mockImplementation((input) => ({
        ...input,
        Type: "PUT",
    })),
    UpdateItemCommand: jest.fn().mockImplementation((input) => ({
        ...input,
        Type: "UPDATE",
    })),
}));

jest.mock("uuid", () => ({
    v4: jest.fn(() => "mock-uuid"),
}));
