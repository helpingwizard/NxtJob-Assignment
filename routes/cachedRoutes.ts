import express, { Request, Response, RequestHandler } from "express";
import { cachedPaymentStatus } from "../controllers/cache";
const paymentRouter = express.Router();
paymentRouter.get('/payment-status/:id', cachedPaymentStatus);
module.exports = paymentRouter;
