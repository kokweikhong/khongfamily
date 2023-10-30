package router

import (
	"fmt"
	"log"
	"log/slog"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	"github.com/kokweikhong/khongfamily-broker/internal/config"
	"github.com/kokweikhong/khongfamily-broker/internal/handlers"
	myMiddleware "github.com/kokweikhong/khongfamily-broker/internal/middleware"
)

func Init() *chi.Mux {
	r := chi.NewRouter()

	r.Use(middleware.RequestID)
	r.Use(middleware.RealIP)
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)

	// allow CORS
	r.Use(middleware.AllowContentType("application/json"))

	// handle all OPTIONS request
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token", "allow-control-allow-origin"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: false,
		MaxAge:           300, // Maximum value not ignored by any of major browsers
	}))

	finance := chi.NewRouter()
	r.Mount("/finance", finance)
	slog.Info("Mounting finance router")

	financeExpenses := setupFinanceExpensesRouter()
	finance.Mount("/expenses", financeExpenses)
	slog.Info("Mounting finance expenses router")

	userRouter := NewUserRouter()
	r.Mount("/users", userRouter.SetupRoutes())
	slog.Info("Mounting user router")

	r.Route("/auth", func(r chi.Router) {
		auth := handlers.NewAuthHandler()
		r.Post("/refresh-token", auth.RefreshToken)
	})

	return r
}

func Run(r *chi.Mux) {
	listenAddr := config.Cfg.ServerListenAddr
	slog.Info("Starting router", "listenAddr", listenAddr)
	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%s", listenAddr), r))
}

func setupFinanceExpensesRouter() *chi.Mux {
	r := chi.NewRouter()
	expenses := handlers.NewFinanceExpensesRecord()
	category := handlers.NewFinanceExpensesCategory()
	r.Route("/", func(r chi.Router) {
		r.Use(myMiddleware.AuthMiddleware)
		r.Get("/summary", expenses.GetFinanceExpensesSummary)
		r.Route("/records", func(r chi.Router) {
			r.Get("/", expenses.List)
			r.Get("/{id}", expenses.Get)
			r.Post("/", expenses.Create)
			r.Put("/{id}", expenses.Update)
			r.Delete("/{id}", expenses.Delete)
		})
		r.Route("/categories", func(r chi.Router) {
			r.Get("/", category.List)
			r.Get("/{id}", category.Get)
			r.Post("/", category.Create)
			r.Put("/{id}", category.Update)
			r.Delete("/{id}", category.Delete)
		})
	})
	return r
}
