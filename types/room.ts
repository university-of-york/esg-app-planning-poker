export declare type Room = {
    id: string;
    name: string;
    hostId: string;
    state: "HIDDEN" | "REVEALED";
    estimation: "LINEAR" | "FIBONACCI" | "T-SHIRT";
    ticketId: string;
    members: Member[];
};

export declare type Member = {
    id: string;
    displayName: string;
    choice: "" | "XS" | "S" | "M" | "L" | "XL";
};
