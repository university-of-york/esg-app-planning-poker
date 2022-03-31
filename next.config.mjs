import path from "path";
import dotenv from "dotenv-webpack";

const ENV = process.env.STACK_ENV ? process.env.STACK_ENV : "dev";

// The following log has specific formatting that emulates the output of the Next build logger, so that it appears uniformly with the rest of the output
console.info(`\u001b[36minfo\u001b[0m  - Loaded env from ${path.join(process.cwd(), `.env.${ENV}`)}`);

const nextConfig = {
    extends: ["plugin:@next/next/recommended"],
    reactStrictMode: true,
    images: {
        domains: ["www.york.ac.uk"],
    },
    webpack: (config) => {
        config.plugins = config.plugins || [];

        config.plugins = [
            ...config.plugins,

            // Read the .env file
            new dotenv({
                path: path.join(process.cwd(), `.env.${ENV}`),
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
