const AppError = require('../utils/AppError');

const DB_UNAVAILABLE = new Set([
    'ECONNREFUSED',
    'ETIMEDOUT',
    'ENOTFOUND',
    'PROTOCOL_CONNECTION_LOST',
    'ER_CON_COUNT_ERROR',
    'ER_ACCESS_DENIED_ERROR',
    'ER_BAD_DB_ERROR'
]);

const DB_BAD_INPUT = new Set([
    'ER_DATA_TOO_LONG',
    'ER_TRUNCATED_WRONG_VALUE',
    'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD',
    'ER_WARN_DATA_OUT_OF_RANGE',
    'ER_CHECK_CONSTRAINT_VIOLATED',
    'ER_BAD_NULL_ERROR',
    'ER_NO_DEFAULT_FOR_FIELD',
    'ER_WRONG_VALUE'
]);

function notFound(req, res, next) {
    next(new AppError(404, `Route not found: ${req.method} ${req.originalUrl}`));
}

function errorHandler(err, req, res, next) {
    if (res.headersSent) return next(err);

    let status = 500;
    let message = 'Internal server error';

    if (err instanceof AppError) {
        status = err.status;
        message = err.message;
    } else if (err.type === 'entity.parse.failed') {
        status = 400;
        message = 'Invalid JSON body';
    } else if (err.type === 'entity.too.large') {
        status = 413;
        message = 'Request body too large';
    } else if (DB_BAD_INPUT.has(err.code)) {
        status = 400;
        message = 'Data rejected by the database';
    } else if (err.code === 'ER_DUP_ENTRY') {
        status = 409;
        message = 'Duplicate entry';
    } else if (DB_UNAVAILABLE.has(err.code)) {
        status = 503;
        message = 'Database unavailable';
    }

    if (status >= 500) {
        console.error(err);
    }

    res.status(status).json({ error: message });
}

export { notFound, errorHandler };