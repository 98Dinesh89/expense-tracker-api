import * as Budget from '../models/budgetModel.js';
import { getBudgetStatus } from '../services/budgetService.js';
import AppError from '../utils/AppError.js';

async function setBudget(req, res, next) {
    try {
        const budget = await Budget.upsert(req.params.month, req.body.amount);
        res.json(budget);
    } catch (err) {
        next(err);
    }
}

async function getBudget(req, res, next) {
    try {
        const budget = await Budget.findByMonth(req.params.month);
        if (!budget) throw new AppError(404, 'No budget set for this month');
        res.json(budget);
    } catch (err) {
        next(err);
    }
}

async function getStatus(req, res, next) {
    try {
        const status = await getBudgetStatus(req.params.month);
        if (!status) throw new AppError(404, 'No budget set for this month');
        res.json(status);
    } catch (err) {
        next(err);
    }
}

export { setBudget, getBudget, getStatus };