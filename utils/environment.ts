const getEnvironmentVariable = (key: string): string => {
    let value = process.env[key];

    if (!value || value === '') {
        throw new Error(`Environment variable ${key} has not been initialised`);
    }

    return value;
};

export { getEnvironmentVariable };
