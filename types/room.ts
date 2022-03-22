export declare type Room = {
    id: string;
    name: string;
    hostId: string;
    state: "HIDDEN" | "REVEALED";
    members: Member[];
};

export declare type Member = {
    id: string;
    displayName: string;
    choice: "" | "XS" | "S" | "M" | "L" | "XL";
};
