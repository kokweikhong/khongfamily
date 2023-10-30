package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/kokweikhong/khongfamily-broker/internal/middleware"
	"github.com/kokweikhong/khongfamily-broker/internal/model"
	"github.com/kokweikhong/khongfamily-broker/internal/service"
)

type UserHandler interface {
	ListUsers(w http.ResponseWriter, r *http.Request)
	GetUser(w http.ResponseWriter, r *http.Request)
	CreateUser(w http.ResponseWriter, r *http.Request)
	UpdateUser(w http.ResponseWriter, r *http.Request)
	DeleteUser(w http.ResponseWriter, r *http.Request)
	UpdatePassword(w http.ResponseWriter, r *http.Request)
	SignIn(w http.ResponseWriter, r *http.Request)
}

type userHandler struct{}

func NewUserHandler() UserHandler {
	return &userHandler{}
}

func (h *userHandler) ListUsers(w http.ResponseWriter, r *http.Request) {
	srv := service.NewUserService()

	users, err := srv.List()
	if err != nil {
		http.Error(w, "Error listing users", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	if err := json.NewEncoder(w).Encode(users); err != nil {
		http.Error(w, "Error encoding users", http.StatusInternalServerError)
		return
	}
}

func (h *userHandler) GetUser(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	if idStr == "" {
		http.Error(w, "Missing id parameter", http.StatusBadRequest)
		return
	}

	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "Invalid id parameter", http.StatusBadRequest)
		return
	}

	srv := service.NewUserService()

	user, err := srv.Get(id)
	if err != nil {
		http.Error(w, "Error getting user", http.StatusInternalServerError)
		return
	}

	if err := json.NewEncoder(w).Encode(user); err != nil {
		http.Error(w, "Error encoding user", http.StatusInternalServerError)
		return
	}
}

func (h *userHandler) CreateUser(w http.ResponseWriter, r *http.Request) {
	user := new(model.User)

	if err := json.NewDecoder(r.Body).Decode(user); err != nil {
		http.Error(w, "Error decoding user", http.StatusInternalServerError)
		return
	}

	srv := service.NewUserService()

	if err := srv.Create(user); err != nil {
		http.Error(w, "Error creating user", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	if err := json.NewEncoder(w).Encode(user); err != nil {
		http.Error(w, "Error encoding user", http.StatusInternalServerError)
		return
	}
}

func (h *userHandler) UpdateUser(w http.ResponseWriter, r *http.Request) {
	user := new(model.User)

	if err := json.NewDecoder(r.Body).Decode(user); err != nil {
		http.Error(w, "Error decoding user", http.StatusInternalServerError)
		return
	}

	srv := service.NewUserService()

	if err := srv.Update(user); err != nil {
		http.Error(w, "Error updating user", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	if err := json.NewEncoder(w).Encode(user); err != nil {
		http.Error(w, "Error encoding user", http.StatusInternalServerError)
		return
	}
}

func (h *userHandler) DeleteUser(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	if idStr == "" {
		http.Error(w, "Missing id parameter", http.StatusBadRequest)
		return
	}

	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "Invalid id parameter", http.StatusBadRequest)
		return
	}

	srv := service.NewUserService()

	if err := srv.Delete(id); err != nil {
		http.Error(w, "Error deleting user", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func (h *userHandler) UpdatePassword(w http.ResponseWriter, r *http.Request) {
	type password struct {
		Password string `json:"password"`
	}

	// get password from request body
	p := new(password)
	if err := json.NewDecoder(r.Body).Decode(p); err != nil {
		http.Error(w, "Error decoding password", http.StatusInternalServerError)
		return
	}

	// get user id from request url
	idStr := chi.URLParam(r, "id")
	if idStr == "" {
		http.Error(w, "Missing id parameter", http.StatusBadRequest)
		return
	}

	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "Invalid id parameter", http.StatusBadRequest)
		return
	}

	srv := service.NewUserService()

	if err := srv.UpdatePassword(id, p.Password); err != nil {
		http.Error(w, "Error updating password", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func (h *userHandler) SignIn(w http.ResponseWriter, r *http.Request) {
	type signin struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	// get signin details from request body
	s := new(signin)
	if err := json.NewDecoder(r.Body).Decode(s); err != nil {
		http.Error(w, "Error decoding signin details", http.StatusInternalServerError)
		return
	}

	srv := service.NewUserService()

	user, err := srv.SignIn(s.Email, s.Password)
	if err != nil {
		http.Error(w, "Error signing in", http.StatusInternalServerError)
		return
	}

	authUser := new(model.AuthUser)
	authUser.User = *user
	accessToken, accessTokenPayload, err := middleware.GenerateJWTToken(authUser.Username, time.Minute*15)
	if err != nil {
		http.Error(w, "Error generating access token", http.StatusInternalServerError)
		return
	}

	refreshToken, refreshTokenPayload, err := middleware.GenerateJWTToken(authUser.Username, time.Hour*24*7)
	if err != nil {
		http.Error(w, "Error generating refresh token", http.StatusInternalServerError)
		return
	}

	authUser.AccessToken = accessToken
	authUser.AccessTokenExpiry = accessTokenPayload.Expiry
	authUser.RefreshToken = refreshToken
	authUser.RefreshTokenExpiry = refreshTokenPayload.Expiry

	if err := json.NewEncoder(w).Encode(authUser); err != nil {
		http.Error(w, "Error encoding user", http.StatusInternalServerError)
		return
	}
}
