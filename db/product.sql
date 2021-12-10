DROP TABLE product;

CREATE TABLE product (
    id int NOT NULL AUTO_INCREMENT,
    category_id int NOT NULL,
    name VARCHAR(50) NOT NULL,
    description VARCHAR(250),
    status VARCHAR(10) NOT NULL,
    ingredients VARCHAR(500),
    image_url VARCHAR(250),
    is_vegan TINYINT(1) NOT NULL DEFAULT 0,
    is_dairyfree TINYINT(1) NOT NULL DEFAULT 0,
    is_eggless TINYINT(1) NOT NULL DEFAULT 0,
    PRIMARY KEY (ID),
    UNIQUE (ID),
    FOREIGN KEY (category_id) REFERENCES product_category(ID)
);