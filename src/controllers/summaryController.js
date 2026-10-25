import * as Summary from '../models/summaryModel.js';

const round2 = (n) => Math.round(n * 100) / 100;

async function getMonthlySummary(req, res, next) {
    try {
        const filters = req.filters || {};
        const rows = await Summary.monthlyTotals(filters);
        const grandTotal = round2(rows.reduce((sum, r) => sum + r.total, 0));

        res.json({
            filters,
            grand_total: grandTotal,
            count: rows.length,
            data: rows
        });
    } catch (err) {
        next(err);
    }
}

async function getCategorySummary(req, res, next) {
    try {
        const filters = req.filters || {};
        const rows = await Summary.categoryTotals(filters);
        const grandTotal = round2(rows.reduce((sum, r) => sum + r.total, 0));

        const data = rows.map((r) => ({
            ...r,
            percentage: grandTotal > 0 ? round2((r.total / grandTotal) * 100) : 0
        }));

        res.json({
            filters,
            grand_total: grandTotal,
            count: data.length,
            data
        });
    } catch (err) {
        next(err);
    }
}

export { getMonthlySummary, getCategorySummary };