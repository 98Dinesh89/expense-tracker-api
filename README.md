# Expense Tracker API

Node.js + Express + MySQL backend for personal expense tracking: CRUD, category/date filtering, SQL aggregation summaries, and monthly budget alerts.

## Modules

| #   | Module        | Summary                                                  |
| --- | ------------- | -------------------------------------------------------- |
| 1   | Expense CRUD  | Validated create, read, update, delete                   |
| 2   | Filtering     | Category and date range filters                          |
| 3   | Summaries     | Monthly and per-category totals                          |
| 4   | Budget Alerts | Monthly budget with `ok` / `warning` / `exceeded` status |

## Tech Stack

Node.js (ES modules), Express, MySQL via `mysql2`, `dotenv`, `nodemon`

## Project Structure

```
Expense Tracker API/
├── db/
│   ├── schema.sql
│   └── seed.sql
├── src/
│   ├── config/db.js
│   ├── controllers/    budgetController, expenseController, summaryController
│   ├── middleware/     errorHandler, validateBudget, validateExpense,
│   │                   validateFilters, validateId, validateMonth
│   ├── models/         budgetModel, expenseModel, summaryModel
│   ├── routes/         budgetRoutes, expenseRoutes, summaryRoutes
│   ├── services/       budgetService
│   ├── utils/          AppError, buildWhere, isValidDate
│   ├── app.js
│   └── server.js
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

Flow: route → validation middleware → controller → model/service → MySQL.

## Setup

**Requirements:** Node.js 18+, MySQL 8.0.16+

```bash
npm install
cp .env.example .env        # PowerShell: Copy-Item .env.example .env
```

Edit `.env`:

| Variable      | Example               |
| ------------- | --------------------- |
| `PORT`        | `3000`                |
| `DB_HOST`     | `localhost`           |
| `DB_PORT`     | `3306`                |
| `DB_USER`     | `root`                |
| `DB_PASSWORD` | `your_mysql_password` |
| `DB_NAME`     | `expense_tracker`     |

Create the tables (safe to re-run) and optionally load sample data:

| Shell                               | Command                                         |
| ----------------------------------- | ----------------------------------------------- |
| `mysql>` prompt (from project root) | `source db/schema.sql`                          |
| PowerShell                          | `Get-Content db/schema.sql \| mysql -u root -p` |
| CMD / Git Bash                      | `mysql -u root -p < db/schema.sql`              |

Repeat with `db/seed.sql` for sample data. **It deletes all rows in `expenses`** and inserts 12.

Run:

```bash
npm run dev     # nodemon
npm start       # node
```

Health check: `GET /health` → `{"status":"ok"}`

## Database Schema

**`expenses`**

| Column                     | Type          | Notes                      |
| -------------------------- | ------------- | -------------------------- |
| `id`                       | INT UNSIGNED  | PK, auto increment         |
| `title`                    | VARCHAR(100)  | required                   |
| `amount`                   | DECIMAL(10,2) | required, > 0              |
| `category`                 | VARCHAR(50)   | required, stored lowercase |
| `expense_date`             | DATE          | required                   |
| `note`                     | VARCHAR(255)  | optional                   |
| `created_at`, `updated_at` | TIMESTAMP     | automatic                  |

Indexes: `idx_expense_date`, `idx_category`

**`budgets`**

| Column                     | Type          | Notes              |
| -------------------------- | ------------- | ------------------ |
| `id`                       | INT UNSIGNED  | PK, auto increment |
| `budget_month`             | CHAR(7)       | `YYYY-MM`, unique  |
| `amount`                   | DECIMAL(10,2) | required, > 0      |
| `created_at`, `updated_at` | TIMESTAMP     | automatic          |

## API Reference

Base URL `http://localhost:5000`. JSON bodies need `Content-Type: application/json`. Dates are `YYYY-MM-DD`, months `YYYY-MM`.

