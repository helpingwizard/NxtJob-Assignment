import express, { Request, Response, Application} from 'express';
import dotenv from 'dotenv';
import { error } from 'console';
import cors from 'cors';
import request from "request"
dotenv.config();


import session from 'express-session';
const cron = require("node-cron");


const app: Application = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(session({
    secret: 'your-secret-key',
    resave: true,
    saveUninitialized: true,
}));


app.get('/', async (req: Request, res: Response) => {
    try {
        client.query("SELECT 1;");
        res.status(200).send("Hello");
    }
    catch (err: any) {
        console.log(err);
    }
})

const paymentRoutes = require("./routes/paymentRoutes");
import { client } from './database/db'

app.use('/api', paymentRoutes);
const port = process.env.PORT || 3001;


app.listen(port, (): void => {
    console.log(`server is running ${port}`);
})

cron.schedule("*/5 * * * *", () => {
    console.log("Sending scheduled request at", new Date().toLocaleDateString(), "at", `${new Date().getHours()}:${new Date().getMinutes()}`);
    request(`${process.env.SELF_URL}`, function (error: Error, response: any) {
        if (!error && response.statusCode == 200) {
            console.log("im okay");
            // console.log(body) // Optionally, log the response body
        }
    });
});
