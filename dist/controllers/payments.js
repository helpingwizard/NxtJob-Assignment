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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refund = exports.paymentStatus = exports.processPayment1 = exports.createPayment = void 0;
const db_1 = require("../database/db");
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
// Create a payment
const createPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, amount, paymentType } = req.body;
    try {
        const newPayment = yield db_1.client.query('INSERT INTO transactions (user_id, amount, payment_type, status) VALUES ($1, $2, $3, $4) RETURNING *', [userId, amount, paymentType, 'pending']);
        res.status(201).json(newPayment.rows[0]);
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});
exports.createPayment = createPayment;
// Process a payment
const processPayment1 = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const result = yield db_1.client.query('UPDATE transactions SET status = $1 WHERE id = $2 RETURNING *', ['processed', id] // Assuming you're directly updating the status to 'processed'
        );
        res.status(200).json(result.rows[0]);
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Processing error');
    }
});
exports.processPayment1 = processPayment1;
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
const refund = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const updatedPayment = yield db_1.client.query('UPDATE transactions SET status = $1 WHERE id = $2 RETURNING *', ['refunded', id]);
        res.status(200).json(updatedPayment.rows[0]);
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Error processing refund');
    }
});
exports.refund = refund;
