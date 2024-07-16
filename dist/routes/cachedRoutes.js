"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cache_1 = require("../controllers/cache");
const paymentRouter = express_1.default.Router();
paymentRouter.get('/payment-status/:id', cache_1.cachedPaymentStatus);
module.exports = paymentRouter;
