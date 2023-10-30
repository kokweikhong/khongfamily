package model

type User struct {
	ID           int    `json:"id" db:"id"`
	Username     string `json:"username" db:"username"`
	Password     string `json:"password" db:"password"`
    FirstName    string `json:"firstName" db:"first_name"`
    LastName     string `json:"lastName" db:"last_name"`
	Email        string `json:"email" db:"email"`
	Role         string `json:"role" db:"role"`
	ProfileImage string `json:"profileImage" db:"profile_image"`
	IsVerified   bool   `json:"isVerified" db:"is_verified"`
	CreatedAt    string `json:"createdAt" db:"created_at"`
	UpdatedAt    string `json:"updatedAt" db:"updated_at"`
}
