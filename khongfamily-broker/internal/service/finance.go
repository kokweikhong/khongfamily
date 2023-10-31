package service

import (
	"log/slog"
	"time"

	"github.com/kokweikhong/khongfamily-broker/internal/db"
	"github.com/kokweikhong/khongfamily-broker/internal/model"
	"github.com/lib/pq"
)

type FinanceExpensesRecordService interface {
	List(period string) ([]*model.FinanceExpensesRecord, error)
	Get(id int) (*model.FinanceExpensesRecord, error)
	Create(record *model.FinanceExpensesRecord) error
	InsertMany(records []*model.FinanceExpensesRecord) error
	Update(record *model.FinanceExpensesRecord) error
	Delete(id int) error
}

type FinanceExpensesCategoryService interface {
	List() ([]*model.FinanceExpensesCategory, error)
	Get(id int) (*model.FinanceExpensesCategory, error)
	Create(category *model.FinanceExpensesCategory) error
	Update(category *model.FinanceExpensesCategory) error
	Delete(id int) error
}

type financeExpensesRecordService struct{}

type financeExpensesCategoryService struct{}

func NewFinanceExpensesRecordService() FinanceExpensesRecordService {
	return &financeExpensesRecordService{}
}

func NewFinanceExpensesCategoryService() FinanceExpensesCategoryService {
	return &financeExpensesCategoryService{}
}

func (s *financeExpensesRecordService) List(period string) ([]*model.FinanceExpensesRecord, error) {
	var (
		records  = []*model.FinanceExpensesRecord{}
		toDate   string
		fromDate string
		today    = time.Now()
	)

	db := db.GetDB()

	// toDate is the last day of the month
	toDate = time.Date(
		today.Year(), today.Month()+1, 1, 0, 0, 0, 0, time.UTC,
	).AddDate(0, 0, -1).Format("2006-01-02")
	firstDayOfMonth := time.Date(
		today.Year(), today.Month(), 1, 0, 0, 0, 0, time.UTC)
	switch period {
	case "1m":
		fromDate = firstDayOfMonth.AddDate(0, 0, 0).Format("2006-01-02")
	case "2m":
		fromDate = firstDayOfMonth.AddDate(0, -2, 0).Format("2006-01-02")
	case "3m":
		fromDate = firstDayOfMonth.AddDate(0, -3, 0).Format("2006-01-02")
	case "6m":
		fromDate = firstDayOfMonth.AddDate(0, -6, 0).Format("2006-01-02")
	case "1y":
		fromDate = firstDayOfMonth.AddDate(-1, 0, 0).Format("2006-01-02")
	case "2y":
		fromDate = firstDayOfMonth.AddDate(-2, 0, 0).Format("2006-01-02")
	case "3y":
		fromDate = firstDayOfMonth.AddDate(-3, 0, 0).Format("2006-01-02")
	default:
		fromDate = "1970-01-01"
	}

	queryString := "SELECT r.id, r.date, r.name, r.category_id, c.name AS category, " +
		"r.currency, r.amount, r.is_fixed_expenses, r.is_paid, r.remarks, " +
		"r.created_at, r.updated_at " +
		"FROM finance_expenses_records r " +
		"LEFT JOIN finance_expenses_category c ON r.category_id = c.id " +
		"WHERE r.date BETWEEN $1 AND $2 " +
		"ORDER BY r.date DESC"

	stmt, err := db.Prepare(queryString)
	if err != nil {
		slog.Error("Error preparing statement", "error", err)
		return nil, err
	}

	rows, err := stmt.Query(fromDate, toDate)
	if err != nil {
		slog.Error("Error querying statement", "error", err)
		return nil, err
	}

	for rows.Next() {
		record := new(model.FinanceExpensesRecord)
		err := rows.Scan(
			&record.ID,
			&record.Date,
			&record.Name,
			&record.CategoryID,
			&record.Category,
			&record.Currency,
			&record.Amount,
			&record.IsFixedExpenses,
			&record.IsPaid,
			&record.Remarks,
			&record.CreatedAt,
			&record.UpdatedAt,
		)
		if err != nil {
			slog.Error("Error scanning rows", "error", err)
			return nil, err
		}
		records = append(records, record)
	}

	slog.Info("Completed querying finance expenses records", "records", len(records))

	return records, nil
}

