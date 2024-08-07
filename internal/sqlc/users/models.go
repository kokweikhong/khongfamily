// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.26.0

package users

import (
	"database/sql/driver"
	"fmt"

	"github.com/jackc/pgx/v5/pgtype"
)

type UserRole string

const (
	UserRoleUser  UserRole = "user"
	UserRoleAdmin UserRole = "admin"
)

func (e *UserRole) Scan(src interface{}) error {
	switch s := src.(type) {
	case []byte:
		*e = UserRole(s)
	case string:
		*e = UserRole(s)
	default:
		return fmt.Errorf("unsupported scan type for UserRole: %T", src)
	}
	return nil
}

type NullUserRole struct {
	UserRole UserRole
	Valid    bool // Valid is true if UserRole is not NULL
}

// Scan implements the Scanner interface.
func (ns *NullUserRole) Scan(value interface{}) error {
	if value == nil {
		ns.UserRole, ns.Valid = "", false
		return nil
	}
	ns.Valid = true
	return ns.UserRole.Scan(value)
}

// Value implements the driver Valuer interface.
func (ns NullUserRole) Value() (driver.Value, error) {
	if !ns.Valid {
		return nil, nil
	}
	return string(ns.UserRole), nil
}

type Expense struct {
	ID                int32
	ExpenseCategoryID int32
	AmountCents       int32
	Description       string
	Date              pgtype.Date
	Remarks           string
}

type ExpenseCategory struct {
	ID          int32
	Name        string
	Description string
}

type User struct {
	ID        int32
	Name      string
	Email     string
	Password  string
	Role      UserRole
	CreatedAt pgtype.Timestamp
	UpdatedAt pgtype.Timestamp
}
