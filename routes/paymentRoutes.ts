import express, { Request, Response, RequestHandler } from "express";
import { createPayment, paymentStatus, processPayment, paymentRefund } from "../controllers/payments";
export const paymentRouter = express.Router();
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
paymentRouter.post('/payments', createPayment);

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
paymentRouter.put('/payments/process/:id', processPayment);

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
paymentRouter.get('/payments/status/:id', paymentStatus);

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
paymentRouter.put('/payments/a/refund/:id', paymentRefund);

