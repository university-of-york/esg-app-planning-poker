import {request} from "./request";
import {withSession} from "./session";
import {Room} from "../types/room";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const createRoom = async (name: string) => {
    const session = withSession();

    const result = await request("POST", `${BASE_URL}/room`, {name, creatorId: session.id, creatorName: session.displayName});

    if (result.success) {
        window.location.replace(`/session/${result.body.id}`);
    }
};

const getRoom = async (id: string): Promise<Room | null> => {
    const result = await request("GET", `${BASE_URL}/room/${id}`);

    if (!result.success) {
        return null;
    }

    return result.body.room as Room;
};

export {
    createRoom,
    getRoom,
}
