import React, { ErrorInfo } from "react";
import { logMessage } from "../../utils/api";

class ErrorBoundary extends React.Component {
    static getDerivedStateFromError() {
        // Update state so the next render will show the fallback UI
        return { hasError: true };
    }

    constructor(props: any) {
        super(props);

        // Define a state variable to track whether is an error or not
        this.state = { hasError: false };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        logMessage("ERROR", error.message, errorInfo.componentStack);
    }

    render() {
        // Check if the error is thrown
        // @ts-ignore
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return (
                <div>
                    <h2>Oops, there is an error!</h2>
                    <button type="button" onClick={() => this.setState({ hasError: false })}>
                        Try again?
                    </button>
                </div>
            );
        }

        // Return children components in case of no error
        return this.props.children;
    }
}

export { ErrorBoundary };
