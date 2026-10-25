import { Router } from 'express';
import validateId from '../middleware/validateId.js';
import validateExpense from '../middleware/validateExpense.js';
import validateFilters from '../middleware/validateFilters.js';
import * as ctrl from '../controllers/expenseController.js';

const router = Router();

router.param('id', validateId);

router.route('/')
    .post(validateExpense, ctrl.createExpense)
    .get(validateFilters, ctrl.getExpenses);

router.route('/:id')
    .get(ctrl.getExpense)
    .put(validateExpense, ctrl.updateExpense)
    .delete(ctrl.deleteExpense);

export default router;