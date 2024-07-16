"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const payments_1 = require("../controllers/payments");
const paymentRouter = express_1.default.Router();
paymentRouter.post('/payments', payments_1.createPayment);
paymentRouter.put('/payments/:id/process', payments_1.processPayment1);
paymentRouter.get('/payments/:id/status', payments_1.paymentStatus);
paymentRouter.post('/payments/:id/refund', payments_1.refund);
module.exports = [paymentRouter];
