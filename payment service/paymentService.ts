const db = require('./db');

async function processPayment(paymentId: number) {
  
  const payment = await db.query('SELECT * FROM transactions WHERE id = $1', [paymentId]);
  if (payment.rows[0].status === 'pending') {
    // Call to external payment service would occur here
    const updatedPayment = await db.query(
      'UPDATE transactions SET status = $1 WHERE id = $2 RETURNING *',
      ['processed', paymentId]
    );
    return updatedPayment.rows[0];
  }
  throw new Error('Payment already processed or does not exist');
}

module.exports = {
  processPayment
};
