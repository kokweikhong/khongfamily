package users

import (
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/labstack/echo/v4"
)

type UserHandler interface {
	RegisterUserHandler()
}

type userHandler struct {
	e  *echo.Group
	db *pgxpool.Pool
}

func NewUserHandler(e *echo.Group, db *pgxpool.Pool) UserHandler {
	return &userHandler{e: e, db: db}
}

func (u *userHandler) RegisterUserHandler() {
	u.e.GET("/", func(c echo.Context) error {
		return c.JSON(200, "Hello World")
	})
}
