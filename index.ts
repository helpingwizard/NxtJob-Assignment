import express, { Request, Response, Application } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import request from 'request';
import session from 'express-session';
import cron from 'node-cron';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import { client } from './database/db';
import { paymentRouter } from './routes/paymentRoutes';


dotenv.config();

const app: Application = express();

// Load Swagger document
const swaggerDocument = YAML.load(path.join(__dirname, 'openapi.yaml'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Configure session
app.use(session({
    secret: 'your-secret-key',
    resave: true,
    saveUninitialized: true,
}));

// Define routes
app.get('/', async (req: Request, res: Response) => {
    try {
        await client.query("SELECT 1;");
        res.status(200).send("Hello");
    } catch (err: any) {
        console.log(err);
        res.status(500).send("Error");
    }
});

app.use('/api', paymentRouter );

// Swagger setup
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const port = process.env.PORT || 3001;

app.listen(port, (): void => {
    console.log(`Server is running on port ${port}`);
});

// Schedule cron job
cron.schedule("*/5 * * * *", () => {
    console.log("Sending scheduled request at", new Date().toLocaleDateString(), "at", `${new Date().getHours()}:${new Date().getMinutes()}`);
    request(`${process.env.SELF_URL}`, function (error: Error, response: any) {
        if (!error && response.statusCode == 200) {
            console.log("I'm okay");
            // Optionally, log the response body
            // console.log(body);
        } else {
            console.log("Error in scheduled request:", error);
        }
    });
});
