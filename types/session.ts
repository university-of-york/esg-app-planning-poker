export declare type Session = {
    id: string;
    displayName: string;
    history: History[];
};

declare type History = {
    roomId: string;
    roomName: string;
    lastVisited: string;
};
