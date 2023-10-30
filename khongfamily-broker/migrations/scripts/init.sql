DROP TABLE IF EXISTS users;
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(256) UNIQUE NOT NULL,
  password VARCHAR(256) NOT NULL,
  first_name VARCHAR(256) NOT NULL,
  last_name VARCHAR(256) NOT NULL,
  email VARCHAR(256) UNIQUE NOT NULL,
  role VARCHAR(256) NOT NULL,
  profile_image VARCHAR(256) NOT NULL DEFAULT '',
  is_verified boolean NOT NULL DEFAULT false,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT (NOW())
);

CREATE TABLE IF NOT EXISTS finance_expenses_category (
  id SERIAL PRIMARY KEY,
  name VARCHAR(256) UNIQUE NOT NULL,
  remarks VARCHAR(256) NOT NULL DEFAULT '',
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT (NOW())
);

CREATE TABLE IF NOT EXISTS finance_expenses_records (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL,
  name VARCHAR(256) NOT NULL,
  category_id INT NOT NULL,
  currency VARCHAR(256) NOT NULL,
  amount FLOAT NOT NULL,
  is_fixed_expenses boolean NOT NULL,
  remarks VARCHAR(256) NOT NULL DEFAULT '',
  is_paid boolean NOT NULL,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT (NOW()),
);

ALTER TABLE finance_expenses_records ADD FOREIGN KEY (category_id) REFERENCES finance_expenses_category (id);

CREATE INDEX finance_expenses_records_date_idx ON finance_expenses_records (date);
CREATE INDEX finance_expenses_records_name_idx ON finance_expenses_records (name);
CREATE INDEX finance_expenses_records_category_id_idx ON finance_expenses_records (category_id);
CREATE INDEX finance_expenses_records_currency_idx ON finance_expenses_records (currency);
CREATE INDEX finance_expenses_records_amount_idx ON finance_expenses_records (amount);
CREATE INDEX finance_expenses_records_is_fixed_expenses_idx ON finance_expenses_records (is_fixed_expenses);
CREATE INDEX finance_expenses_records_is_paid_idx ON finance_expenses_records (is_paid);

