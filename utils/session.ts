import { DateTime } from "luxon";
import type { Session } from "../types/session";
import {Room} from "../types/room";

const BROWSER_STORAGE_KEY = "planning-poker-session";

const withSession = (): Session => {
    const json = localStorage.getItem(BROWSER_STORAGE_KEY);
    let session: Session;

    if (!window.crypto) {
        throw new Error("Crypto is not defined - this code should only be run within a browser context (client-side)");
    }

    if (json) {
        session = JSON.parse(json);

        if (!session.id) {
            session.id = window.crypto.randomUUID();
        }

        if (!session.displayName) {
            session.displayName = "";
        }

        if (!session.history) {
            session.history = [];
        }

        localStorage.setItem(BROWSER_STORAGE_KEY, JSON.stringify(session));
    } else {
        session = {
            id: window.crypto.randomUUID(),
            displayName: "",
            history: [],
        };

        localStorage.setItem(BROWSER_STORAGE_KEY, JSON.stringify(session));
    }

    return session;
};

const updateDisplayName = (name: string): void => {
    const session = withSession();

    session.displayName = name;

    localStorage.setItem(BROWSER_STORAGE_KEY, JSON.stringify(session));
};

const addRoomToHistory = (roomId: string, roomName: string): void => {
    const timestamp = DateTime.now().toISO();

    const session = withSession();

    const existingHistory = session.history.findIndex((history) => history.roomId === roomId);

    if (existingHistory >= 0) {
        session.history.splice(existingHistory, 1);
    }

    session.history.unshift({ roomId, roomName, lastVisited: timestamp });

    localStorage.setItem(BROWSER_STORAGE_KEY, JSON.stringify(session));
};

const getUser = (room: Room) => {
    const session = withSession();

    return room.members.find((member) => member.id === session.id);
};

const getHost = (room: Room) => {
    return room.members.find((member) => member.id === room.hostId);
};

const userIsHost = (room: Room) => {
    const user = getUser(room);
    const host = getHost(room);

    return host!.id === user!.id;
};


export { BROWSER_STORAGE_KEY, withSession, updateDisplayName, addRoomToHistory, getUser, getHost, userIsHost };
