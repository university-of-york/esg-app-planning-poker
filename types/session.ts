export declare type Session = {
    id: string;
    displayName: string;
    history: {
        roomId: string;
        roomName: string;
        lastVisited: string;
    }[];
};
