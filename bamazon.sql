DROP DATABASE IF EXISTS products_db;

CREATE DATABASE products_db;

USE products_db;

CREATE TABLE products(
  id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NOT NULL,
  department_name VARCHAR(45) NOT NULL,
  price INT default 0,
  stock_quantity INT default 0,
  product_sales INT NULL,
  PRIMARY KEY (id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES
("Wicked", "Beauty", 8, 10),
("MAC Palette", "Beauty", 22, 9),
("iPhone", "Electronics", 195, 7),
("Spiderman", "Toys", 10, 8),
("iPad", "Electronic", 400, 5),
("Coffee", "Food", 11, 20),
("Table", "Furniture", 150, 4),
("Nikes", "Shoes", 80, 25),
("Snapple", "Food", 2, 50),
("Pasta", "Food", 4, 30);

CREATE TABLE departments(
  department_id INT NOT NULL AUTO_INCREMENT,
  department_name VARCHAR(60),
  over_head_costs,
  PRIMARY KEY (department_id)
);

INSERT INTO departments (department_name, over_head_costs)
VALUES
("Beauty", 10000),
("Electronics", 50000),
("Toys", 15000),
("Food", 75000),
("Furniture", 30000),
("Shoes", 25000);
