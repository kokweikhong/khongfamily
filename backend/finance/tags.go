package finance

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"regexp"
	"time"
)

type Tag struct {
	Id        int       `json:"id"`
	Name      string    `json:"name"`
	Remarks   string    `json:"remarks"`
	CreatedAt time.Time `json:"created_at"`
}

type TagServer struct {
	db *sql.DB
}

func NewTagServer(db *sql.DB) *TagServer {
	return &TagServer{db: db}
}

// regexp for url path
var (
	tagListRE = regexp.MustCompile(`^/finance/tag[\/]*$`)

	tagRE = regexp.MustCompile(`^/finance/tag/([0-9]+)[\/]*$`)

	tagCreateRE = regexp.MustCompile(`^/finance/tag/create[\/]*$`)

	tagUpdateRE = regexp.MustCompile(`^/finance/tag/update[\/]*$`)

	tagDeleteRE = regexp.MustCompile(`^/finance/tag/delete/([0-9]+)[\/]*$`)
)

// ServerHTTP handles all requests to the web service.
func (s *TagServer) ServeHTTP(w http.ResponseWriter, r *http.Request) {
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
	case r.Method == "GET" && tagListRE.MatchString(r.URL.Path):
		s.List(w, r)
	case r.Method == "GET" && tagRE.MatchString(r.URL.Path):
		s.Get(w, r)
	case r.Method == "POST" && tagCreateRE.MatchString(r.URL.Path):
		s.Create(w, r)
	case r.Method == "POST" && tagUpdateRE.MatchString(r.URL.Path):
		s.Update(w, r)
	case r.Method == "POST" && tagDeleteRE.MatchString(r.URL.Path):
		s.Delete(w, r)
	default:
		http.Error(w, "Not Found", http.StatusNotFound)
	}
}

// List returns a list of tags.
func (s *TagServer) List(w http.ResponseWriter, r *http.Request) {
	// query tags from database
	rows, err := s.db.Query("SELECT id, name, remarks, created_at FROM finance_category")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	// create a slice of tags
	tags := make([]Tag, 0)
	for rows.Next() {
		t := Tag{}
		err := rows.Scan(&t.Id, &t.Name, &t.Remarks, &t.CreatedAt)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		tags = append(tags, t)
	}
	if err = rows.Err(); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// write the tags to the response
	if err := WriteJSON(w, http.StatusOK, tags); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}

// Get returns a single tag.
func (s *TagServer) Get(w http.ResponseWriter, r *http.Request) {
	// extract the id from the request
	m := tagRE.FindStringSubmatch(r.URL.Path)
	id := m[1]

	// query the tag from the database
	t := Tag{}
	err := s.db.QueryRow("SELECT id, name, remarks, created_at FROM finance_category WHERE id=$1", id).
		Scan(&t.Id, &t.Name, &t.Remarks, &t.CreatedAt)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// write the tag to the response
	if err := WriteJSON(w, http.StatusOK, t); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}

// Create creates a new tag.
func (s *TagServer) Create(w http.ResponseWriter, r *http.Request) {
	// decode the tag from the request body
	var t Tag
	if err := json.NewDecoder(r.Body).Decode(&t); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// check if the tag already exists
	var id int
	err := s.db.QueryRow("SELECT id FROM finance_category WHERE name=$1", t.Name).Scan(&id)
	if err != sql.ErrNoRows {
		http.Error(w, "Tag already exists", http.StatusBadRequest)
		return
	}

	t.CreatedAt = time.Now()

	// insert the tag into the database
	_, err = s.db.Exec("INSERT INTO finance_category (name, remarks, created_at) VALUES ($1, $2, $3)", t.Name, t.Remarks, t.CreatedAt)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// write the id to the response
	if err := WriteJSON(w, http.StatusOK, id); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}

// Update updates a tag.
func (s *TagServer) Update(w http.ResponseWriter, r *http.Request) {
	// decode the tag from the request body
	var t Tag
	if err := json.NewDecoder(r.Body).Decode(&t); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	t.CreatedAt = time.Now()

	// update the tag in the database
	_, err := s.db.Exec("UPDATE finance_category SET name=$1, remarks=$2 WHERE id=$3", t.Name, t.Remarks, t.Id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// write the id to the response
	if err := WriteJSON(w, http.StatusOK, t.Id); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}

// Delete deletes a tag.
func (s *TagServer) Delete(w http.ResponseWriter, r *http.Request) {
	// extract the id from the request
	m := tagDeleteRE.FindStringSubmatch(r.URL.Path)
	id := m[1]

	// delete the tag from the database
	_, err := s.db.Exec("DELETE FROM finance_category WHERE id=$1", id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// write the id to the response
	if err := WriteJSON(w, http.StatusOK, id); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}

// WriteJSON writes the given interface object as JSON to the response body.
func WriteJSON(w http.ResponseWriter, code int, v interface{}) error {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(code)
	return json.NewEncoder(w).Encode(v)
}
