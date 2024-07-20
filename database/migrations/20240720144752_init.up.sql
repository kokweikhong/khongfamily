CREATE TABLE IF NOT EXISTS "users" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "role" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "expense_categories" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL UNIQUE,
    "description" TEXT NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS "expenses" (
    "id" SERIAL PRIMARY KEY,
    "expense_category_id" INTEGER NOT NULL,
    "amount_cents" INTEGER NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "date" DATE NOT NULL,
    "remarks" TEXT NOT NULL DEFAULT ''
);

ALTER TABLE "expenses" ADD CONSTRAINT "fk_expense_category_id" FOREIGN KEY ("expense_category_id") REFERENCES "expense_categories" ("id");
CREATE INDEX "idx_expense_category_id" ON "expenses" ("expense_category_id");



