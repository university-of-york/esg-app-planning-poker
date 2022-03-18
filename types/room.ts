export declare type Room = {
    id: string;
    name: string;
    state: "HIDDEN" | "REVEALED";
    members: Member[];
}

declare type Member = {
    id: string;
    displayName: string;
    choice: "XS" | "S" | "M" | "L" | "XL" | "";
}
