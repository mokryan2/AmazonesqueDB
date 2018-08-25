create database bamazon_db;

use bamazon_db;

create table products(
	id integer(11) auto_increment not null,
    product_name varchar(20) not null,
    department_name varchar(20) not null,
    price integer(100) not null,
    stock_quantity integer(100) not null,
    PRIMARY KEY (id)
);