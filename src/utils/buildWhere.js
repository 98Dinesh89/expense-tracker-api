function buildWhere({ category, from, to } = {}) {
    const conditions = [];
    const params = [];

    if (category) {
        conditions.push('category = ?');
        params.push(category);
    }
    if (from) {
        conditions.push('expense_date >= ?');
        params.push(from);
    }
    if (to) {
        conditions.push('expense_date <= ?');
        params.push(to);
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    return { where, params };
}

export default buildWhere;