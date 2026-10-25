function validateBudget(req, res, next) {
    const { amount } = req.body || {};
    const errors = [];
    const amt = Number(amount);

    if ((typeof amount !== 'number' && typeof amount !== 'string') || !Number.isFinite(amt) || amt <= 0) {
        errors.push('amount must be a positive number');
    } else if (Math.abs(amt * 100 - Math.round(amt * 100)) > 1e-6) {
        errors.push('amount can have at most 2 decimal places');
    } else if (amt >= 100000000) {
        errors.push('amount is too large');
    }

    if (errors.length) {
        return res.status(400).json({ errors });
    }

    req.body = { amount: amt };
    next();
}

export default validateBudget;