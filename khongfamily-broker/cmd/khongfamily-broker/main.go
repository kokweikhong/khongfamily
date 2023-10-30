package main

import (
	"log"

	"github.com/kokweikhong/khongfamily-broker/internal/config"
	"github.com/kokweikhong/khongfamily-broker/internal/db"
	"github.com/kokweikhong/khongfamily-broker/internal/router"
)

func main() {

	log.SetFlags(log.LstdFlags | log.Lshortfile)

	if err := config.Init(); err != nil {
		panic(err)
	}

	if err := db.Init(); err != nil {
		panic(err)
	}

	r := router.Init()

	router.Run(r)
}
