import isValidDate from '../utils/isValidDate.js';

function validateExpense(req, res, next) {
    const { title, amount, category, expense_date, note } = req.body || {};
    const errors = [];

    if (typeof title !== 'string' || !title.trim() || title.trim().length > 100) {
        errors.push('title must be a non-empty string of at most 100 characters');
    }

    const amt = Number(amount);
    if (amount === undefined || amount === null || amount === '' || !Number.isFinite(amt) || amt <= 0) {
        errors.push('amount must be a positive number');
    } else if (Math.round(amt * 100) !== amt * 100 && Math.abs(Math.round(amt * 100) - amt * 100) > 1e-6) {
        errors.push('amount can have at most 2 decimal places');
    } else if (amt >= 100000000) {
        errors.push('amount is too large');
    }

    if (typeof category !== 'string' || !category.trim() || category.trim().length > 50) {
        errors.push('category must be a non-empty string of at most 50 characters');
    }

    if (!isValidDate(expense_date)) {
        errors.push('expense_date must be a valid date in YYYY-MM-DD format');
    }

    if (note !== undefined && note !== null && (typeof note !== 'string' || note.length > 255)) {
        errors.push('note must be a string of at most 255 characters');
    }

    if (errors.length) {
        return res.status(400).json({ errors });
    }

    req.body = {
        title: title.trim(),
        amount: amt,
        category: category.trim().toLowerCase(),
        expense_date,
        note: note ? note.trim() : null
    };
    next();
}

export default validateExpense;