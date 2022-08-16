import type { AppProps } from "next/app";
import { configureLogging } from "../utils/logger";
import "../styles/globals.css";

const PlanningPoker = ({ Component, pageProps }: AppProps) => {
    configureLogging();

    return <Component {...pageProps} />;
};

export default PlanningPoker;
