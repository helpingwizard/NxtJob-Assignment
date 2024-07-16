CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    payment_method_id INTEGER REFERENCES payment_methods(id),
    amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',  -- e.g., pending, processed, failed
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (CURRENT_TIMESTAMP),
    processed_at TIMESTAMP WITHOUT TIME ZONE
);

CREATE TABLE payment_methods (
    id SERIAL PRIMARY KEY,
    type VARCHAR(100),  -- e.g., credit card, debit card, wallet
    provider VARCHAR(255),  -- e.g., Visa, MasterCard, PayPal
    details JSONB  -- JSONB to store flexible attributes like card number (encrypted), expiration, etc.
);

CREATE TABLE refunds (
    id SERIAL PRIMARY KEY,
    transaction_id INTEGER REFERENCES transactions(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL,
    reason TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (CURRENT_TIMESTAMP)
);
