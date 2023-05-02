package finance

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"regexp"
	"time"
)

type Record struct {
	Id             int       `json:"id"`
	Name           string    `json:"name"`
	CategoryId     int       `json:"category_id"`
	CategoryName   string    `json:"category_name"`
	IsFixedExpense bool      `json:"isFixedExpense"`
	Currency       string    `json:"currency"`
	Amount         float64   `json:"amount"`
	Date           time.Time `json:"date"`
	Remarks        string    `json:"remarks"`
	CreatedAt      time.Time `json:"created_at"`
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

	//with query string
	// recordListRE = regexp.MustCompile(`^/finance/record\?*$`)

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
	query := r.URL.Query()
	_, isGroup := query["group"]
    fmt.Println(isGroup)
	queryStr := queryBuilder(query)

	// TODO: add filter
	rows, err := s.db.Query(queryStr)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()
	if !isGroup {
		records, err := withoutQuery(rows)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		if err := json.NewEncoder(w).Encode(records); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		return
	} else if isGroup {
		records, err := withQueryCategoryAndDate(rows)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		if err := json.NewEncoder(w).Encode(records); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		return
	}
}

func queryBuilder(query map[string][]string) string {
	var queryStr string
	_, isGroup := query["group"]
	_, isFrom := query["from"]
	_, isTo := query["to"]
	if !isGroup {
		query["group"] = []string{"all"}
	}
	switch query["group"][0] {
	case "date":
		queryStr = `SELECT
                        TO_CHAR(date, 'YYYY-MM') AS name,
                        SUM(amount) AS total_amount
                        FROM finance_records
                        %v 
                        GROUP BY finance_records.date
                        ORDER BY name`
	case "category":
		queryStr = `SELECT finance_category.name AS name,
                        SUM(amount) AS total_amount
                        FROM finance_records
                        JOIN finance_category ON finance_records.category_id = finance_category.id
                        %v 
                        GROUP BY finance_category.name
                        ORDER BY name`
	default:
		queryStr = `SELECT r.id, r.name, r.category_id, c.name, is_fixed_expense,
	               r.currency, r.amount, r.date, r.remarks, r.created_at
	               FROM finance_records AS r
	               JOIN finance_category AS c ON r.category_id = c.id
                   %v`
	}
	if isFrom && isTo {
		start, err := time.Parse("2006-01-02", query["from"][0])
		if err != nil {
			return fmt.Sprintf(queryStr, "")
		}
		end, err := time.Parse("2006-01-02", query["to"][0])
		if err != nil {
			return fmt.Sprintf(queryStr, "")
		}
		queryDateStr := fmt.Sprintf(" WHERE date BETWEEN '%v' AND '%v' ",
			start.UTC().Format("2006-01-02T15:04:05Z"), end.UTC().Format("2006-01-02T15:04:05Z"))
		queryStr = fmt.Sprintf(queryStr, queryDateStr)
	} else {
        queryStr = fmt.Sprintf(queryStr, "")
    }
	return queryStr
}

type RecordCategoryAndDate struct {
	Name        string  `json:"name"`
	TotalAmount float64 `json:"total_amount"`
}

func withQueryCategoryAndDate(rows *sql.Rows) ([]*RecordCategoryAndDate, error) {
	records := make([]*RecordCategoryAndDate, 0)
	for rows.Next() {
		record := new(RecordCategoryAndDate)
		err := rows.Scan(&record.Name, &record.TotalAmount)
		if err != nil {
			return nil, err
		}
		records = append(records, record)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return records, nil
}

func withoutQuery(rows *sql.Rows) ([]*Record, error) {
	records := make([]*Record, 0)
	for rows.Next() {
		record := new(Record)
		err := rows.Scan(
			&record.Id, &record.Name, &record.CategoryId, &record.CategoryName,
			&record.IsFixedExpense, &record.Currency, &record.Amount, &record.Date,
			&record.Remarks, &record.CreatedAt)
		if err != nil {
			return nil, err
		}
		records = append(records, record)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return records, nil
}

// Get returns a record by id.
func (s *RecordServer) Get(w http.ResponseWriter, r *http.Request) {
	id := recordRE.FindStringSubmatch(r.URL.Path)[1]
	row := s.db.QueryRow("SELECT id, name, category_id, is_fixed_expense, currency, amount, date, remarks, created_at FROM finance_records WHERE id = $1", id)

	record := new(Record)
	err := row.Scan(&record.Id, &record.Name, &record.CategoryId, &record.IsFixedExpense, &record.Currency, &record.Amount, &record.Date, &record.Remarks, &record.CreatedAt)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if err := json.NewEncoder(w).Encode(record); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}

// Create creates a new record.
func (s *RecordServer) Create(w http.ResponseWriter, r *http.Request) {
	record := new(Record)
	if err := json.NewDecoder(r.Body).Decode(record); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	record.CreatedAt = time.Now()

	row := s.db.QueryRow("INSERT INTO finance_records(name, category_id, is_fixed_expense, currency, amount, date, remarks, created_at) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id", record.Name, record.CategoryId, record.IsFixedExpense, record.Currency, record.Amount, record.Date, record.Remarks, record.CreatedAt)

	err := row.Scan(&record.Id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if err := json.NewEncoder(w).Encode(record); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}

// Update updates a record.
func (s *RecordServer) Update(w http.ResponseWriter, r *http.Request) {
	record := new(Record)
	if err := json.NewDecoder(r.Body).Decode(record); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// created_at is set by server
	record.CreatedAt = time.Now()

	row := s.db.QueryRow("UPDATE finance_records SET name = $1, category_id = $2, is_fixed_expense = $3, currency = $4, amount = $5, date = $6, remarks = $7, created_at = $8 WHERE id = $9 RETURNING id", record.Name, record.CategoryId, record.IsFixedExpense, record.Currency, record.Amount, record.Date, record.Remarks, record.CreatedAt, record.Id)

	err := row.Scan(&record.Id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if err := json.NewEncoder(w).Encode(record); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}

// Delete deletes a record.
func (s *RecordServer) Delete(w http.ResponseWriter, r *http.Request) {
	id := recordDeleteRE.FindStringSubmatch(r.URL.Path)[1]
	_, err := s.db.Exec("DELETE FROM finance_records WHERE id = $1", id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}