func (s *financeExpensesRecordService) Get(id int) (*model.FinanceExpensesRecord, error) {
	record := new(model.FinanceExpensesRecord)

	db := db.GetDB()

	queryString := "SELECT id, date, name, category_id, currency, amount, " +
		"is_fixed_expenses, is_paid, remarks, created_at, updated_at " +
		"FROM finance_expenses_records WHERE id = $1"

	stmt, err := db.Prepare(queryString)
	if err != nil {
		slog.Error("Error preparing statement", "error", err)
		return nil, err
	}

	err = stmt.QueryRow(id).Scan(
		&record.ID,
		&record.Date,
		&record.Name,
		&record.CategoryID,
		&record.Currency,
		&record.Amount,
		&record.IsFixedExpenses,
		&record.IsPaid,
		&record.Remarks,
		&record.CreatedAt,
		&record.UpdatedAt,
	)
	if err != nil {
		slog.Error("Error scanning rows", "error", err)
		return nil, err
	}

	slog.Info("Completed querying finance expenses record", "record", record)

	return record, nil
}

func (s *financeExpensesRecordService) Create(record *model.FinanceExpensesRecord) error {
	db := db.GetDB()

	queryString := "INSERT INTO finance_expenses_records (date, name, category_id, currency, amount, " +
		"is_fixed_expenses, is_paid, remarks, created_at, updated_at) " +
		"VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_DATE, CURRENT_DATE)"

	stmt, err := db.Prepare(queryString)
	if err != nil {
		slog.Error("Error preparing statement", "error", err)
		return err
	}

	_, err = stmt.Exec(
		record.Date,
		record.Name,
		record.CategoryID,
		record.Currency,
		record.Amount,
		record.IsFixedExpenses,
		record.IsPaid,
		record.Remarks,
	)
	if err != nil {
		slog.Error("Error executing statement", "error", err)
		return err
	}

	slog.Info("Completed creating finance expenses record", "record", record)

	return nil
}

func (*financeExpensesRecordService) InsertMany(records []*model.FinanceExpensesRecord) error {
	db := db.GetDB()

	tx, err := db.Begin()
	if err != nil {
		slog.Error("Error beginning transaction", "error", err)
		return err
	}

	defer tx.Rollback()

	// CopyIn inserts multiple records in a single query
	stmt, err := tx.Prepare(pq.CopyIn("finance_expenses_records",
		"date", "name", "category_id", "currency", "amount", "is_fixed_expenses", "is_paid", "remarks",
		"created_at", "updated_at"))
	if err != nil {
		slog.Error("Error preparing statement", "error", err)
		return err
	}

	currentTime := time.Now()

	for _, record := range records {
		_, err = stmt.Exec(
			record.Date,
			record.Name,
			record.CategoryID,
			record.Currency,
			record.Amount,
			record.IsFixedExpenses,
			record.IsPaid,
			record.Remarks,
			currentTime,
			currentTime,
		)
		if err != nil {
			slog.Error("Error executing statement", "error", err)
			return err
		}
	}

	_, err = stmt.Exec()
	if err != nil {
		slog.Error("Error executing statement", "error", err)
		return err
	}

	err = stmt.Close()
	if err != nil {
		slog.Error("Error closing statement", "error", err)
		return err
	}

	err = tx.Commit()
	if err != nil {
		slog.Error("Error committing transaction", "error", err)
		return err
	}

	slog.Info("Completed inserting finance expenses records", "records", len(records))

	return nil
}

func (s *financeExpensesRecordService) Update(record *model.FinanceExpensesRecord) error {
	db := db.GetDB()

	queryString := "UPDATE finance_expenses_records SET date = $1, name = $2, category_id = $3, currency = $4, " +
		"amount = $5, is_fixed_expenses = $6, is_paid = $7, remarks = $8, updated_at = CURRENT_DATE " +
		"WHERE id = $9"

	stmt, err := db.Prepare(queryString)
	if err != nil {
		slog.Error("Error preparing statement", "error", err)
		return err
	}

	_, err = stmt.Exec(
		record.Date,
		record.Name,
		record.CategoryID,
		record.Currency,
		record.Amount,
		record.IsFixedExpenses,
		record.IsPaid,
		record.Remarks,
		record.ID,
	)
	if err != nil {
		slog.Error("Error executing statement", "error", err)
		return err
	}

	slog.Info("Completed updating finance expenses record", "record", record)

	return nil
}

