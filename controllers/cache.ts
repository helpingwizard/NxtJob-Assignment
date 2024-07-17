import express, { Request, Response, RequestHandler } from "express";
const router = express.Router();
const redis = require('redis');


// Create a Redis client
const client = redis.createClient({
    host: 'localhost',
    port: 6379
});


// Handle Redis client errors
client.on('error', (err: any) => console.log('Redis Client Error', err));

// Middleware to fetch or cache payment status
export const cachedPaymentStatus = async (req: Request, res: Response) => {
    const { id } = req.params;

    // Try to fetch the payment status from cache
    client.get(`payment_status_${id}`, async (err:any, status:any) => {
        if (err) {
            console.error('Redis error', err);
            return res.status(500).send('Cache retrieval error');
        }

        if (status) {
            // If status exists in cache, return it
            return res.status(200).json({ status, source: 'cache' });
        }

        // If not in cache, fetch from database
        try {
            const result = await db.query('SELECT status FROM transactions WHERE id = $1', [id]);
            if (result.rows.length > 0) {
                const paymentStatus = result.rows[0].status;

                // Cache the result with an expiration time (e.g., 1 hour)
                client.setex(`payment_status_${id}`, 3600, paymentStatus);

                // Return the status fetched from the database
                res.status(200).json({ status: paymentStatus, source: 'database' });
            } else {
                // Handle cases where no transaction is found
                res.status(404).send('Transaction not found');
            }
        } catch (error) {
            console.error('Database query error', error);
            res.status(500).send('Error retrieving status from database');
        }
    });
};
