package app

import (
	"embed"
	"io/fs"
	"log/slog"
	"net/http"

	"github.com/kokweikhong/khongfamily/web"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

type App interface {
	Start()
}

type app struct {
}

func NewApp() App {
	return &app{}
}

func (a *app) Start() {
	e := echo.New()
	// pgDB := db.GetDB()

	e.Use(middleware.Recover())
	e.Use(middleware.Logger())

	e.Pre(middleware.RemoveTrailingSlash())

	// static file
	staticFileSystem := getFileSystem(web.GetStatic(), "static")
	e.GET("/static/*", echo.WrapHandler(http.StripPrefix("/static/", http.FileServer(staticFileSystem))))

	a.registerTemplates(e)
	a.registerRoutes(e)

	e.GET("/", func(c echo.Context) error {
		return c.Render(http.StatusOK, "index.html", nil)
	})

	routes := e.Routes()
	for _, route := range routes {
		slog.Info("routes", "routes", route.Path)
	}

	// usersGroup := e.Group("/users")
	// usersHandler := users.NewUserHandler(usersGroup, pgDB)
	// usersHandler.RegisterUserHandler()

	e.Logger.Fatal(e.Start(":8080"))
}

func getFileSystem(embedFileSystem embed.FS, name string) http.FileSystem {
	fsys, err := fs.Sub(embedFileSystem, name)
	if err != nil {
		panic(err)
	}

	return http.FS(fsys)
}
