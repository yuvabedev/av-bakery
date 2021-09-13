DROP TABLE product_category;

CREATE TABLE product_category (
    id int NOT NULL AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    description VARCHAR(250),
    UNIQUE (ID)
);