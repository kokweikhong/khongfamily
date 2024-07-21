package handlers

import (
	"log/slog"
	"net/http"

	"github.com/kokweikhong/khongfamily/internal/app/templs"
	expenses "github.com/kokweikhong/khongfamily/internal/app/templs/expeneses"
	"github.com/labstack/echo/v4"
)

type expensesHandler struct {
}

func newExpensesHandler() *expensesHandler {
	return &expensesHandler{}
}

func (e *expensesHandler) ExpensesHandler(c echo.Context) error {
	slog.Info("ExpensesHandler")
	return c.Render(http.StatusOK, "expenses.html", nil)
}

func (e *expensesHandler) ExpenseCategoriesCombobox(c echo.Context) error {
	slog.Info("ExpensesAddHandler")

	return templs.Render(c, http.StatusOK, expenses.Home())
}
