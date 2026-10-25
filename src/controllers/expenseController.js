import Expense from "../models/expenseModel.js";
import AppError from "../utils/AppError.js";

const Expense = require('../models/expenseModel');
const AppError = require('../utils/AppError');

async function createExpense(req, res, next) {
    try {
        const expense = await Expense.create(req.body);
        res.status(201).json(expense);
    } catch (err) {
        next(err);
    }
}

async function getExpenses(req, res, next) {
    try {
        const expenses = await Expense.findAll();
        res.json({ count: expenses.length, data: expenses });
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
        res.status(204).send();
    } catch (err) {
        next(err);
    }
}

export default { createExpense, getExpense, getExpenses, updateExpense, deleteExpense };