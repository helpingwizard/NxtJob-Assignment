import { config} from "dotenv";
import { Pool, PoolConfig } from "pg";
require('dotenv').config();

const DB_URL = "postgresql://helloworld_owner:LjIuT1ft7EaN@ep-lucky-boat-a5qz9lr0.us-east-2.aws.neon.tech/helloworld?sslmode=require"
const requiredEnvVars = [DB_URL];


const poolConfig: PoolConfig = {
    connectionString: DB_URL,
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

