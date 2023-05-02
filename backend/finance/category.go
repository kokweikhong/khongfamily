package finance

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"regexp"
	"strings"
	"time"
)

type Category struct {
	ID        int       `json:"id"`
	Name      string    `json:"name"`
	Remarks   string    `json:"remarks"`
	CreatedAt time.Time `json:"created_at"`
}

// CategoryServer is the server API for Category.
type CategoryServer struct {
	db *sql.DB
}

// NewCategoryServer creates a Category server.
func NewCategoryServer(db *sql.DB) *CategoryServer {
	return &CategoryServer{db}
}

// regexp to match url path
var (
	categoryListRE = regexp.MustCompile(`^/finance/category[\/]*$`)

	categoryRE = regexp.MustCompile(`^/finance/category/([0-9]+)[\/]*$`)

	categoryCreateRE = regexp.MustCompile(`^/finance/category/create[\/]*$`)

	categoryUpdateRE = regexp.MustCompile(`^/finance/category/update[\/]*$`)

	categoryDeleteRE = regexp.MustCompile(`^/finance/category/delete/([0-9]+)[\/]*$`)
)

// ServeHTTP implements http.Handler.
func (s *CategoryServer) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	log.Println(r.Method, r.URL.Path)
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, allow-control-allow-origin")
	if r.Method == "OPTIONS" {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, allow-control-allow-origin")
		w.WriteHeader(http.StatusOK)
		return
	}
	switch {
	case r.Method == "GET" && categoryListRE.MatchString(r.URL.Path):
		log.Println("categoryListRE")
		s.List(w, r)
		return
	case r.Method == "GET" && categoryRE.MatchString(r.URL.Path):
		log.Println("categoryRE")
		s.Get(w, r)
		return
	case r.Method == "POST" && categoryCreateRE.MatchString(r.URL.Path):
		log.Println("categoryCreateRE")
		s.Create(w, r)
		return
	case r.Method == "POST" && categoryUpdateRE.MatchString(r.URL.Path):
		log.Println("categoryUpdateRE")
		s.Update(w, r)
		return
	case r.Method == "POST" && categoryDeleteRE.MatchString(r.URL.Path):
		log.Println("categoryDeleteRE")
		s.Delete(w, r)
		return
	default:
		http.Error(w, "Not Found", http.StatusNotFound)
	}
}

// List returns a list of categories.
func (s *CategoryServer) List(w http.ResponseWriter, r *http.Request) {
	// query the database
	rows, err := s.db.Query(`SELECT id, name, remarks, created_at FROM finance_category`)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var categories = make([]Category, 0)
	for rows.Next() {
		var c Category
		if err := rows.Scan(&c.ID, &c.Name, &c.Remarks, &c.CreatedAt); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		categories = append(categories, c)
	}
	if err := rows.Err(); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// write the response
    if err := json.NewEncoder(w).Encode(categories); err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
    }
}

// returns a single category
func (s *CategoryServer) Get(w http.ResponseWriter, r *http.Request) {
	// extract the id from the url
	matches := categoryRE.FindStringSubmatch(r.URL.Path)
	if len(matches) != 2 {
		http.Error(w, "Invalid category id", http.StatusBadRequest)
		return
	}
	id := matches[1]

	// query the database
	var c Category
	if err := s.db.QueryRow(`
    SELECT id, name, remarks, created_at
    FROM finance_category
    WHERE id=$1`, id).Scan(&c.ID, &c.Name, &c.Remarks, &c.CreatedAt); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// write the response
	if err := json.NewEncoder(w).Encode(c); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}

// Create creates a new category.
func (s *CategoryServer) Create(w http.ResponseWriter, r *http.Request) {
	// decode the request
	var c Category
	if err := json.NewDecoder(r.Body).Decode(&c); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	c.CreatedAt = time.Now()
	c.Name = strings.Title(c.Name)

	// check if the category already exists
	var id int
	if err := s.db.QueryRow(`SELECT id FROM finance_category WHERE LOWER(name)=LOWER($1)`, c.Name).Scan(&id); err != sql.ErrNoRows {
		http.Error(w, "Category already exists", http.StatusBadRequest)
		return
	}

	// insert the category into the database
	_, err := s.db.Exec(`
    INSERT INTO finance_category 
    (name, remarks, created_at) 
    VALUES ($1, $2, $3)`,
		c.Name, c.Remarks, c.CreatedAt)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// write the response
	if err := json.NewEncoder(w).Encode(c); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(http.StatusCreated)
}

// Update updates a category.
func (s *CategoryServer) Update(w http.ResponseWriter, r *http.Request) {
	// decode the request
	var c Category
	if err := json.NewDecoder(r.Body).Decode(&c); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	c.CreatedAt = time.Now()
	c.Name = strings.Title(c.Name)

	// update the category in the database
	if _, err := s.db.Exec(`UPDATE finance_category SET name=$1, remarks=$2 WHERE id=$3`, c.Name, c.Remarks, c.ID); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// write the response
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(http.StatusOK)
	if err := json.NewEncoder(w).Encode(c); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}

// delete a category.
func (s *CategoryServer) Delete(w http.ResponseWriter, r *http.Request) {

	matches := categoryDeleteRE.FindStringSubmatch(r.URL.Path)
	if len(matches) != 2 {
		http.Error(w, "Invalid category id", http.StatusBadRequest)
		return
	}
	id := matches[1]
	// var c Category
	// if err := json.NewDecoder(r.Body).Decode(&c); err != nil {
	// 	http.Error(w, err.Error(), http.StatusBadRequest)
	// 	return
	// }

	// delete the category from the database
	if _, err := s.db.Exec(`DELETE FROM finance_category WHERE id=$1`, id); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

    // write the response
    w.Header().Set("Content-Type", "application/json; charset=utf-8")
    w.WriteHeader(http.StatusOK)
    if err := json.NewEncoder(w).Encode(id); err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
    }

}