func (s *financeExpensesRecordService) Delete(id int) error {
	db := db.GetDB()

	queryString := "DELETE FROM finance_expenses_records WHERE id = $1"

	stmt, err := db.Prepare(queryString)
	if err != nil {
		slog.Error("Error preparing statement", "error", err)
		return err
	}

	_, err = stmt.Exec(id)
	if err != nil {
		slog.Error("Error executing statement", "error", err)
		return err
	}

	slog.Info("Completed deleting finance expenses record", "id", id)

	return nil
}

func (s *financeExpensesCategoryService) List() ([]*model.FinanceExpensesCategory, error) {
	var categories []*model.FinanceExpensesCategory

	db := db.GetDB()

	queryString := "SELECT id, name, remarks, created_at, updated_at FROM finance_expenses_category"

	stmt, err := db.Prepare(queryString)
	if err != nil {
		slog.Error("Error preparing statement", "error", err)
		return nil, err
	}

	rows, err := stmt.Query()
	if err != nil {
		slog.Error("Error querying statement", "error", err)
		return nil, err
	}

	for rows.Next() {
		category := new(model.FinanceExpensesCategory)
		err := rows.Scan(
			&category.ID,
			&category.Name,
			&category.Remarks,
			&category.CreatedAt,
			&category.UpdatedAt,
		)
		if err != nil {
			slog.Error("Error scanning rows", "error", err)
			return nil, err
		}
		categories = append(categories, category)
	}

	slog.Info("Completed querying finance expenses categories", "categories", len(categories))

	return categories, nil
}

func (s *financeExpensesCategoryService) Get(id int) (*model.FinanceExpensesCategory, error) {
	category := new(model.FinanceExpensesCategory)

	db := db.GetDB()

	queryString := "SELECT id, name, remarks, created_at, updated_at FROM finance_expenses_category WHERE id = $1"

	stmt, err := db.Prepare(queryString)
	if err != nil {
		slog.Error("Error preparing statement", "error", err)
		return nil, err
	}

	err = stmt.QueryRow(id).Scan(
		&category.ID,
		&category.Name,
		&category.Remarks,
		&category.CreatedAt,
		&category.UpdatedAt,
	)

	if err != nil {
		slog.Error("Error scanning rows", "error", err)
		return nil, err
	}

	slog.Info("Completed querying finance expenses category", "category", category)

	return category, nil
}

func (s *financeExpensesCategoryService) Create(category *model.FinanceExpensesCategory) error {
	db := db.GetDB()

	queryString := "INSERT INTO finance_expenses_category (name, remarks, created_at, updated_at) " +
		"VALUES ($1, $2, CURRENT_DATE, CURRENT_DATE)"

	stmt, err := db.Prepare(queryString)
	if err != nil {
		slog.Error("Error preparing statement", "error", err)
		return err
	}

	_, err = stmt.Exec(
		category.Name,
		category.Remarks,
	)
	if err != nil {
		slog.Error("Error executing statement", "error", err)
		return err
	}

	slog.Info("Completed creating finance expenses category", "category", category)

	return nil
}

func (s *financeExpensesCategoryService) Update(category *model.FinanceExpensesCategory) error {
	db := db.GetDB()

	queryString := "UPDATE finance_expenses_category SET name = $1, remarks = $2, updated_at = CURRENT_DATE " +
		"WHERE id = $3"

	stmt, err := db.Prepare(queryString)
	if err != nil {
		slog.Error("Error preparing statement", "error", err)
		return err
	}

	_, err = stmt.Exec(
		category.Name,
		category.Remarks,
		category.ID,
	)
	if err != nil {
		slog.Error("Error executing statement", "error", err)
		return err
	}

	slog.Info("Completed updating finance expenses category", "category", category)

	return nil
}

func (s *financeExpensesCategoryService) Delete(id int) error {
	db := db.GetDB()

	queryString := "DELETE FROM finance_expenses_category WHERE id = $1"

	stmt, err := db.Prepare(queryString)
	if err != nil {
		slog.Error("Error preparing statement", "error", err)
		return err
	}

	_, err = stmt.Exec(id)
	if err != nil {
		slog.Error("Error executing statement", "error", err)
		return err
	}

	slog.Info("Completed deleting finance expenses category", "id", id)

	return nil
}
