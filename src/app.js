import express from 'express';
import expenseRoutes from './routes/expenseRoutes.js';
import summaryRoutes from './routes/summaryRoutes.js';
import budgetRoutes from './routes/budgetRoutes.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

const app = express();

app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/expenses', expenseRoutes);
app.use('/api/summary', summaryRoutes);
app.use('/api/budgets', budgetRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;