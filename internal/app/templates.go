package app

import (
	"html/template"
	"io"

	"github.com/kokweikhong/khongfamily/web"
	"github.com/labstack/echo/v4"
)

type Template struct {
	templates map[string]*template.Template
}

func (t *Template) Render(w io.Writer, name string, data interface{}, c echo.Context) error {
	tmpl, ok := t.templates[name]
	if !ok {
		return nil
	}

	return tmpl.ExecuteTemplate(w, "base", data)
}

func (a *app) registerTemplates(e *echo.Echo) {
	at := new(appTemplate)
	templates := make(map[string]*template.Template)
	at.registerExpensesTemplates(templates)
	e.Renderer = &Template{
		templates: templates,
	}
}

type appTemplate struct {
}

func (a *appTemplate) registerExpensesTemplates(templates map[string]*template.Template) {
	templates["expenses.html"] = template.Must(
		template.ParseFS(
			web.GetViews(),
			"views/expenses.html",
			"views/partials/base.html",
		),
	)
}
