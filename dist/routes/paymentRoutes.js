"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentRouter = void 0;
const express_1 = __importDefault(require("express"));
const payments_1 = require("../controllers/payments");
exports.paymentRouter = express_1.default.Router();
/**
 * @swagger
 * /payments:
 *   post:
 *     summary: Create a new payment
 *     description: Create a new payment
 *     responses:
 *       200:
 *         description: Payment created successfully
 */
exports.paymentRouter.post('/payments', payments_1.createPayment);
/**
 * @swagger
 * /payments/process/{id}:
 *   put:
 *     summary: Process a payment
 *     description: Process a payment by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The payment ID
 *     responses:
 *       200:
 *         description: Payment processed successfully
 */
exports.paymentRouter.put('/payments/process/:id', payments_1.processPayment);
/**
 * @swagger
 * /payments/status/{id}:
 *   get:
 *     summary: Get payment status
 *     description: Get the status of a payment by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The payment ID
 *     responses:
 *       200:
 *         description: Payment status retrieved successfully
 */
exports.paymentRouter.get('/payments/status/:id', payments_1.paymentStatus);
/**
 * @swagger
 * /payments/refund/{id}:
 *   post:
 *     summary: Refund a payment
 *     description: Refund a payment by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The payment ID
 *     responses:
 *       200:
 *         description: Payment refunded successfully
 */
exports.paymentRouter.put('/payments/a/refund/:id', payments_1.paymentRefund);
