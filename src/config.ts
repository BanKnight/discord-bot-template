import { resolve } from "path";
import { config } from "dotenv";

// Parsing the env file.
const node_env = process.env.NODE_ENV || "production"
const file = resolve(`./.env.${node_env}`)

const output = config({ path: file });
if (output.error) {
    console.error(output.error)
}

// Interface to load env variables
// Note these variables can possibly be undefined
// as someone could skip these varibales or not setup a .env file at all

namespace NodeJS {
    interface ProcessEnv {
        TOKEN: string;
        APPLICATION: string;
        SERVERS: string;
        CHATGPT: string;
    }
}

interface Config {
    TOKEN: string;
    APPLICATION: string;
    SERVERS: string[];
}

export default {
    TOKEN: process.env.TOKEN,
    APPLICATION: process.env.APPLICATION,
    SERVERS: process.env.SERVERS.split(","),
} as Config;