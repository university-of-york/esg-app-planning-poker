import { LambdaResponse } from '../types/lambda';

const message = (status: number, message: string): LambdaResponse => {
    return {
        statusCode: status,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            message,
            status: status,
        }),
        isBase64Encoded: false,
    };
}

const result = (result: any): LambdaResponse => {
    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            message: 'OK',
            status: 200,
            result,
        }),
        isBase64Encoded: false,
    };
};

const redirect = (location: string): LambdaResponse => {
    return {
        statusCode: 302,
        headers: {
            'Access-Control-Allow-Origin': '*',
            Location: location,
        },
        body: null,
        isBase64Encoded: false,
    };
};

export { message, result, redirect };
