import AppError from '../utils/AppError.js';

function validateMonth(req, res, next, month) {
    if (!/^(19|20)\d{2}-(0[1-9]|1[0-2])$/.test(month)) {
        return next(new AppError(400, 'month must be in YYYY-MM format'));
    }
    next();
}

export default validateMonth;