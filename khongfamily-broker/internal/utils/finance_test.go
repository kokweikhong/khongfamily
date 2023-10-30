package utils_test

import (
	"testing"

	"github.com/kokweikhong/khongfamily-broker/internal/config"
	"github.com/kokweikhong/khongfamily-broker/internal/db"
	"github.com/kokweikhong/khongfamily-broker/internal/service"
	"github.com/kokweikhong/khongfamily-broker/internal/utils"
)

func TestGetCompileFinanceExpensesRecords(t *testing.T) {
	t.Parallel()
	if err := config.Init(); err != nil {
		t.Fatal(err)
	}
	if err := db.Init(); err != nil {
		t.Fatal(err)
	}

	service := service.NewFinanceExpensesRecordService()
	records, err := service.List("1y")
	if err != nil {
		t.Fatal(err)
	}

	financeUtils := utils.NewFinanceUtils()

	compileRecords, err := financeUtils.GetFinanceExpensesSummary(records)
	if err != nil {
		t.Fatal(err)
	}

	t.Logf("%+v", compileRecords)
}
