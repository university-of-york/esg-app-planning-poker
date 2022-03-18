const path = require("path");
const dotenv = require("dotenv-webpack");

const ENV = process.env.STACK_ENV ? process.env.STACK_ENV : "dev";

console.info(`Loading environmental config from .env.${ENV}`);

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
        path: path.join(__dirname, `.env.${ENV}`),
        systemvars: true,
      }),
    ];

    return config;
  },
}

module.exports = nextConfig
