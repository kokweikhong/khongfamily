package users

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"regexp"

	"golang.org/x/crypto/bcrypt"
)

// User is a struct that represents a user
type User struct {
	ID       int64  `json:"id,string"`
	Username string `json:"username"`
	Password string `json:"password"`
	Email    string `json:"email"`
}

// UsersServer is a struct that represents a server
type UserServer struct {
	db *sql.DB
}

// regexp for http requests
var (
	// /users
	usersPath = regexp.MustCompile(`^/users[\/]*$`)
	// /users/{id}
	userPath = regexp.MustCompile("^/users/([0-9]+)$")
	// get user by email
	userByEmailPath = regexp.MustCompile(`^/users/email[\/]*$`)
	// create user
	userCreatePath = regexp.MustCompile("^/users/create$")
	// update user
	userUpdatePath = regexp.MustCompile("^/users/update$/([0-9]+)")
	// delete user
	userDeletePath = regexp.MustCompile("^/users/delete$/([0-9]+)")
)

// NewUserServer is a function that returns a new UserServer
func NewUserServer(db *sql.DB) *UserServer {
	return &UserServer{db}
}

// ServeHTTP is a function that handles http requests
func (u *UserServer) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	// set headers
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")

	if r.Method == "OPTIONS" {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, allow-control-allow-origin")
		w.WriteHeader(http.StatusOK)
		return
	}
	switch {
	case r.Method == "GET" && usersPath.MatchString(r.URL.Path):
		u.users(w, r)
	case r.Method == "GET" && userPath.MatchString(r.URL.Path):
		u.user(w, r)
	case r.Method == "POST" && userByEmailPath.MatchString(r.URL.Path):
		fmt.Println("HIT EMAIL")
		u.userByEmail(w, r)
	case r.Method == "POST" && userCreatePath.MatchString(r.URL.Path):
		u.userCreate(w, r)
	case r.Method == "POST" && userUpdatePath.MatchString(r.URL.Path):
		u.userUpdate(w, r)
	case r.Method == "POST" && userDeletePath.MatchString(r.URL.Path):
		u.userDelete(w, r)
	default:
		http.NotFound(w, r)
	}
}

// users is a function that handles http requests to /users
func (u *UserServer) users(w http.ResponseWriter, r *http.Request) {
	// get all users from database query
	rows, err := u.db.Query("SELECT * FROM users")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	// create slice of users
	users := make([]User, 0)
	for rows.Next() {
		user := User{}
		err := rows.Scan(&user.ID, &user.Username, &user.Password, &user.Email)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		users = append(users, user)
	}
	if err = rows.Err(); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// write users to response
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(users)
}

// user is a function that handles http requests to /users/{id}
func (u *UserServer) user(w http.ResponseWriter, r *http.Request) {
	// get id from request
	id := userPath.FindStringSubmatch(r.URL.Path)[1]

	// get user from database query
	row := u.db.QueryRow("SELECT * FROM users WHERE id=?", id)
	user := User{}
	err := row.Scan(&user.ID, &user.Username, &user.Password, &user.Email)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// write user to response
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(user)
}

// userByEmail is a function that handles http requests to /users/email
func (u *UserServer) userByEmail(w http.ResponseWriter, r *http.Request) {
	// get email from request body
	email := User{}
	fmt.Println(r.Body)
	err := json.NewDecoder(r.Body).Decode(&email)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// get user from database query
	row := u.db.QueryRow("SELECT * FROM users WHERE email=$1", email.Email)
	user := User{}
	err = row.Scan(&user.ID, &user.Username, &user.Password, &user.Email)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	fmt.Println(user.Email, user.Password)

	// write user to response
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(user)
}

// userCreate is a function that handles http requests to /users/create
func (u *UserServer) userCreate(w http.ResponseWriter, r *http.Request) {
	// get user from request
	user := User{}
	err := json.NewDecoder(r.Body).Decode(&user)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// hash password
	hashPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), 14)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// set hashed password
	user.Password = string(hashPassword)

	// insert user into database
	_, err = u.db.Exec("INSERT INTO users (username, email, password) VALUES ($1, $2, $3)", user.Username, user.Email, user.Password)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// write id to response
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(user)
}

// userUpdate is a function that handles http requests to /users/update/{id}
func (u *UserServer) userUpdate(w http.ResponseWriter, r *http.Request) {
	// get id from request
	id := userUpdatePath.FindStringSubmatch(r.URL.Path)[1]

	// get user from request
	user := User{}
	err := json.NewDecoder(r.Body).Decode(&user)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// hash password
	hashPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), 14)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// set hashed password
	user.Password = string(hashPassword)

	// update user in database
	_, err = u.db.Exec("UPDATE users SET username=?, email=?, password=? WHERE id=?", user.Username, user.Email, user.Password, id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// write id to response
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(id)
}

// userDelete is a function that handles http requests to /users/delete/{id}
func (u *UserServer) userDelete(w http.ResponseWriter, r *http.Request) {
	// get id from request
	id := userDeletePath.FindStringSubmatch(r.URL.Path)[1]

	// delete user from database
	_, err := u.db.Exec("DELETE FROM users WHERE id=?", id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// write id to response
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(id)
}
