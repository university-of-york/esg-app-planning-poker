import type { AppProps } from "next/app";
import { ErrorBoundary } from "../components";
import "../styles/globals.css";

const PlanningPoker = ({ Component, pageProps }: AppProps) => {
    return (
        <ErrorBoundary>
            <Component {...pageProps} />
        </ErrorBoundary>
    );
};

export default PlanningPoker;
