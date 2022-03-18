export declare type Response = {
    success: boolean;
    status: number;
    body: any;
};

const request = async (
    method: "GET" | "POST" | "PUT" | "DELETE",
    url: string,
    body?: any
): Promise<Response> => {
    console.debug(`${method}: ${url}`);
    try {
        const headers = new Headers({
            'Content-Type': 'application/json',
        });

        const response = await fetch(url, {
            method: method,
            body: body ? JSON.stringify(body) : null,
            headers: headers,
        });

        console.debug(`Response ${response.status}`);

        const json = response.status !== 204 ? await response.json() : {};

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
            body: JSON.stringify(error),
        };
    }
};

export { request };
