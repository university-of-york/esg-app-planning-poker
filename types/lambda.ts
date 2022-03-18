export declare type LambdaResponse = {
    isBase64Encoded: boolean;
    statusCode: number;
    headers: Record<string, unknown>;
    body: string | null;
};
