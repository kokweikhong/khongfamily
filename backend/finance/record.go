package finance

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"regexp"
	"time"

	"github.com/lib/pq"
)

type Record struct {
	Id           int            `json:"id"`
	Name         string         `json:"name"`
	CategoryId   int            `json:"category_id"`
	CategoryName string         `json:"category_name"`
	Currency     string         `json:"currency"`
	Amount       float64        `json:"amount"`
	Year         int            `json:"year"`
	Month        int            `json:"month"`
	Tags         pq.StringArray `json:"tags"`
	Remarks      string         `json:"remarks"`
	CreatedAt    time.Time      `json:"created_at"`
}

type RecordServer struct {
	db *sql.DB
}

func NewRecordServer(db *sql.DB) *RecordServer {
	return &RecordServer{db: db}
}

// regexp for url path
var (
	recordListRE = regexp.MustCompile(`^/finance/record[\/]*$`)

	recordRE = regexp.MustCompile(`^/finance/record/([0-9]+)[\/]*$`)

	recordCreateRE = regexp.MustCompile(`^/finance/record/create[\/]*$`)

	recordUpdateRE = regexp.MustCompile(`^/finance/record/update[\/]*$`)

	recordDeleteRE = regexp.MustCompile(`^/finance/record/delete/([0-9]+)[\/]*$`)
)

// ServerHTTP handles all requests to the web service.
func (s *RecordServer) ServeHTTP(w http.ResponseWriter, r *http.Request) {
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
	case r.Method == "GET" && recordListRE.MatchString(r.URL.Path):
		s.List(w, r)
	case r.Method == "GET" && recordRE.MatchString(r.URL.Path):
		s.Get(w, r)
	case r.Method == "POST" && recordCreateRE.MatchString(r.URL.Path):
		s.Create(w, r)
	case r.Method == "POST" && recordUpdateRE.MatchString(r.URL.Path):
		s.Update(w, r)
	case r.Method == "POST" && recordDeleteRE.MatchString(r.URL.Path):
		s.Delete(w, r)
	default:
		http.Error(w, "Not Found", http.StatusNotFound)
	}
}

// List returns a list of records.
func (s *RecordServer) List(w http.ResponseWriter, r *http.Request) {
	log.Println("List")
	// query records from database
	// SELECT finance_records.id, finance_records.amount, categories.name
	// FROM finance_records
	// JOIN categories ON finance_records.category_id = categories.id;
	// rows, err := s.db.Query(
	// 	`SELECT id, name, category_id, currency, amount, year, month, tags, remarks, created_at
	//        FROM finance_records`)

	// rows, err := s.db.Query(
	// 	`SELECT id, name, finance_category.name, currency, amount, year, month, tags, remarks, created_at
	//        FROM finance_records JOIN finance_category on finance_records.category_id = finance_category.id`)
	rows, err := s.db.Query(
		`SELECT
	       r.id,
	       r.name,
           c.id,
	       c.name,
	       r.currency,
	       r.amount,
	       r.year,
	       r.month,
	       r.tags,
	       r.remarks,
	       r.created_at 
           FROM finance_records r JOIN finance_category c on r.category_id = c.id`)
	// rows, err := s.db.Query(
	// 	`SELECT
	//        id,
	//        name,
	//        category_id,
	//        category_name,
	//        currency,
	//        amount,
	//        year,
	//        month,
	//        tags,
	//        remarks,
	//        created_at FROM finance_records`)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	// records := []Record{}
	records := make([]Record, 0)
	for rows.Next() {
		record := Record{}
		fmt.Println(rows)
		err := rows.Scan(&record.Id, &record.Name, &record.CategoryId, &record.CategoryName, &record.Currency, &record.Amount, &record.Year, &record.Month, &record.Tags, &record.Remarks, &record.CreatedAt)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		records = append(records, record)
	}
	if err = rows.Err(); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// encode the records as JSON and send it to the client
	if err := json.NewEncoder(w).Encode(records); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}

// Get returns a record.
func (s *RecordServer) Get(w http.ResponseWriter, r *http.Request) {
	// extract the record id from the request
	m := recordRE.FindStringSubmatch(r.URL.Path)
	id := m[1]

	// query record from database
	row := s.db.QueryRow(
		`SELECT id, name, category_id, category_name, currency, amount, year, month, tags, remarks, created_at 
        FROM finance_records WHERE id = $1`, id)
	record := Record{}
	err := row.Scan(&record.Id, &record.Name, &record.CategoryId, &record.CategoryName, &record.Currency, &record.Amount, &record.Year, &record.Month, &record.Tags, &record.Remarks, &record.CreatedAt)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// encode the record as JSON and send it to the client
	if err := json.NewEncoder(w).Encode(record); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}

// Create creates a record.
func (s *RecordServer) Create(w http.ResponseWriter, r *http.Request) {
	// decode the record from the request
	record := Record{}
	if err := json.NewDecoder(r.Body).Decode(&record); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	record.CreatedAt = time.Now()

	// insert the record into database, category_id is a foreign key
	_, err := s.db.Exec(
		`INSERT INTO finance_records (name, category_id, currency,
        amount, year, month, tags, remarks, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
		record.Name, record.CategoryId, record.Currency,
		record.Amount, record.Year, record.Month, record.Tags, record.Remarks, record.CreatedAt)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

}

// Update updates a record.
func (s *RecordServer) Update(w http.ResponseWriter, r *http.Request) {
	// decode the record from the request
	record := Record{}
	if err := json.NewDecoder(r.Body).Decode(&record); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	record.CreatedAt = time.Now()

	// update the record in database
	_, err := s.db.Exec(
		`UPDATE finance_records SET name=$1, category_id=$2, category_name=$3, 
        currency=$4, amount=$5, year=$6, month=$7, tags=$8, remarks=$9 
        WHERE id=$10`,
		record.Name, record.CategoryId, record.CategoryName,
		record.Currency, record.Amount, record.Year, record.Month, record.Tags, record.Remarks, record.Id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}

// Delete deletes a record.
func (s *RecordServer) Delete(w http.ResponseWriter, r *http.Request) {
	// extract the record id from the request
	m := recordDeleteRE.FindStringSubmatch(r.URL.Path)
	id := m[1]

	// delete the record from database
	_, err := s.db.Exec(
		`DELETE FROM finance_records WHERE id = $1`, id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}
