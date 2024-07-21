-- name: GetExpenses :many
SELECT expenses.*, expense_categories.name as category_name
FROM expenses
JOIN expense_categories ON expenses.expense_category_id = expense_categories.id
ORDER BY expenses.date DESC;

-- name: GetExpensesByCategories :many
SELECT expenses.*, expense_categories.name as category_name
FROM expenses
JOIN expense_categories ON expenses.expense_category_id = expense_categories.id
WHERE expense_categories.name = ANY($1::text[]);

-- name: GetExpenseById :one
SELECT * FROM expenses WHERE id = $1;

-- name: CreateExpense :one
INSERT INTO expenses (expense_category_id, amount_cents, description, date, remarks)
VALUES ($1, $2, $3, $4, $5)
RETURNING id;

-- name: UpdateExpense :exec
UPDATE expenses
SET expense_category_id = $1, amount_cents = $2, description = $3, date = $4, remarks = $5
WHERE id = $6;

-- name: DeleteExpense :exec
DELETE FROM expenses WHERE id = $1;

-- name: GetExpenseCategories :many
SELECT * FROM expense_categories ORDER BY name;

-- name: GetExpenseCategoryById :one
SELECT * FROM expense_categories WHERE id = $1;

-- name: CreateExpenseCategory :one
INSERT INTO expense_categories (name, description)
VALUES (LOWER($1), $2)
RETURNING id;

-- name: UpdateExpenseCategory :exec
UPDATE expense_categories
SET name = $1, description = $2
WHERE id = $3;

-- name: DeleteExpenseCategory :exec
DELETE FROM expense_categories WHERE id = $1;
