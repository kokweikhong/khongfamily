// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.26.0
// source: users.query.sql

package users

import (
	"context"
)

const createUser = `-- name: CreateUser :one
INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id
`

type CreateUserParams struct {
	Name     string
	Email    string
	Password string
	Role     UserRole
}

func (q *Queries) CreateUser(ctx context.Context, arg CreateUserParams) (int32, error) {
	row := q.db.QueryRow(ctx, createUser,
		arg.Name,
		arg.Email,
		arg.Password,
		arg.Role,
	)
	var id int32
	err := row.Scan(&id)
	return id, err
}

const deleteUser = `-- name: DeleteUser :exec
DELETE FROM users WHERE id = $1
`

func (q *Queries) DeleteUser(ctx context.Context, id int32) error {
	_, err := q.db.Exec(ctx, deleteUser, id)
	return err
}

const getUserByEmail = `-- name: GetUserByEmail :one
SELECT id, name, email, password, role, created_at, updated_at FROM users WHERE email = $1
`

func (q *Queries) GetUserByEmail(ctx context.Context, email string) (User, error) {
	row := q.db.QueryRow(ctx, getUserByEmail, email)
	var i User
	err := row.Scan(
		&i.ID,
		&i.Name,
		&i.Email,
		&i.Password,
		&i.Role,
		&i.CreatedAt,
		&i.UpdatedAt,
	)
	return i, err
}

const getUserById = `-- name: GetUserById :one
SELECT id, name, email, password, role, created_at, updated_at FROM users WHERE id = $1
`

func (q *Queries) GetUserById(ctx context.Context, id int32) (User, error) {
	row := q.db.QueryRow(ctx, getUserById, id)
	var i User
	err := row.Scan(
		&i.ID,
		&i.Name,
		&i.Email,
		&i.Password,
		&i.Role,
		&i.CreatedAt,
		&i.UpdatedAt,
	)
	return i, err
}

const getUsers = `-- name: GetUsers :many
SELECT id, name, email, password, role, created_at, updated_at FROM users
`

func (q *Queries) GetUsers(ctx context.Context) ([]User, error) {
	rows, err := q.db.Query(ctx, getUsers)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []User
	for rows.Next() {
		var i User
		if err := rows.Scan(
			&i.ID,
			&i.Name,
			&i.Email,
			&i.Password,
			&i.Role,
			&i.CreatedAt,
			&i.UpdatedAt,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const updateUser = `-- name: UpdateUser :exec
UPDATE users SET name = $1, email = $2, role = $3 WHERE id = $4
`

type UpdateUserParams struct {
	Name  string
	Email string
	Role  UserRole
	ID    int32
}

func (q *Queries) UpdateUser(ctx context.Context, arg UpdateUserParams) error {
	_, err := q.db.Exec(ctx, updateUser,
		arg.Name,
		arg.Email,
		arg.Role,
		arg.ID,
	)
	return err
}

const updateUserPassword = `-- name: UpdateUserPassword :exec
UPDATE users SET password = $1 WHERE id = $2
`

type UpdateUserPasswordParams struct {
	Password string
	ID       int32
}

func (q *Queries) UpdateUserPassword(ctx context.Context, arg UpdateUserPasswordParams) error {
	_, err := q.db.Exec(ctx, updateUserPassword, arg.Password, arg.ID)
	return err
}
