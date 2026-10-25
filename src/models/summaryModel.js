import pool from '../config/db.js';
import buildWhere from '../utils/buildWhere.js';

async function monthlyTotals(filters = {}) {
    const { where, params } = buildWhere(filters);

    const [rows] = await pool.execute(
        `SELECT DATE_FORMAT(expense_date, '%Y-%m') AS month,
            SUM(amount) AS total,
            COUNT(*) AS expense_count
     FROM expenses
     ${where}
     GROUP BY month
     ORDER BY month ASC`,
        params
    );
    return rows;
}

async function categoryTotals(filters = {}) {
    const { where, params } = buildWhere(filters);

    const [rows] = await pool.execute(
        `SELECT category,
            SUM(amount) AS total,
            COUNT(*) AS expense_count
     FROM expenses
     ${where}
     GROUP BY category
     ORDER BY total DESC, category ASC`,
        params
    );
    return rows;
}

export { monthlyTotals, categoryTotals };