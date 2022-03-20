import {Message} from "../types/responses";

export declare type Response<T extends Message> = {
    success: boolean;
    status: number;
    body: T;
};

const request = async <T extends Message>(method: "GET" | "POST" | "PUT" | "DELETE", url: string, body?: any): Promise<Response<T>> => {
    console.debug(`${method}: ${url}`);
    try {
        const headers = new Headers({
            "Content-Type": "application/json",
        });

        const response = await fetch(url, {
            method,
            body: body ? JSON.stringify(body) : null,
            headers,
        });

        console.debug(`Response ${response.status}`);

        const json = response.status === 204 ? {} : await response.json();

        return {
            success: response.ok,
            status: response.status,
            body: json,
        };
    } catch (error) {
        console.error(error);
        return {
            success: false,
            status: 500,
            // @ts-ignore
            body: {
                status: 500,
                message: JSON.stringify(error)
            },
        };
    }
};

export { request };
