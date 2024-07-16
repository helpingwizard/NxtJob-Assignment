import { config} from "dotenv";
import { Pool, PoolConfig } from "pg";
require('dotenv').config();
// Ensure all required environment variables are defined
const requiredEnvVars = ['DB_URL'];
requiredEnvVars.forEach(envVar => {
    if (!process.env[envVar]) {
        console.error(`Missing required environment variable: ${envVar}`);
        process.exit(1);
    }
});

const poolConfig: PoolConfig = {
    connectionString: process.env.DB_URL,
    idleTimeoutMillis: 30000,
    ssl: {
        rejectUnauthorized: false
    },
    min: 0,
};

export const client = new Pool(poolConfig);

client.connect()
    .then(() => console.log('Connected to PostgreSQL database'))
    .catch((err: any) => console.error('Error connecting to PostgreSQL database', err));

