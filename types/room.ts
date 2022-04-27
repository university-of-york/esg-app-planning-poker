export declare type Room = {
    id: string;
    name: string;
    hostId: string;
    state: "HIDDEN" | "REVEALED";
    estimation: "T-SHIRT" | "FIBONACCI" | "LINEAR";
    ticketId: string;
    jiraTicket: boolean;
    members: Member[];
};

export declare type Member = {
    id: string;
    displayName: string;
    choice: "" | "XS" | "S" | "M" | "L" | "XL";
};
