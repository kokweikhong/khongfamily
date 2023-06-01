package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"

	_ "github.com/lib/pq"

	"github.com/kokweikhong/khongfinance/backend/finance"
	"github.com/kokweikhong/khongfinance/backend/users"
)

var (
	DB_HOST     = os.Getenv("DB_HOST")
	DB_PORT     = os.Getenv("DB_PORT")
	DB_USER     = os.Getenv("DB_USER")
	DB_PASSWORD = os.Getenv("DB_PASSWORD")
	DB_NAME     = os.Getenv("DB_NAME")
)

func main() {
	connStr := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable", DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME)

	db, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal(err)
	}
	// defer db.Close()

	if err := db.Ping(); err != nil {
		log.Fatal(err)
	}

	fmt.Println("Successfully connected!")

	mux := http.NewServeMux()

	// init finance server
	financeCategoryServer := finance.NewCategoryServer(db)
	// init finance tag server
	financeRecordServer := finance.NewRecordServer(db)
    // init user server
    userServer := users.NewUserServer(db)

	mux.Handle("/finance/category/", financeCategoryServer)
	mux.Handle("/finance/record/", financeRecordServer)
    mux.Handle("/users/", userServer)

	// start server
	log.Fatal(http.ListenAndServe(":8080", mux))

}
