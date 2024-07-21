package app

import (
	"github.com/kokweikhong/khongfamily/internal/app/handlers"
	"github.com/labstack/echo/v4"
)

func (a *app) registerRoutes(e *echo.Echo) {
	appRouter := &appRouter{
		handler: handlers.NewBaseHandler(),
	}

	expensesGroup := e.Group("/expenses")
	appRouter.registerExpensesRoutes(expensesGroup)

}

type appRouter struct {
	handler *handlers.BaseHandler
}

func (a *appRouter) registerExpensesRoutes(e *echo.Group) {
	e.GET("", a.handler.Expenses.ExpensesHandler)
	e.GET("/categories", a.handler.Expenses.ExpenseCategoriesCombobox)
}
