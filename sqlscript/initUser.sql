CREATE DATABASE IF NOT EXISTS khongfamily;
CREATE USER IF NOT EXISTS khongfamily_user WITH PASSWORD 'khongfamily_password';
GRANT ALL PRIVILEGES ON DATABASE khongfamily TO khongfamily_user;
