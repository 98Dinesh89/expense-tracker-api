import pool from '../config/db.js';

const COLUMNS = 'id, budget_month, amount, created_at, updated_at';

async function findByMonth(month) {
    const [rows] = await pool.execute(
        `SELECT ${COLUMNS} FROM budgets WHERE budget_month = ?`,
        [month]
    );
    return rows[0] || null;
}

async function upsert(month, amount) {
    await pool.execute(
        `INSERT INTO budgets (budget_month, amount)
     VALUES (?, ?)
     ON DUPLICATE KEY UPDATE amount = ?`,
        [month, amount, amount]
    );
    return findByMonth(month);
}

export { findByMonth, upsert };