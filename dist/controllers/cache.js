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
exports.cachedPaymentStatus = void 0;
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const redis = require('redis');
// Create a Redis client
const client = redis.createClient({
    host: 'localhost',
    port: 6379
});
// Handle Redis client errors
client.on('error', (err) => console.log('Redis Client Error', err));
// Middleware to fetch or cache payment status
const cachedPaymentStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    // Try to fetch the payment status from cache
    client.get(`payment_status_${id}`, (err, status) => __awaiter(void 0, void 0, void 0, function* () {
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
            const result = yield db.query('SELECT status FROM transactions WHERE id = $1', [id]);
            if (result.rows.length > 0) {
                const paymentStatus = result.rows[0].status;
                // Cache the result with an expiration time (e.g., 1 hour)
                client.setex(`payment_status_${id}`, 3600, paymentStatus);
                // Return the status fetched from the database
                res.status(200).json({ status: paymentStatus, source: 'database' });
            }
            else {
                // Handle cases where no transaction is found
                res.status(404).send('Transaction not found');
            }
        }
        catch (error) {
            console.error('Database query error', error);
            res.status(500).send('Error retrieving status from database');
        }
    }));
});
exports.cachedPaymentStatus = cachedPaymentStatus;
