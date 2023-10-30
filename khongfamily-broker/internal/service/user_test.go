package service_test

import (
	"testing"

	"github.com/kokweikhong/khongfamily-broker/internal/config"
	"github.com/kokweikhong/khongfamily-broker/internal/db"
	"github.com/kokweikhong/khongfamily-broker/internal/model"
	"github.com/kokweikhong/khongfamily-broker/internal/service"
)

func TestCreateUser(t *testing.T) {
	t.Run("should create user", func(t *testing.T) {
		// Given

		if err := config.Init(); err != nil {
			t.Errorf("error initializing config: %v", err)
		}

		if err := db.Init(); err != nil {
			t.Errorf("error initializing db: %v", err)
		}

		defer db.Close()

		user := &model.User{
			Username:  "cheela",
			Password:  "kwei4188",
			FirstName: "Chee Lai",
			LastName:  "Kiang",
			Email:     "cheelaikia@gmail.com",
			Role:      "admin",
		}

		svc := service.NewUserService()

		if err := svc.Create(user); err != nil {
			t.Errorf("error creating user: %v", err)
		}
	})
}

func TestListUsers(t *testing.T) {
	t.Run("should list users", func(t *testing.T) {
		// Given

		if err := config.Init(); err != nil {
			t.Errorf("error initializing config: %v", err)
		}

		if err := db.Init(); err != nil {
			t.Errorf("error initializing db: %v", err)
		}

		defer db.Close()

		svc := service.NewUserService()

		users, err := svc.List()
		if err != nil {
			t.Errorf("error listing users: %v", err)
		}

		if users == nil {
			t.Errorf("users is nil")
		}

		t.Logf("users: %v", users)
	})
}

func TestGetUser(t *testing.T) {
	t.Run("should get user", func(t *testing.T) {
		// Given

		if err := config.Init(); err != nil {
			t.Errorf("error initializing config: %v", err)
		}

		if err := db.Init(); err != nil {
			t.Errorf("error initializing db: %v", err)
		}

		defer db.Close()

		svc := service.NewUserService()

		user, err := svc.Get(1)
		if err != nil {
			t.Errorf("error getting user: %v", err)
		}

		if user == nil {
			t.Errorf("user is nil")
		}
	})
}

func TestUpdateUser(t *testing.T) {
	t.Run("should update user", func(t *testing.T) {
		// Given

		if err := config.Init(); err != nil {
			t.Errorf("error initializing config: %v", err)
		}

		if err := db.Init(); err != nil {
			t.Errorf("error initializing db: %v", err)
		}

		defer db.Close()

		svc := service.NewUserService()

		user, err := svc.Get(1)
		if err != nil {
			t.Errorf("error getting user: %v", err)
		}

		user.IsVerified = true

		if err := svc.Update(user); err != nil {
			t.Errorf("error updating user: %v", err)
		}
	})
}

func TestSignin(t *testing.T) {
	t.Run("should signin user", func(t *testing.T) {
		// Given

		if err := config.Init(); err != nil {
			t.Errorf("error initializing config: %v", err)
		}

		if err := db.Init(); err != nil {
			t.Errorf("error initializing db: %v", err)
		}

		defer db.Close()

		svc := service.NewUserService()

		user, err := svc.SignIn("kokweikhong@gmail.com", "kwei4188")
		if err != nil {
			t.Errorf("error getting user: %v", err)
		}

		if user == nil {
			t.Errorf("user is nil")
		}

		t.Logf("user: %v", user)
	})
}

func TestDeleteUser(t *testing.T) {
	t.Run("should delete user", func(t *testing.T) {
		// Given

		if err := config.Init(); err != nil {
			t.Errorf("error initializing config: %v", err)
		}

		if err := db.Init(); err != nil {
			t.Errorf("error initializing db: %v", err)
		}

		defer db.Close()

		svc := service.NewUserService()

		if err := svc.Delete(13); err != nil {
			t.Errorf("error deleting user: %v", err)
		}
	})
}
