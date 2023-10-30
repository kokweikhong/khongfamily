package utils

import (
	"cmp"
	"math"
	"slices"
	"time"

	"github.com/kokweikhong/khongfamily-broker/internal/model"
)

type FinanceUtils interface {
	GetFinanceExpensesSummary(data []*model.FinanceExpensesRecord) (*financeExpensesSummary, error)
}

type financeUtils struct{}

func NewFinanceUtils() FinanceUtils {
	return &financeUtils{}
}

type financeExpensesSummary struct {
	FinanceExpenses         []*financeExpenses         `json:"financeExpenses"`
	FinanceExpensesCategory []*financeCategoryExpenses `json:"financeExpensesCategory"`
}

type financeExpenses struct {
	Date                  string  `json:"date"`
	TotalExpenses         float64 `json:"totalExpenses"`
	TotalFixedExpenses    float64 `json:"totalFixedExpenses"`
	TotalNonFixedExpenses float64 `json:"totalNonFixedExpenses"`
}

type financeCategoryExpenses struct {
	Name  string  `json:"name"`
	Value float64 `json:"value"`
}

func (*financeUtils) GetFinanceExpensesSummary(data []*model.FinanceExpensesRecord) (*financeExpensesSummary, error) {
	var (
		summary = new(financeExpensesSummary)
	)

	for _, record := range data {
		// convert date to mm-yyyy
		date, err := time.Parse("2006-01-02T00:00:00Z", record.Date)
		if err != nil {
			return nil, err
		}
		monthYear := date.Format("January-2006")
		slices.SortFunc(summary.FinanceExpenses, func(a, b *financeExpenses) int {
			return cmp.Compare(a.Date, b.Date)
		})
		summaryIdx, isSummaryFound := slices.BinarySearchFunc(summary.FinanceExpenses, monthYear, func(a *financeExpenses, b string) int {
			return cmp.Compare(a.Date, b)
		})

		if !isSummaryFound {
			summary.FinanceExpenses = append(summary.FinanceExpenses, &financeExpenses{
				Date:                  monthYear,
				TotalExpenses:         record.Amount,
				TotalFixedExpenses:    0,
				TotalNonFixedExpenses: 0,
			})
			summaryIdx = len(summary.FinanceExpenses) - 1
		} else {
			summary.FinanceExpenses[summaryIdx].TotalExpenses += record.Amount
		}

		if record.IsFixedExpenses {
			summary.FinanceExpenses[summaryIdx].TotalFixedExpenses += record.Amount
		} else {
			summary.FinanceExpenses[summaryIdx].TotalNonFixedExpenses += record.Amount
		}

		slices.SortFunc(summary.FinanceExpensesCategory, func(a, b *financeCategoryExpenses) int {
			return cmp.Compare(a.Name, b.Name)
		})
		categoryIdx, isCategoryFound := slices.BinarySearchFunc(summary.FinanceExpensesCategory, record.Category, func(a *financeCategoryExpenses, b string) int {
			return cmp.Compare(a.Name, b)
		})

		if !isCategoryFound {
			summary.FinanceExpensesCategory = append(summary.FinanceExpensesCategory, &financeCategoryExpenses{
				Name:  record.Category,
				Value: record.Amount,
			})
		} else {
			summary.FinanceExpensesCategory[categoryIdx].Value += record.Amount
		}
	}

    for _, record := range summary.FinanceExpenses {
        record.TotalExpenses = math.Round(record.TotalExpenses * 100) / 100
        record.TotalFixedExpenses = math.Round(record.TotalFixedExpenses * 100) / 100
        record.TotalNonFixedExpenses = math.Round(record.TotalNonFixedExpenses * 100) / 100
    }

    for _, record := range summary.FinanceExpensesCategory {
        record.Value = math.Round(record.Value * 100) / 100
    }

	slices.SortFunc(summary.FinanceExpenses, func(a, b *financeExpenses) int {
        // convert to date
        aDate, _ := time.Parse("January-2006", a.Date)
        bDate, _ := time.Parse("January-2006", b.Date)
		return cmp.Compare(aDate.Unix(), bDate.Unix())
	})
	return summary, nil
}

// func (*financeUtils) GetFinanceExpensesSummary(data []*model.FinanceExpensesRecord) (*financeExpensesSummary, error) {
// 	var (
// 		summary        = new(financeExpensesSummary)
// 		dates          []string
// 		categoryRecord = make(map[string]float64)
// 	)
// 	// convert date to mm-yyyy
// 	for _, record := range data {
// 		// record.Date is in yyyy-mm-ddT00:00:00Z format
// 		// convert to mm-yyyy
// 		date, err := time.Parse("2006-01-02T00:00:00Z", record.Date)
// 		if err != nil {
// 			return nil, err
// 		}
// 		month := date.Month().String()
// 		year := date.Year()
// 		monthYear := fmt.Sprintf("%s-%d", month, year)
// 		dates = append(dates, monthYear)

// 	}

// 	// remove duplicate dates
// 	dates = slices.Compact(dates)
// 	// sort dates
// 	sort.Slice(dates, func(i, j int) bool {
// 		// convert date to time.Time
// 		iDate, _ := time.Parse("January-2006", dates[i])
// 		jDate, _ := time.Parse("January-2006", dates[j])
// 		return iDate.Before(jDate)
// 	})

// 	summary.Records = data

// 	summary.ExpensesRecord.Dates = dates
// 	summary.ExpensesRecord.Total = make([]float64, len(dates))
// 	summary.FixedExpensesRecord.Dates = dates
// 	summary.FixedExpensesRecord.FixedExpenses = make([]float64, len(dates))
// 	summary.FixedExpensesRecord.NonFixedExpenses = make([]float64, len(dates))

// 	for _, record := range data {
// 		date, err := time.Parse("2006-01-02T00:00:00Z", record.Date)
// 		if err != nil {
// 			return nil, err
// 		}
// 		month := date.Month().String()
// 		year := date.Year()
// 		monthYear := fmt.Sprintf("%s-%d", month, year)

// 		for i, d := range dates {
// 			if d == monthYear {
// 				summary.ExpensesRecord.Total[i] += record.Amount
// 				if record.IsFixedExpenses {
// 					summary.FixedExpensesRecord.FixedExpenses[i] += record.Amount
// 				} else {
// 					summary.FixedExpensesRecord.NonFixedExpenses[i] += record.Amount
// 				}
// 			}
// 		}

// 		if _, ok := categoryRecord[record.Category]; ok {
// 			categoryRecord[record.Category] += record.Amount
// 		} else {
// 			categoryRecord[record.Category] = record.Amount
// 		}
// 	}

// 	for category, amount := range categoryRecord {
// 		summary.ExpensesCategory.Categories = append(summary.ExpensesCategory.Categories, category)
// 		summary.ExpensesCategory.Total = append(summary.ExpensesCategory.Total, amount)
// 	}

// 	return summary, nil
// }
