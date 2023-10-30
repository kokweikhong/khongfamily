package handlers

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
	"github.com/kokweikhong/khongfamily-broker/internal/model"
	"github.com/kokweikhong/khongfamily-broker/internal/service"
	"github.com/kokweikhong/khongfamily-broker/internal/utils"
	"github.com/sagikazarmark/slog-shim"
)

type FinanceExpensesRecord interface {
	List(w http.ResponseWriter, r *http.Request)
	Get(w http.ResponseWriter, r *http.Request)
	Create(w http.ResponseWriter, r *http.Request)
	Update(w http.ResponseWriter, r *http.Request)
	Delete(w http.ResponseWriter, r *http.Request)
	GetFinanceExpensesSummary(w http.ResponseWriter, r *http.Request)
}

type FinanceExpensesCategory interface {
	List(w http.ResponseWriter, r *http.Request)
	Get(w http.ResponseWriter, r *http.Request)
	Create(w http.ResponseWriter, r *http.Request)
	Update(w http.ResponseWriter, r *http.Request)
	Delete(w http.ResponseWriter, r *http.Request)
}

type financeExpensesRecord struct {
	ResponseHandler utils.JSONHandler
}

type financeExpensesCategory struct{}

func NewFinanceExpensesRecord() FinanceExpensesRecord {
	responseHandler := utils.NewJSONHandler()
	return &financeExpensesRecord{
		ResponseHandler: responseHandler,
	}
}

func NewFinanceExpensesCategory() FinanceExpensesCategory {
	return &financeExpensesCategory{}
}

func (h *financeExpensesRecord) List(w http.ResponseWriter, r *http.Request) {
	period := r.URL.Query().Get("period")

	service := service.NewFinanceExpensesRecordService()
	records, err := service.List(period)
	if err != nil {
		slog.Error("Error listing records", "error", err)
		http.Error(w, "Error listing records", http.StatusInternalServerError)
		return
	}

	slog.Info("Records listed", "records", records)
	json.NewEncoder(w).Encode(records)
}

func (h *financeExpensesRecord) Get(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	if idStr == "" {
		http.Error(w, "Missing id", http.StatusBadRequest)
		return
	}

	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "Invalid id", http.StatusBadRequest)
		return
	}

	service := service.NewFinanceExpensesRecordService()
	record, err := service.Get(id)
	if err != nil {
		http.Error(w, "Error getting record", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(record)
}

func (h *financeExpensesRecord) Create(w http.ResponseWriter, r *http.Request) {
	body, err := io.ReadAll(r.Body)
	slog.Info("Body", "body", body)
	if err != nil {
		http.Error(w, "Error reading body", http.StatusBadRequest)
		return
	}

	record := new(model.FinanceExpensesRecord)
	if err := json.Unmarshal(body, record); err != nil {
		http.Error(w, "Error unmarshalling body", http.StatusBadRequest)
		return
	}

	service := service.NewFinanceExpensesRecordService()
	if err := service.Create(record); err != nil {
		http.Error(w, "Error creating record", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(record)
}

func (h *financeExpensesRecord) Update(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	if idStr == "" {
		http.Error(w, "Missing id", http.StatusBadRequest)
		return
	}

	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "Invalid id", http.StatusBadRequest)
		return
	}

	body, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Error reading body", http.StatusBadRequest)
		return
	}

	record := new(model.FinanceExpensesRecord)
	if err := json.Unmarshal(body, record); err != nil {
		http.Error(w, "Error unmarshalling body", http.StatusBadRequest)
		return
	}

	record.ID = id

	service := service.NewFinanceExpensesRecordService()
	if err := service.Update(record); err != nil {
		http.Error(w, "Error updating record", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(record)
}

func (h *financeExpensesRecord) Delete(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	if idStr == "" {
		http.Error(w, "Missing id", http.StatusBadRequest)
		return
	}

	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "Invalid id", http.StatusBadRequest)
		return
	}

	service := service.NewFinanceExpensesRecordService()
	if err := service.Delete(id); err != nil {
		http.Error(w, "Error deleting record", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func (h *financeExpensesRecord) GetFinanceExpensesSummary(w http.ResponseWriter, r *http.Request) {
	period := r.URL.Query().Get("period")

	service := service.NewFinanceExpensesRecordService()
	records, err := service.List(period)
	if err != nil {
		slog.Error("Error listing records", "error", err)
        h.ResponseHandler.ErrorJSON(w, fmt.Errorf("Error listing records: %w", err), http.StatusInternalServerError)
		// http.Error(w, "Error listing records", http.StatusInternalServerError)
		return
	}

	financeExpensesUtils := utils.NewFinanceUtils()

	data, err := financeExpensesUtils.GetFinanceExpensesSummary(records)
	if err != nil {
		slog.Error("Error getting finance expenses summary", "error", err)
        h.ResponseHandler.ErrorJSON(w, fmt.Errorf("Error getting finance expenses summary: %w", err), http.StatusInternalServerError)
		// http.Error(w, "Error getting finance expenses summary", http.StatusInternalServerError)
		return
	}

	slog.Info("Finance expenses summary", "data", data)

    h.ResponseHandler.WriteJSON(w, http.StatusOK, data)
}

func (h *financeExpensesCategory) List(w http.ResponseWriter, r *http.Request) {
	categories := []*model.FinanceExpensesCategory{}

	service := service.NewFinanceExpensesCategoryService()

	categories, err := service.List()
	if err != nil {
		slog.Error("Error listing categories", "error", err)
		http.Error(w, "Error listing categories", http.StatusInternalServerError)
		return
	}

	slog.Info("Categories listed", "categories", categories)
	json.NewEncoder(w).Encode(categories)
}

func (h *financeExpensesCategory) Get(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	if idStr == "" {
		http.Error(w, "Missing id", http.StatusBadRequest)
		return
	}

	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "Invalid id", http.StatusBadRequest)
		return
	}

	service := service.NewFinanceExpensesCategoryService()
	category, err := service.Get(id)
	if err != nil {
		http.Error(w, "Error getting category", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(category)
}

func (h *financeExpensesCategory) Create(w http.ResponseWriter, r *http.Request) {
	body, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Error reading body", http.StatusBadRequest)
		return
	}

	category := new(model.FinanceExpensesCategory)
	if err := json.Unmarshal(body, category); err != nil {
		http.Error(w, "Error unmarshalling body", http.StatusBadRequest)
		return
	}

	service := service.NewFinanceExpensesCategoryService()
	if err := service.Create(category); err != nil {
		http.Error(w, "Error creating category", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(category)
}

func (h *financeExpensesCategory) Update(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	if idStr == "" {
		http.Error(w, "Missing id", http.StatusBadRequest)
		return
	}

	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "Invalid id", http.StatusBadRequest)
		return
	}

	body, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Error reading body", http.StatusBadRequest)
		return
	}

	category := new(model.FinanceExpensesCategory)
	if err := json.Unmarshal(body, category); err != nil {
		http.Error(w, "Error unmarshalling body", http.StatusBadRequest)
		return
	}

	category.ID = id

	service := service.NewFinanceExpensesCategoryService()
	if err := service.Update(category); err != nil {
		http.Error(w, "Error updating category", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(category)
}

func (h *financeExpensesCategory) Delete(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	if idStr == "" {
		http.Error(w, "Missing id", http.StatusBadRequest)
		return
	}

	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "Invalid id", http.StatusBadRequest)
		return
	}

	service := service.NewFinanceExpensesCategoryService()
	if err := service.Delete(id); err != nil {
		http.Error(w, "Error deleting category", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
