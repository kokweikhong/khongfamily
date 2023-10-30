package router

import (
	"github.com/go-chi/chi/v5"
	"github.com/kokweikhong/khongfamily-broker/internal/handlers"
	myMiddleware "github.com/kokweikhong/khongfamily-broker/internal/middleware"
)

type UserRouter interface {
	SetupRoutes() *chi.Mux
}

type userRouter struct{}

func NewUserRouter() UserRouter {
	return &userRouter{}
}

func (r *userRouter) SetupRoutes() *chi.Mux {
	router := chi.NewRouter()
	h := handlers.NewUserHandler()

	router.Route("/", func(r chi.Router) {
		router.Post("/signin", h.SignIn)
		router.Post("/", h.CreateUser)

		router.With(myMiddleware.AuthMiddleware).Get("/", h.ListUsers)
		router.With(myMiddleware.AuthMiddleware).Get("/{id}", h.GetUser)
		router.With(myMiddleware.AuthMiddleware).Put("/", h.UpdateUser)
		router.With(myMiddleware.AuthMiddleware).Delete("/{id}", h.DeleteUser)
		router.With(myMiddleware.AuthMiddleware).Put("/password", h.UpdatePassword)
	})

	return router
}
