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
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentRefund = exports.paymentStatus = exports.processPayment = exports.createPayment = void 0;
const db_1 = require("../database/db");
// Create a payment
const createPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, payment_method_name, amount, paymentType } = req.body;
    try {
        console.log('Received request:', req.body);
        // Fetch the payment_method_id from the payment_methods table
        const paymentMethodResult = yield db_1.client.query('SELECT id FROM payment_methods WHERE type = $1', [payment_method_name]);
        console.log('Payment method result:', paymentMethodResult.rows);
        // Check if user exists
        const userResult = yield db_1.client.query('SELECT id FROM users WHERE id = $1', [userId]);
        console.log('User result:', userResult.rows);
        if (userResult.rows.length === 0) {
            return res.status(400).json({ error: 'Invalid user ID' });
        }
        if (paymentMethodResult.rows.length === 0) {
            return res.status(400).json({ error: 'Invalid payment method name' });
        }
        const payment_method_id = paymentMethodResult.rows[0].id;
        // Insert the new payment into the transactions table
        const newPaymentResult = yield db_1.client.query('INSERT INTO transactions (user_id, payment_method_id, amount, status, created_at) VALUES ($1, $2, $3, $4, $5) RETURNING *', [userId, payment_method_id, amount, 'pending', new Date()]);
        console.log('New payment result:', newPaymentResult.rows);
        res.status(201).json(newPaymentResult.rows[0]);
    }
    catch (err) {
        console.error('Error inserting payment:', err);
        res.status(500).send('Server error');
    }
});
exports.createPayment = createPayment;
// Process a payment
const processPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const result = yield db_1.client.query('UPDATE transactions SET status = $1, processed_at = $2 WHERE id = $3 RETURNING *', ['processed', new Date(), id] // Assuming you're directly updating the status to 'processed'
        );
        res.status(200).json(result.rows[0]);
    }
    catch (err) {
        console.error(err);
        res.status(500).send('ProcessingSending scheduled request at 7/16/2024 at 21:10 error');
    }
});
exports.processPayment = processPayment;
// Retrieve payment status
const paymentStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const payment = yield db_1.client.query('SELECT status FROM transactions WHERE id = $1', [id]);
        res.status(200).json(payment.rows[0]);
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving status');
    }
});
exports.paymentStatus = paymentStatus;
// Handle a refund
const paymentRefund = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const updatedPayment = yield db_1.client.query('UPDATE transactions SET status = $1 WHERE id = $2 RETURNING *', ['refunded', id]);
        res.status(200).json(updatedPayment.rows[0]);
        // Insert into refunds table
        const refundResult = yield db_1.client.query('INSERT INTO refunds (transaction_id, amount, reason, created_at) VALUES ($1, $2, $3, $4) RETURNING *', [id, updatedPayment.rows[0].amount, 'Refund issued', new Date()]);
        res.status(200).json({ transaction: updatedPayment.rows[0], refund: refundResult.rows[0] });
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Error processing refund');
    }
});
exports.paymentRefund = paymentRefund;
