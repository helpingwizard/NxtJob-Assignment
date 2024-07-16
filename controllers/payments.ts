import { client } from "../database/db";
import express, { Request, Response, RequestHandler } from "express";
const router = express.Router();

// Create a payment
export const createPayment = async (req: Request, res: Response) => {
    const { userId, amount, paymentType } = req.body;
    try {
        const newPayment = await client.query(
            'INSERT INTO transactions (user_id, amount, payment_type, status) VALUES ($1, $2, $3, $4) RETURNING *',
            [userId, amount, paymentType, 'pending']
        );
        res.status(201).json(newPayment.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};

// Process a payment
export const processPayment1 = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const result = await client.query(
            'UPDATE transactions SET status = $1 WHERE id = $2 RETURNING *',
            ['processed', id]  // Assuming you're directly updating the status to 'processed'
        );
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Processing error');
    }
};

// Retrieve payment status
export const paymentStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const payment = await client.query(
            'SELECT status FROM transactions WHERE id = $1',
            [id]
        );
        res.status(200).json(payment.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving status');
    }
};

// Handle a refund
export const refund = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const updatedPayment = await client.query(
            'UPDATE transactions SET status = $1 WHERE id = $2 RETURNING *',
            ['refunded', id]
        );
        res.status(200).json(updatedPayment.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error processing refund');
    }
};
