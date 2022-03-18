import {DynamoDBClient, GetItemCommand, PutItemCommand, ScanCommand, UpdateItemCommand, DeleteItemCommand, AttributeValue} from '@aws-sdk/client-dynamodb';
import {getEnvironmentVariable} from "./environment";
import type {Room} from "../types/room";

const POKER_TABLE = getEnvironmentVariable("POKER_TABLE");

const client = new DynamoDBClient({
    region: 'eu-west-1'
});

const get = async (id: string): Promise<Room> => {
  const command = new GetItemCommand({
      TableName: POKER_TABLE,
      ConsistentRead: true,
      Key: {
          id: { S: id }
      },
  });

  const result = await client.send(command);

  if (result.$metadata.httpStatusCode !== 200 || !result.Item) {
      throw new Error(`Could not retrieve details for room: ${id}`);
  }

  const room = result.Item;

  return {
      id: room.id.S!,
      name: room.name.S!,
      // @ts-ignore
      state: room.state.S!,
      // @ts-ignore
      members: room.members.L?.map((value: AttributeValue) => {
          const member = value.M!;

          return {
              id: member.id.S!,
              displayName: member.displayName.S!,
              choice: member.choice.S!
          }
      })
  };
};

const create = async (id: string, name: string, creatorId: string, creatorName: string): Promise<void> => {
    const command = new PutItemCommand({
        TableName: POKER_TABLE,
        Item: {
            id: { S: id },
            name: { S: name },
            state: { S: "HIDDEN" },
            members: { L: [
                { M: {
                    id: { S: creatorId },
                    displayName: { S: creatorName},
                    choice: { S: "" },
                }}
            ]}
        }
    });

    const result = await client.send(command);

    if (result.$metadata.httpStatusCode !== 200) {
        throw new Error(`Could not create room: ${id}`);
    }
};

const reset = async (id: string): Promise<void> => {
    const existingRoom = await get(id);

    const resetMembers = existingRoom.members.map((member) => (
        { M: {
                id: { S: member.id },
                choice: { S: "" },
            }
        }
    ));

    const command = new UpdateItemCommand({
        TableName: POKER_TABLE,
        Key: {
            id: { S: id }
        },
        UpdateExpression: "SET #state = :state, members = :members",
        ExpressionAttributeNames: {
            '#state': 'state'
        },
        ExpressionAttributeValues: {
            ':state': { S: 'HIDDEN' },
            ':members': { L: resetMembers },
        }
    });

    const result = await client.send(command);

    if (result.$metadata.httpStatusCode !== 200) {
        throw new Error(`Could not retrieve details for room: ${id}`);
    }
};

const join = async (id: string, member: string): Promise<void> => {
    const command = new UpdateItemCommand({
        TableName: POKER_TABLE,
        Key: {
            id: { S: id }
        },
        UpdateExpression: "SET members = list_append(members, :member)",
        ExpressionAttributeValues: {
            ':member': {
                L: [
                    { M : {
                        id: { S: member },
                        choice: { S: "" },
                    }}
                ]
            }
        }
    });

    const result = await client.send(command);

    if (result.$metadata.httpStatusCode !== 200) {
        throw new Error(`Could not retrieve details for room: ${id}`);
    }
};

const submit = async (id: string, memberId: string, choice: string): Promise<void> => {
    const room = await get(id);

    const memberIndex = room.members.findIndex((member) => member.id === memberId);

    const command = new UpdateItemCommand({
        TableName: POKER_TABLE,
        Key: {
            id: { S: id }
        },
        UpdateExpression: `SET members[${memberIndex}].choice = :choice`,
        ExpressionAttributeValues: {
           ':choice': { S: choice },
        }
    });

    const result = await client.send(command);

    if (result.$metadata.httpStatusCode !== 200) {
        throw new Error(`Could not submit choice for member ${memberId} in room ${id}`);
    }
};

const reveal = async (id: string): Promise<void> => {
    const command = new UpdateItemCommand({
        TableName: POKER_TABLE,
        Key: {
            id: { S: id }
        },
        UpdateExpression: "SET #state = :state",
        ExpressionAttributeNames: {
            '#state': 'state',
        },
        ExpressionAttributeValues: {
            ':state': { S: "REVEALED" },
        }
    });

    const result = await client.send(command);

    if (result.$metadata.httpStatusCode !== 200) {
        throw new Error(`Could not reveal room ${id}`);
    }
};

export {
    get,
    create,
    join,
    reset,
    submit,
    reveal,
};
