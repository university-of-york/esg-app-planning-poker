import type { LambdaResponse } from "../types/lambda";

const message = (status: number, message: string): LambdaResponse => ({
    statusCode: status,
    headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
    },
    body: JSON.stringify({
        message,
        status,
    }),
    isBase64Encoded: false,
});

const result = (result: any): LambdaResponse => ({
    statusCode: 200,
    headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
    },
    body: JSON.stringify({
        message: "OK",
        status: 200,
        result,
    }),
    isBase64Encoded: false,
});

const redirect = (location: string): LambdaResponse => ({
    statusCode: 302,
    headers: {
        "Access-Control-Allow-Origin": "*",
        Location: location,
    },
    body: undefined,
    isBase64Encoded: false,
});

export { message, result, redirect };
