package web

import "embed"

//go:embed views/*
var Views embed.FS

//go:embed static/*
var Static embed.FS

func GetViews() embed.FS {
	return Views
}

func GetStatic() embed.FS {
	return Static
}
