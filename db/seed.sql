USE expense_tracker;

DELETE FROM expenses;
ALTER TABLE expenses AUTO_INCREMENT = 1;

INSERT INTO expenses (title, amount, category, expense_date, note) VALUES
('Lunch',              150.50, 'food',          '2026-10-24', 'Canteen'),
('Metro recharge',     500.00, 'transport',     '2026-10-20', NULL),
('Notebook',           230.00, 'stationery',    '2026-09-15', NULL),
('Groceries',         1200.00, 'food',          '2026-10-03', NULL),
('Movie',              400.00, 'entertainment', '2026-10-18', NULL),
('Auto fare',           80.00, 'transport',     '2026-10-24', NULL),
('Dinner',             320.00, 'food',          '2026-09-28', NULL),
('Textbook',           850.00, 'stationery',    '2026-09-02', NULL),
('Coffee',             120.00, 'food',          '2026-08-30', NULL),
('Bus ticket',         250.00, 'transport',     '2026-09-10', NULL),
('Concert',           1500.00, 'entertainment', '2026-09-20', NULL),
('Snacks',              90.00, 'food',          '2026-10-25', NULL);