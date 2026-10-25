import pool from '../config/db.js';

const COLUMNS = 'id, title, amount, category, expense_date, note, created_at, updated_at';

async function findById(id) {
    const [rows] = await pool.execute(
        `SELECT ${COLUMNS} FROM expenses WHERE id = ?`,
        [id]
    );
    return rows[0] || null;
}

async function findAll({ category, from, to } = {}) {
    const conditions = [];
    const params = [];

    if (category) {
        conditions.push('category = ?');
        params.push(category);
    }
    if (from) {
        conditions.push('expense_date >= ?');
        params.push(from);
    }
    if (to) {
        conditions.push('expense_date <= ?');
        params.push(to);
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const [rows] = await pool.execute(
        `SELECT ${COLUMNS} FROM expenses ${where} ORDER BY expense_date DESC, id DESC`,
        params
    );
    return rows;
}

async function create({ title, amount, category, expense_date, note }) {
    const [result] = await pool.execute(
        `INSERT INTO expenses (title, amount, category, expense_date, note)
     VALUES (?, ?, ?, ?, ?)`,
        [title, amount, category, expense_date, note]
    );
    return findById(result.insertId);
}

async function update(id, { title, amount, category, expense_date, note }) {
    await pool.execute(
        `UPDATE expenses
     SET title = ?, amount = ?, category = ?, expense_date = ?, note = ?
     WHERE id = ?`,
        [title, amount, category, expense_date, note, id]
    );
    return findById(id);
}

async function remove(id) {
    const [result] = await pool.execute('DELETE FROM expenses WHERE id = ?', [id]);
    return result.affectedRows > 0;
}

export { findById, findAll, create, update, remove };