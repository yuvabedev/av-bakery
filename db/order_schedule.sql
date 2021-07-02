DROP TABLE order_schedule;

CREATE TABLE order_schedule (
    id int NOT NULL AUTO_INCREMENT,
    customer_id int(10) NOT NULL,
    product_id VARCHAR(5) NOT NULL,
    product_name VARCHAR(50) NOT NULL,
    quantity int(4) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_delivery_weeks int(4) NOT NULL,
    onetime_order BOOLEAN NOT NULL,
    delivery_location, VARCHAR(25) NOT NULL,
    status varchar(10) NOT NULL,
    notes varchar(500),
    PRIMARY KEY (ID),
    UNIQUE (ID),
    FOREIGN KEY (customer_id) REFERENCES Customer(ID)
);