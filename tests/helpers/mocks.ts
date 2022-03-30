import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

// global.dynamoClient is populated whenever "new DynamoDBClient()" is instantiated (such as in database.ts)
// This mocking behaviour is defined in setup.ts
const mockedDynamoClient = (): jest.MockedClass<typeof DynamoDBClient & { send: jest.MockedFunction<any> }> => {
    return (global as any).dynamoClient;
};

export { mockedDynamoClient };
