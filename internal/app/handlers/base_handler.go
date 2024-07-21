package handlers

type BaseHandler struct {
	Expenses *expensesHandler
}

func NewBaseHandler() *BaseHandler {
	return &BaseHandler{
		Expenses: newExpensesHandler(),
	}
}
