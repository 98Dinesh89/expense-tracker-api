import { Router } from 'express';
import validateFilters from '../middleware/validateFilters.js';
import * as ctrl from '../controllers/summaryController.js';

const router = Router();

router.get('/monthly', validateFilters, ctrl.getMonthlySummary);
router.get('/category', validateFilters, ctrl.getCategorySummary);

export default router;