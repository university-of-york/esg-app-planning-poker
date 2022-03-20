import type { Room } from "../types/room.js";
import { request } from "./request.js";
import { withSession } from "./session.js";
import {Result} from "../types/responses";
import {BASE_URL} from "./environment";

const createRoom = async (name: string) => {
    const session = withSession();

    const response = await request<Result>("POST", `${BASE_URL}/room`, {
        name,
        hostId: session.id,
        hostName: session.displayName,
    });

    if (response.success) {
        console.log(`Response: ${JSON.stringify(response.body)}`);
        window.location.replace(`/table/${response.body.result.id}`);
    }
};

const getRoom = async (roomId: string): Promise<Room | undefined> => {
    const response = await request<Result>("GET", `${BASE_URL}/room/${roomId}`);

    if (!response.success) {
        return;
    }

    return response.body.result.room;
};

const joinRoom = async (roomId: string, memberId: string, memberName: string): Promise<void> => {
    const response = await request("POST", `${BASE_URL}/room/${roomId}/join`, {
        memberId,
        memberName,
    });

    if (!response.success) {
        throw new Error(`Could not join room`);
    }
};

const submitChoice = async (roomId: string, memberId: string, choice: string): Promise<void> => {
    const response = await request("PUT", `${BASE_URL}/room/${roomId}/choice`, {
        memberId,
        choice,
    });

    if (!response.success) {
        throw new Error(`Could not submit choice`);
    }
};

const revealRoom = async (roomId: string): Promise<void> => {
    const response = await request("POST", `${BASE_URL}/room/${roomId}/reveal`);

    if (!response.success) {
        throw new Error(`Could not reveal room`);
    }
};

const resetRoom = async (roomId: string): Promise<void> => {
    const response = await request("POST", `${BASE_URL}/room/${roomId}/reset`);

    if (!response.success) {
        throw new Error(`Could not reset room`);
    }
};

export { createRoom, getRoom, joinRoom, submitChoice, revealRoom, resetRoom };
