import type { Room } from "../types/room";
import type { Result } from "../types/responses";
import { request } from "./request";
import { withSession } from "./session";
import { BASE_URL } from "./environment";

const createRoom = async (name: string): Promise<{ success: boolean; id: string }> => {
    const session = withSession();

    const response = await request<Result>("POST", `${BASE_URL}/room`, {
        name,
        hostId: session.id,
        hostName: session.displayName,
    });

    return {
        success: response.success,
        id: response.body.result.id,
    };
};

const getRoom = async (roomId: string): Promise<Room | undefined> => {
    const response = await request<Result>("GET", `${BASE_URL}/room/${roomId}`);

    if (!response.success) {
        return;
    }

    return response.body.result.room;
};

const renameRoom = async (roomId: string, name: string): Promise<void> => {
    const response = await request("POST", `${BASE_URL}/room/${roomId}/rename`, {
        name,
    });

    if (!response.success) {
        throw new Error(`Could not rename room`);
    }
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

const leaveRoom = (roomId: string, memberId: string): void => {
    // See https://developer.mozilla.org/en-US/docs/Web/API/Navigator/sendBeacon for info
    // This is a reliable/safe way of asynchronously sending a web request as the page unloads
    // Fetch is not safe/reliable, as it may be unloaded before the request is actually made
    // Essentially, we cannot "await fetch" during a page unload
    navigator.sendBeacon(`${BASE_URL}/room/${roomId}/leave`, JSON.stringify({ memberId }));
};

const kickMember = async (roomId: string, memberId: string): Promise<void> => {
    const response = await request("POST", `${BASE_URL}/room/${roomId}/leave`, {
        memberId,
    });

    if (!response.success) {
        throw new Error(`Could not kick member`);
    }
};

const submitChoice = async (roomId: string, memberId: string, choice: string): Promise<void> => {
    const response = await request("POST", `${BASE_URL}/room/${roomId}/choice`, {
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

const switchEstimation = async (roomId: string, estimationType: string): Promise<void> => {
    const response = await request("POST", `${BASE_URL}/room/${roomId}/estimation`, {
        estimationType,
    });

    if (!response.success) {
        throw new Error(`Could not switch estimation type`);
    }
};

const setTicket = async (roomId: string, ticketId: string, jiraTicket: boolean): Promise<void> => {
    const response = await request("POST", `${BASE_URL}/room/${roomId}/ticket`, {
        ticketId,
        jiraTicket,
    });

    if (!response.success) {
        throw new Error(`Could not set ticket`);
    }
};

const logMessage = async (level: string, message: string, stacktrace?: string): Promise<string | undefined> => {
    const response = await request<Result>("POST", `${BASE_URL}/log`, {
        level,
        message,
        stacktrace,
    });

    if (!response.success) {
        // Do not throw an error here as this may prevent the ErrorBoundary component from rendering properly
        return;
    }

    return response.body.result.id;
};

export {
    createRoom,
    getRoom,
    renameRoom,
    joinRoom,
    leaveRoom,
    kickMember,
    submitChoice,
    revealRoom,
    resetRoom,
    switchEstimation,
    setTicket,
    logMessage,
};
