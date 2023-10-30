package model

type FinanceExpensesRecord struct {
	ID              int     `json:"id" db:"id"`
	Date            string  `json:"date" db:"date"`
	Name            string  `json:"name" db:"name"`
	Category        string  `json:"category" db:"category"`
	CategoryID      int     `json:"categoryID" db:"category_id"`
	Currency        string  `json:"currency" db:"currency"`
	Amount          float64 `json:"amount" db:"amount"`
	IsFixedExpenses bool    `json:"isFixedExpenses" db:"is_fixed_expenses"`
	IsPaid          bool    `json:"isPaid" db:"is_paid"`
	Remarks         string  `json:"remarks" db:"remarks"`
	CreatedAt       string  `json:"createdAt" db:"created_at"`
	UpdatedAt       string  `json:"updatedAt" db:"updated_at"`
}

type FinanceExpensesCategory struct {
	ID        int    `json:"id" db:"id"`
	Name      string `json:"name" db:"name"`
	Remarks   string `json:"remarks" db:"remarks"`
	CreatedAt string `json:"createdAt" db:"created_at"`
	UpdatedAt string `json:"updatedAt" db:"updated_at"`
}
