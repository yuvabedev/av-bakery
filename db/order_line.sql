DROP TABLE order_line;

CREATE TABLE order_line (
    id int NOT NULL AUTO_INCREMENT,
    order_schedule_id int(10) NOT NULL,
    customer_id int(10) NOT NULL,
    product_id VARCHAR(5) NOT NULL,
    product_name VARCHAR(50) NOT NULL,
    quantity TINYINT NOT NULL,
    delivery_date DATE NOT NULL,
    delivery_location VARCHAR(25) NOT NULL,
    status VARCHAR(10) NOT NULL,
    notes VARCHAR(500),
    PRIMARY KEY (ID),
    UNIQUE (ID),
    FOREIGN KEY (order_schedule_id) REFERENCES order_schedule(ID),
    FOREIGN KEY (customer_id) REFERENCES customer(ID)
);