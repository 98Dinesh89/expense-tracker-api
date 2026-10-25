import express from "express";
import validateExpense from "../middleware/validateExpense.js";
import ctrl from "../controllers/expenseController.js";
import validateId from "../middleware/validateId.js";

const router = express.Router();

router.param('id', validateId);

router.route('/')
    .post(validateExpense, ctrl.createExpense)
    .get(ctrl.getExpenses);

router.route('/:id')
    .get(ctrl.getExpense)
    .put(validateExpense, ctrl.updateExpense)
    .delete(ctrl.deleteExpense);

export default router;