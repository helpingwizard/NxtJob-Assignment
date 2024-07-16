import express, { Request, Response, RequestHandler } from "express";
import { createPayment, paymentStatus, processPayment1, refund } from "../controllers/payments";
const paymentRouter = express.Router();

paymentRouter.post('/payments', createPayment);
paymentRouter.put('/payments/:id/process', processPayment1);
paymentRouter.get('/payments/:id/status', paymentStatus);
paymentRouter.post('/payments/:id/refund', refund);

module.exports = [paymentRouter]