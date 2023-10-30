package middleware

import (
	"encoding/json"
	"fmt"
	"log/slog"
	"net/http"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/kokweikhong/khongfamily-broker/internal/config"
)

type JWTCustomClaims struct {
	username string
	jwt.RegisteredClaims
}

type JWTPayload struct {
	Username string `json:"username"`
	Issuer   string `json:"iss"`
	Expiry   int64  `json:"exp"`
}

var jwtSecret = config.Cfg.JwtSecret

func AuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// get token from header Authorization Bearer
		tokenString := r.Header.Get("Authorization")

		// split token string bearer and token
		bearerSplit := strings.Split(tokenString, "Bearer ")
		slog.Info("Bearer split", "bearerSplit", bearerSplit)

		if len(bearerSplit) != 2 {
			slog.Error("Invalid token")
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		tokenString = bearerSplit[1]

		// validate token
		isValid, err := ValidateJWTToken(tokenString)
		if err != nil || !isValid {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func ValidateJWTToken(tokenString string) (bool, error) {
	slog.Info("Validating token", "token", tokenString)
	token, err := jwt.ParseWithClaims(tokenString, &JWTCustomClaims{}, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			slog.Error("Unexpected signing method", "method", token.Header["alg"])
			return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(jwtSecret), nil
	})

	if err != nil {
		slog.Error("Error parsing token", "error", err)
		return false, err
	}

	if _, ok := token.Claims.(*JWTCustomClaims); !ok && !token.Valid {
		slog.Error("Invalid token")
		return false, err
	}

	return true, nil
}

func GenerateJWTToken(username string, duration time.Duration) (string, *JWTPayload, error) {
	claims := JWTCustomClaims{
		username,
		jwt.RegisteredClaims{
			ExpiresAt: &jwt.NumericDate{
				Time: time.Now().Add(duration),
			},
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	tokenString, err := token.SignedString([]byte(jwtSecret))
	if err != nil {
		slog.Error("Error signing token", "error", err)
		return "", nil, err
	}

	payload, err := json.Marshal(token.Claims)
	if err != nil {
		slog.Error("Error marshalling token claims", "error", err)
		return "", nil, err
	}
	jwtPayload := new(JWTPayload)
	if err := json.Unmarshal(payload, jwtPayload); err != nil {
		slog.Error("Error unmarshalling token claims", "error", err)
		return "", nil, err
	}

	return tokenString, jwtPayload, nil
}
