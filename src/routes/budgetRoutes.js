import { Router } from 'express';
import validateMonth from '../middleware/validateMonth.js';
import validateBudget from '../middleware/validateBudget.js';
import * as ctrl from '../controllers/budgetController.js';

const router = Router();

router.param('month', validateMonth);

router.route('/:month')
    .put(validateBudget, ctrl.setBudget)
    .get(ctrl.getBudget);

router.get('/:month/status', ctrl.getStatus);

export default router;