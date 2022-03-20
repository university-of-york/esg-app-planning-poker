import {Room} from "./room";

export declare type Message = {
    status: number;
    message: string;
};

export declare type Result = Message & {
    result: {
        id: string;
        room: Room;
    }
};
