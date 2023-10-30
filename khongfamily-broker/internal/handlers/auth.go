package handlers

import (
	"encoding/json"
	"log/slog"
	"net/http"
	"time"

	"github.com/kokweikhong/khongfamily-broker/internal/middleware"
	"github.com/kokweikhong/khongfamily-broker/internal/model"
)

type AuthHandler interface {
	RefreshToken(w http.ResponseWriter, r *http.Request)
}

type authHandler struct{}

func NewAuthHandler() AuthHandler {
	return &authHandler{}
}

func (h *authHandler) RefreshToken(w http.ResponseWriter, r *http.Request) {
	authUser := new(model.AuthUser)
	if err := json.NewDecoder(r.Body).Decode(authUser); err != nil {
		slog.Error("Error decoding request body", "error", err)
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if authUser.RefreshToken == "" {
		slog.Error("Missing refresh token")
		http.Error(w, "Missing refresh token", http.StatusBadRequest)
		return
	}

	isValid, err := middleware.ValidateJWTToken(authUser.RefreshToken)
	if err != nil || !isValid {
		slog.Error("Error validating token", "error", err)
		http.Error(w, "Error validating token", http.StatusInternalServerError)
		return
	}

	// generate new access token
	accessToken, accessTokenPayload, err := middleware.GenerateJWTToken(authUser.Username, time.Second*15)
	if err != nil {
		slog.Error("Error to generate JWT token", "error", err)
		http.Error(w, "Error generating access token", http.StatusInternalServerError)
		return
	}

	authUser.AccessToken = accessToken
	authUser.AccessTokenExpiry = accessTokenPayload.Expiry

	slog.Info("Successfully refreshed token", "username", authUser.Username)

	w.WriteHeader(http.StatusOK)
	if err := json.NewEncoder(w).Encode(authUser); err != nil {
		slog.Error("Error encoding response", "error", err)
		http.Error(w, "Error encoding response", http.StatusInternalServerError)
		return
	}
}
