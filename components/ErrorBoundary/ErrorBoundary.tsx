import React, { type ErrorInfo } from "react";
import { logMessage } from "../../utils/api";
import { Button } from "../Button/Button";
// @ts-ignore
import styles from "./ErrorBoundary.module.css";

class ErrorBoundary extends React.Component<any, { hasError: boolean; reference?: string }> {
    static getDerivedStateFromError() {
        // Update state so the next render will show the fallback UI
        return { hasError: true, reference: undefined };
    }

    constructor(props: any) {
        super(props);

        // Define a state variable to track whether is an error or not
        this.state = { hasError: false, reference: undefined };
    }

    async componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        const reference = await logMessage("ERROR", error.message, errorInfo.componentStack);

        this.setState({ ...this.state, reference });
    }

    render() {
        // Check if the error is thrown
        // @ts-ignore
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return (
                <div className={styles.container}>
                    <img
                        className={styles.logo}
                        src="https://www.york.ac.uk/static/stable/img/logo.svg"
                        alt="University of York Logo"
                    />

                    <h2 className={styles.heading}>A client-side error has occurred.</h2>

                    {this.state.reference ? (
                        <p className={styles.reference}>
                            Your error reference code is <strong>{this.state.reference}</strong>.
                            <br />
                            Please provide this code if you report this issue.
                        </p>
                    ) : (
                        ""
                    )}

                    <Button className={styles.retry} onClick={() => this.setState({ hasError: false })}>
                        Try again?
                    </Button>
                </div>
            );
        }

        // Return children components in case of no error
        return this.props.children;
    }
}

export { ErrorBoundary };
