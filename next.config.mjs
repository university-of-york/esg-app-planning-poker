import path from "path";
import dotenv from "dotenv-webpack";

const env = process.env.STACK_ENV ? process.env.STACK_ENV : "dev";
const envPath = path.join(process.cwd(), `.env.${env}`);

// The following log has specific formatting that emulates the output of the Next build logger, so that it appears uniformly with the rest of the output
console.info(`\u001b[36minfo\u001b[0m  - Loaded env from ${envPath}`);

const nextConfig = {
    extends: ["plugin:@next/next/recommended"],
    reactStrictMode: true,
    images: {
        domains: ["www.york.ac.uk"],
    },
    experimental: {
        forceSwcTransforms: true,
    },
    webpack: (config) => {
        config.plugins = config.plugins || [];

        config.plugins = [
            ...config.plugins,

            // Read the .env file
            new dotenv({
                path: envPath,
                systemvars: true,
            }),
        ];

        config.infrastructureLogging = {
            level: "error",
        };

        return config;
    },
};

export default nextConfig;
