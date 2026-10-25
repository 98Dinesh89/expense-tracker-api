import * as Budget from '../models/budgetModel.js';
import * as Summary from '../models/summaryModel.js';

const WARNING_THRESHOLD = 0.8;

const round2 = (n) => Math.round(n * 100) / 100;

function monthRange(month) {
    const [year, mon] = month.split('-').map(Number);
    const lastDay = new Date(Date.UTC(year, mon, 0)).getUTCDate();
    return {
        from: `${month}-01`,
        to: `${month}-${String(lastDay).padStart(2, '0')}`
    };
}

async function getBudgetStatus(month) {
    const budget = await Budget.findByMonth(month);
    if (!budget) return null;

    const rows = await Summary.monthlyTotals(monthRange(month));
    const spent = round2(rows.length ? rows[0].total : 0);
    const limit = budget.amount;
    const remaining = round2(limit - spent);
    const percentUsed = round2((spent / limit) * 100);

    let status = 'ok';
    let message = 'Within budget';

    if (spent > limit) {
        status = 'exceeded';
        message = `Budget exceeded by ${round2(spent - limit)}`;
    } else if (spent >= limit * WARNING_THRESHOLD) {
        status = 'warning';
        message = `${percentUsed}% of the monthly budget used`;
    }

    return {
        month,
        budget: limit,
        spent,
        remaining,
        percent_used: percentUsed,
        status,
        alert: status !== 'ok',
        message
    };
}

export { getBudgetStatus };