| Method | Endpoint                     | Description                              |
| ------ | ---------------------------- | ---------------------------------------- |
| POST   | `/api/expenses`              | Create expense                           |
| GET    | `/api/expenses`              | List (filters: `category`, `from`, `to`) |
| GET    | `/api/expenses/:id`          | Get one                                  |
| PUT    | `/api/expenses/:id`          | Replace                                  |
| DELETE | `/api/expenses/:id`          | Delete                                   |
| GET    | `/api/summary/monthly`       | Totals per month                         |
| GET    | `/api/summary/category`      | Totals per category                      |
| PUT    | `/api/budgets/:month`        | Set or update budget                     |
| GET    | `/api/budgets/:month`        | Get budget                               |
| GET    | `/api/budgets/:month/status` | Spending vs budget                       |

### Expenses

**POST / PUT body**

```json
{
  "title": "Lunch",
  "amount": 150.5,
  "category": "Food",
  "expense_date": "2026-10-24",
  "note": "Canteen"
}
```

`note` is optional. PUT requires all other fields.

**POST → 201**

```json
{
  "id": 1,
  "title": "Lunch",
  "amount": 150.5,
  "category": "food",
  "expense_date": "2026-10-24",
  "note": "Canteen",
  "created_at": "2026-10-25 10:15:00",
  "updated_at": "2026-10-25 10:15:00",
  "budget_alert": null
}
```

`budget_alert` is the budget status object when the expense's month is at `warning` or `exceeded`, otherwise `null`.

**GET `/api/expenses` → 200**

Ordered by `expense_date` desc, `id` desc. Filters are optional and combinable; `from` and `to` are inclusive.

Example: `/api/expenses?category=food&from=2026-10-01&to=2026-10-31`

```json
{
  "count": 3,
  "filters": { "category": "food", "from": "2026-10-01", "to": "2026-10-31" },
  "data": [
    {
      "id": 12,
      "title": "Snacks",
      "amount": 90,
      "category": "food",
      "expense_date": "2026-10-25",
      "note": null,
      "created_at": "...",
      "updated_at": "..."
    }
  ]
}
```

**Other**

- `GET /api/expenses/:id` → 200 expense, or 404
- `PUT /api/expenses/:id` → 200 updated expense (also 200 if values are unchanged), or 404
- `DELETE /api/expenses/:id` → 204, or 404

### Summaries

Both accept `category`, `from`, `to`.

**GET `/api/summary/monthly`** (sample data)

```json
{
  "filters": {},
  "grand_total": 5690.5,
  "count": 3,
  "data": [
    { "month": "2026-08", "total": 120, "expense_count": 1 },
    { "month": "2026-09", "total": 3150, "expense_count": 5 },
    { "month": "2026-10", "total": 2420.5, "expense_count": 6 }
  ]
}
```

Ordered by month ascending.

**GET `/api/summary/category`** (sample data)

```json
{
  "filters": {},
  "grand_total": 5690.5,
  "count": 4,
  "data": [
    {
      "category": "entertainment",
      "total": 1900,
      "expense_count": 2,
      "percentage": 33.39
    },
    {
      "category": "food",
      "total": 1880.5,
      "expense_count": 5,
      "percentage": 33.05
    },
    {
      "category": "stationery",
      "total": 1080,
      "expense_count": 2,
      "percentage": 18.98
    },
    {
      "category": "transport",
      "total": 830,
      "expense_count": 3,
      "percentage": 14.59
    }
  ]
}
```

Ordered by total descending.

### Budgets

**PUT `/api/budgets/:month`** body `{ "amount": 3000 }` → 200

```json
{
  "id": 1,
  "budget_month": "2026-10",
  "amount": 3000,
  "created_at": "2026-10-25 10:20:00",
  "updated_at": "2026-10-25 10:20:00"
}
```

**GET `/api/budgets/:month`** → 200 budget, or 404 `No budget set for this month`

