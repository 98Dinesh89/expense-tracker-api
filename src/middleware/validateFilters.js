import isValidDate from '../utils/isValidDate.js';

function validateFilters(req, res, next) {
    const { category, from, to } = req.query;
    const errors = [];
    const filters = {};

    if (category !== undefined) {
        if (typeof category !== 'string' || !category.trim() || category.trim().length > 50) {
            errors.push('category must be a non-empty string of at most 50 characters');
        } else {
            filters.category = category.trim().toLowerCase();
        }
    }

    if (from !== undefined) {
        if (!isValidDate(from)) {
            errors.push('from must be a valid date in YYYY-MM-DD format');
        } else {
            filters.from = from;
        }
    }

    if (to !== undefined) {
        if (!isValidDate(to)) {
            errors.push('to must be a valid date in YYYY-MM-DD format');
        } else {
            filters.to = to;
        }
    }

    if (filters.from && filters.to && filters.from > filters.to) {
        errors.push('from must not be after to');
    }

    if (errors.length) {
        return res.status(400).json({ errors });
    }

    req.filters = filters;
    next();
}

export default validateFilters;