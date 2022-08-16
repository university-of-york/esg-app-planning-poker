import { logMessage } from "./api";

const configureLogging = () => {
    const originalError = console.error;

    console.error = (message, error) => {
        logMessage("ERROR", message, error?.stacktrace);

        originalError(message, error);
    };
};

export { configureLogging };
