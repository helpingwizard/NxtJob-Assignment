"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const request_1 = __importDefault(require("request"));
dotenv_1.default.config();
const express_session_1 = __importDefault(require("express-session"));
const cron = require("node-cron");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)());
app.use((0, express_session_1.default)({
    secret: 'your-secret-key',
    resave: true,
    saveUninitialized: true,
}));
app.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        db_1.client.query("SELECT 1;");
        res.status(200).send("Hello");
    }
    catch (err) {
        console.log(err);
    }
}));
const paymentRoutes = require("./routes/paymentRoutes");
const db_1 = require("./database/db");
app.use('/api', paymentRoutes);
const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`server is running ${port}`);
});
cron.schedule("*/5 * * * *", () => {
    console.log("Sending scheduled request at", new Date().toLocaleDateString(), "at", `${new Date().getHours()}:${new Date().getMinutes()}`);
    (0, request_1.default)(`${process.env.SELF_URL}`, function (error, response) {
        if (!error && response.statusCode == 200) {
            console.log("im okay");
            // console.log(body) // Optionally, log the response body
        }
    });
});
