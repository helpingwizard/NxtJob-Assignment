import { client } from "../database/db";
import express, { Request, Response, RequestHandler } from "express";

// Create a payment
export const createPayment = async (req: Request, res: Response) => {
    const { userId, payment_method_name, amount, paymentType } = req.body;

    try {
        console.log('Received request:', req.body);

        // Fetch the payment_method_id from the payment_methods table
        const paymentMethodResult = await client.query(
            'SELECT id FROM payment_methods WHERE type = $1',
            [payment_method_name]
        );
        console.log('Payment method result:', paymentMethodResult.rows);

        // Check if user exists
        const userResult = await client.query(
            'SELECT id FROM users WHERE id = $1',
            [userId]
        );
        console.log('User result:', userResult.rows);

        if (userResult.rows.length === 0) {
            return res.status(400).json({ error: 'Invalid user ID' });
        }

        if (paymentMethodResult.rows.length === 0) {
            return res.status(400).json({ error: 'Invalid payment method name' });
        }

        const payment_method_id = paymentMethodResult.rows[0].id;

        // Insert the new payment into the transactions table
        const newPaymentResult = await client.query(
            'INSERT INTO transactions (user_id, payment_method_id, amount, status, created_at) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [userId, payment_method_id, amount, 'pending', new Date()]
        );
        console.log('New payment result:', newPaymentResult.rows);

        res.status(201).json(newPaymentResult.rows[0]);
    } catch (err) {
        console.error('Error inserting payment:', err);
        res.status(500).send('Server error');
    }
};

// Process a payment
export const processPayment = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const result = await client.query(
            'UPDATE transactions SET status = $1, processed_at = $2 WHERE id = $3 RETURNING *',
            ['processed', new Date(), id]  // Assuming you're directly updating the status to 'processed'
        );
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('ProcessingSending scheduled request at 7/16/2024 at 21:10 error');
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
export const paymentRefund = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const updatedPayment = await client.query(
            'UPDATE transactions SET status = $1 WHERE id = $2 RETURNING *',
            ['refunded', id]
        );
        res.status(200).json(updatedPayment.rows[0]);

        // Insert into refunds table
        const refundResult = await client.query(
            'INSERT INTO refunds (transaction_id, amount, reason, created_at) VALUES ($1, $2, $3, $4) RETURNING *',
            [id, updatedPayment.rows[0].amount, 'Refund issued', new Date()]
        );

        res.status(200).json({ transaction: updatedPayment.rows[0], refund: refundResult.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error processing refund');
    }
};
