import * as Expense from '../models/expenseModel.js';
import { getBudgetStatus } from '../services/budgetService.js';
import AppError from '../utils/AppError.js';

async function createExpense(req, res, next) {
    try {
        const expense = await Expense.create(req.body);
        const status = await getBudgetStatus(expense.expense_date.slice(0, 7));
        const budget_alert = status && status.alert ? status : null;
        res.status(201).json({ ...expense, budget_alert });
    } catch (err) {
        next(err);
    }
}

async function getExpenses(req, res, next) {
    try {
        const filters = req.filters || {};
        const expenses = await Expense.findAll(filters);
        res.json({ count: expenses.length, filters, data: expenses });
    } catch (err) {
        next(err);
    }
}

async function getExpense(req, res, next) {
    try {
        const expense = await Expense.findById(req.params.id);
        if (!expense) throw new AppError(404, 'Expense not found');
        res.json(expense);
    } catch (err) {
        next(err);
    }
}

async function updateExpense(req, res, next) {
    try {
        const expense = await Expense.update(req.params.id, req.body);
        if (!expense) throw new AppError(404, 'Expense not found');
        res.json(expense);
    } catch (err) {
        next(err);
    }
}

async function deleteExpense(req, res, next) {
    try {
        const deleted = await Expense.remove(req.params.id);
        if (!deleted) throw new AppError(404, 'Expense not found');
        res.status(202).json({ message: "Expense deleted" });
    } catch (err) {
        next(err);
    }
}

export { createExpense, getExpenses, getExpense, updateExpense, deleteExpense };