const getEnvironmentVariable = (key: string): string => {
    const value = process.env[key];

    if (!value || value === "") {
        throw new Error(`Environment variable ${key} has not been initialised`);
    }

    return value;
};

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ? process.env.NEXT_PUBLIC_BASE_URL : "";

const pokerTable = () => getEnvironmentVariable('POKER_TABLE');

export { getEnvironmentVariable, BASE_URL, pokerTable };
