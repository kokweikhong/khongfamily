package model

type Token struct {
	AccessToken        string `json:"accessToken"`
	AccessTokenExpiry  int64  `json:"accessTokenExpiry"`
	RefreshToken       string `json:"refreshToken"`
	RefreshTokenExpiry int64  `json:"refreshTokenExpiry"`
}

type AuthUser struct {
	User
	Token
}
