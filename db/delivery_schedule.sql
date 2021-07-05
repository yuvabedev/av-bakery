DROP TABLE delivery_schedule;

CREATE TABLE delivery_schedule (
    id INT NOT NULL AUTO_INCREMENT,
    total_deliveries TINYINT NOT NULL,
    description VARCHAR(250),
    PRIMARY KEY (ID),
    UNIQUE (ID)
);