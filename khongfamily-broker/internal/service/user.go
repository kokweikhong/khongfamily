package service

import (
	"log/slog"

	"github.com/kokweikhong/khongfamily-broker/internal/db"
	"github.com/kokweikhong/khongfamily-broker/internal/model"
	"golang.org/x/crypto/bcrypt"
)

type UserService interface {
	List() ([]*model.User, error)
	Get(id int) (*model.User, error)
	Create(user *model.User) error
	Update(user *model.User) error
	Delete(id int) error
	UpdatePassword(id int, password string) error
	SignIn(username, password string) (*model.User, error)
}

type userService struct {
}

func NewUserService() UserService {
	return &userService{}
}

func (s *userService) List() ([]*model.User, error) {
	var users []*model.User

	db := db.GetDB()

	queryString := "SELECT id, username, password, first_name, " +
		"last_name, email, role, profile_image, is_verified, created_at, updated_at " +
		"FROM users"

	stmt, err := db.Prepare(queryString)
	if err != nil {
		slog.Error("Error preparing list users", "error", err)
		return nil, err
	}

	rows, err := stmt.Query()
	if err != nil {
		slog.Error("Error querying list users", "error", err)
		return nil, err
	}

	for rows.Next() {
		user := new(model.User)
		err := rows.Scan(
			&user.ID,
			&user.Username,
			&user.Password,
			&user.FirstName,
			&user.LastName,
			&user.Email,
			&user.Role,
			&user.ProfileImage,
			&user.IsVerified,
			&user.CreatedAt,
			&user.UpdatedAt,
		)
		if err != nil {
			slog.Error("Error scanning list users", "error", err)
			return nil, err
		}
		users = append(users, user)
	}

	slog.Info("Users found", "users", len(users))

	return users, nil
}

func (s *userService) Get(id int) (*model.User, error) {
	db := db.GetDB()

	queryString := "SELECT id, username, password, first_name, " +
		"last_name, email, role, profile_image, is_verified, created_at, updated_at " +
		"FROM users WHERE id = $1"

	stmt, err := db.Prepare(queryString)
	if err != nil {
		slog.Error("Error preparing get user", "error", err)
		return nil, err
	}

	user := new(model.User)
	err = stmt.QueryRow(id).Scan(
		&user.ID,
		&user.Username,
		&user.Password,
		&user.FirstName,
		&user.LastName,
		&user.Email,
		&user.Role,
		&user.ProfileImage,
		&user.IsVerified,
		&user.CreatedAt,
		&user.UpdatedAt,
	)
	if err != nil {
		slog.Error("Error getting user", "error", err)
		return nil, err
	}

	slog.Info("User found", "user", user)

	return user, nil
}

func (s *userService) Create(user *model.User) error {
	db := db.GetDB()

	queryString := "INSERT INTO users (username, password, first_name, " +
		"last_name, email, role, profile_image, is_verified, created_at, updated_at) " +
		"VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_DATE, CURRENT_DATE)"

	stmt, err := db.Prepare(queryString)
	if err != nil {
		slog.Error("Error preparing create user", "error", err)
		return err
	}

	// hash password
	user.Password, err = s.hashPassword(user.Password)
	if err != nil {
		slog.Error("Error hashing password when creating user", "error", err)
		return err
	}

	_, err = stmt.Exec(
		user.Username,
		user.Password,
		user.FirstName,
		user.LastName,
		user.Email,
		user.Role,
		user.ProfileImage,
		user.IsVerified,
	)
	if err != nil {
		slog.Error("Error creating user", "error", err)
		return err
	}

	slog.Info("User created", "user", user)

	return nil
}

func (s *userService) Update(user *model.User) error {
	db := db.GetDB()

	// queryString exclude password
	queryString := "UPDATE users SET username = $1, first_name = $2, " +
		"last_name = $3, email = $4, role = $5, profile_image = $6, " +
		"is_verified = $7, updated_at = CURRENT_DATE WHERE id = $8"

	stmt, err := db.Prepare(queryString)
	if err != nil {
		slog.Error("Error preparing update user", "error", err)
		return err
	}

	_, err = stmt.Exec(
		user.Username,
		user.FirstName,
		user.LastName,
		user.Email,
		user.Role,
		user.ProfileImage,
		user.IsVerified,
		user.ID,
	)
	if err != nil {
		slog.Error("Error updating user", "error", err)
		return err
	}

	slog.Info("User updated", "user", user)

	return nil
}

func (s *userService) Delete(id int) error {
	db := db.GetDB()

	queryString := "DELETE FROM users WHERE id = $1"

	stmt, err := db.Prepare(queryString)
	if err != nil {
		slog.Error("Error preparing delete user", "error", err)
		return err
	}

	_, err = stmt.Exec(id)
	if err != nil {
		slog.Error("Error deleting user", "error", err)
		return err
	}

	slog.Info("User deleted", "user_id", id)

	return nil
}

func (s *userService) UpdatePassword(id int, password string) error {
	db := db.GetDB()

	queryString := "UPDATE users SET password = $1, updated_at = CURRENT_DATE WHERE id = $2"

	stmt, err := db.Prepare(queryString)
	if err != nil {
		slog.Error("Error preparing update user password", "error", err)
		return err
	}

	// hash password
	hashedPassword, err := s.hashPassword(password)
	if err != nil {
		slog.Error("Error hashing password when updating user password", "error", err)
		return err
	}

	_, err = stmt.Exec(
		hashedPassword,
		id,
	)
	if err != nil {
		slog.Error("Error updating user password", "error", err)
		return err
	}

	slog.Info("User password updated", "user_id", id)

	return nil
}

func (s *userService) SignIn(username, password string) (*model.User, error) {
	db := db.GetDB()

	queryString := "SELECT id, username, password, first_name, " +
		"last_name, email, role, profile_image, is_verified, created_at, updated_at " +
		"FROM users WHERE username = $1 OR email = $1"

	stmt, err := db.Prepare(queryString)
	if err != nil {
		slog.Error("Error preparing get user by username or email", "error", err)
		return nil, err
	}

	user := new(model.User)
	err = stmt.QueryRow(username).Scan(
		&user.ID,
		&user.Username,
		&user.Password,
		&user.FirstName,
		&user.LastName,
		&user.Email,
		&user.Role,
		&user.ProfileImage,
		&user.IsVerified,
		&user.CreatedAt,
		&user.UpdatedAt,
	)
	if err != nil {
		slog.Error("Error getting user by username or email", "error", err)
		return nil, err
	}

	// compare password
	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))
	if err != nil {
		slog.Error("Error comparing password", "error", err)
		return nil, err
	}

	slog.Info("User signed in", "user", user)

	return user, nil
}

func (s *userService) hashPassword(password string) (string, error) {
	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}

	return string(hash), nil
}
