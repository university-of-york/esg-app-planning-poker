const getEnvironmentVariable = (key: string): string => {
    const value = process.env[key];

    if (!value || value === "") {
        throw new Error(`Environment variable ${key} has not been initialised`);
    }

    return value;
};

export { getEnvironmentVariable };
