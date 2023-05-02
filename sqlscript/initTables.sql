CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  password VARCHAR(50) NOT NULL,
  email VARCHAR(256) NOT NULL
);

CREATE TABLE IF NOT EXISTS finance_category (
  id SERIAL PRIMARY KEY,
  name VARCHAR(256) NOT NULL,
  remarks VARCHAR(256),
  created_at TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS finance_records (
  id SERIAL PRIMARY KEY,
  date DATE not null,
  name VARCHAR(256) NOT NULL,
  category_id INT NOT NULL,
  currency VARCHAR(256) NOT NULL,
  amount FLOAT NOT NULL,
  is_fixed_expense boolean not null,
  remarks VARCHAR(256),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES finance_category (id)
);

