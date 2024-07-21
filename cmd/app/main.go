package main

import (
	"fmt"

	"github.com/kokweikhong/khongfamily/internal/app"
)

func main() {
	fmt.Println("Hello, World!")

	app := app.NewApp()

	app.Start()
}