**GET `/api/budgets/:month/status`** → 200, or 404 if no budget

```json
{
  "month": "2026-10",
  "budget": 3000,
  "spent": 2420.5,
  "remaining": 579.5,
  "percent_used": 80.68,
  "status": "warning",
  "alert": true,
  "message": "80.68% of the monthly budget used"
}
```

## Budget Alert Logic

`src/services/budgetService.js`

| Condition             | `status`   | `alert` |
| --------------------- | ---------- | ------- |
| spent < 80% of budget | `ok`       | false   |
| 80% ≤ spent ≤ 100%    | `warning`  | true    |
| spent > 100%          | `exceeded` | true    |

Threshold: `WARNING_THRESHOLD = 0.8`. `remaining` can be negative.

## Validation

| Input                        | Rule                                                       |
| ---------------------------- | ---------------------------------------------------------- |
| `:id`                        | integer, 1 to 4294967295                                   |
| `:month`                     | `YYYY-MM`, year 1900–2099                                  |
| `title`                      | 1–100 chars after trim                                     |
| `amount` (expense, budget)   | number or numeric string, > 0, max 2 decimals, < 100000000 |
| `category`                   | 1–50 chars; trimmed, lowercased                            |
| `expense_date`, `from`, `to` | real calendar date (`2026-02-30` rejected)                 |
| `note`                       | up to 255 chars                                            |
| `from` / `to`                | `from` must not be after `to`                              |

## Error Responses

```json
{ "error": "Expense not found" }
```

```json
{ "errors": ["amount must be a positive number"] }
```

| Status          | Meaning                                                                 |
| --------------- | ----------------------------------------------------------------------- |
| 200 / 201 / 204 | OK / created / deleted                                                  |
| 400             | Validation error, bad id or month, malformed JSON, value rejected by DB |
| 404             | Unknown route, expense not found, no budget for month                   |
| 409             | Duplicate entry                                                         |
| 413             | Body too large                                                          |
| 500             | Unexpected error (logged, not returned)                                 |
| 503             | Database unavailable                                                    |

## Sample Data and Expected Results

`db/seed.sql`: 12 expenses (5 food, 3 transport, 2 stationery, 2 entertainment), Aug–Oct 2026.

| Request                                           | Expected                                                        |
| ------------------------------------------------- | --------------------------------------------------------------- |
| `GET /api/expenses`                               | `count: 12`                                                     |
| `GET /api/expenses?category=food`                 | `count: 5`                                                      |
| `GET /api/expenses?from=2026-10-01&to=2026-10-31` | `count: 6`                                                      |
| `GET /api/expenses?from=2026-10-24&to=2026-10-24` | `count: 2`                                                      |
| `GET /api/summary/monthly`                        | `grand_total: 5690.5`                                           |
| `GET /api/summary/category`                       | entertainment 1900, food 1880.5, stationery 1080, transport 830 |
| Budget 5000 → October status                      | `ok`, 48.41%                                                    |
| Budget 3000 → October status                      | `warning`, 80.68%                                               |
| Budget 2400 → October status                      | `exceeded`, `remaining: -20.5`                                  |

SQL cross-check:

```sql
USE expense_tracker;
SELECT SUM(amount) FROM expenses;
SELECT DATE_FORMAT(expense_date, '%Y-%m') AS month, SUM(amount), COUNT(*) FROM expenses GROUP BY month ORDER BY month;
SELECT category, SUM(amount), COUNT(*) FROM expenses GROUP BY category ORDER BY SUM(amount) DESC;
```

## Design Notes

- `DECIMAL` for money; pool options `decimalNumbers: true` and `dateStrings: true`
- Parameterized queries only; dynamic SQL limited to fixed conditions in `buildWhere.js`
- `update()` re-reads the row instead of trusting `affectedRows`, since MySQL reports 0 for unchanged values
- Budget status reuses the monthly aggregation query
