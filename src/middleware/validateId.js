import AppError from "../utils/AppError.js";

const MAX_UNSIGNED_INT = 4294967295;

function validateId(req, res, next, id) {
    if (!/^\d+$/.test(id) || Number(id) < 1 || Number(id) > MAX_UNSIGNED_INT) {
        return next(new AppError(400, 'id must be a positive integer'));
    }
    next();
}

export default validateId;