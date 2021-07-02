DROP TABLE product;

CREATE TABLE product (
    id int NOT NULL AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    description VARCHAR(250),
    status VARCHAR(10) NOT NULL,
    notes VARCHAR(500),
    PRIMARY KEY (ID),
    UNIQUE (ID)
);