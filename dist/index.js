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
const express_session_1 = __importDefault(require("express-session"));
const node_cron_1 = __importDefault(require("node-cron"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const yamljs_1 = __importDefault(require("yamljs"));
const path_1 = __importDefault(require("path"));
const db_1 = require("./database/db");
const paymentRoutes_1 = require("./routes/paymentRoutes");
dotenv_1.default.config();
const app = (0, express_1.default)();
// Load Swagger document
const swaggerDocument = yamljs_1.default.load(path_1.default.join(__dirname, 'openapi.yaml'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)());
// Configure session
app.use((0, express_session_1.default)({
    secret: 'your-secret-key',
    resave: true,
    saveUninitialized: true,
}));
// Define routes
app.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield db_1.client.query("SELECT 1;");
        res.status(200).send("Hello");
    }
    catch (err) {
        console.log(err);
        res.status(500).send("Error");
    }
}));
app.use('/api', paymentRoutes_1.paymentRouter);
// Swagger setup
app.use('/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocument));
const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
// Schedule cron job
node_cron_1.default.schedule("*/5 * * * *", () => {
    console.log("Sending scheduled request at", new Date().toLocaleDateString(), "at", `${new Date().getHours()}:${new Date().getMinutes()}`);
    (0, request_1.default)(`${process.env.SELF_URL}`, function (error, response) {
        if (!error && response.statusCode == 200) {
            console.log("I'm okay");
            // Optionally, log the response body
            // console.log(body);
        }
        else {
            console.log("Error in scheduled request:", error);
        }
    });
});
