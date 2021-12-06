

CREATE TABLE admin_user (
    id int NOT NULL AUTO_INCREMENT,
    name varchar(100) NOT NULL,
    login_id varchar(20) NOT NULL,
    password varchar(100) NOT NULL,
    PRIMARY KEY (ID),
    UNIQUE (login_id)
);




CREATE TABLE delivery_location (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(250) NOT NULL,
    PRIMARY KEY (ID)
);



CREATE TABLE customer (
    id int NOT NULL AUTO_INCREMENT,
    name varchar(100) NOT NULL,
    account varchar(10),
    community varchar(100),
    email varchar(100),
    phone varchar(20),
    status varchar(10) NOT NULL,
    notes varchar(500),
    PRIMARY KEY (ID),
    UNIQUE (ID)
);



CREATE TABLE delivery_schedule (
    id INT NOT NULL AUTO_INCREMENT,
    total_deliveries TINYINT NOT NULL,
    description VARCHAR(250),
    PRIMARY KEY (ID),
    UNIQUE (ID)
);



CREATE TABLE order_schedule (
    id int NOT NULL AUTO_INCREMENT,
    customer_id int(10) NOT NULL,
    product_id VARCHAR(5) NOT NULL,
    product_name VARCHAR(50) NOT NULL,
    quantity TINYINT NOT NULL,
    start_date DATE NOT NULL,
    total_deliveries TINYINT NOT NULL,
    delivery_location VARCHAR(25) NOT NULL,
    status VARCHAR(10) NOT NULL,
    notes VARCHAR(500),
    PRIMARY KEY (ID),
    UNIQUE (ID),
    FOREIGN KEY (customer_id) REFERENCES customer(ID)
);



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

CREATE TABLE product_category (
    id int NOT NULL AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    description VARCHAR(250),
    UNIQUE (ID)
);


CREATE TABLE product (
    id int NOT NULL AUTO_INCREMENT,
    category_id int NOT NULL,
    name VARCHAR(50) NOT NULL,
    description VARCHAR(250),
    status VARCHAR(10) NOT NULL,
    ingredients VARCHAR(500),
    image_url VARCHAR(250),
    PRIMARY KEY (ID),
    UNIQUE (ID),
    FOREIGN KEY (category_id) REFERENCES product_category(ID)
);


INSERT INTO customer VALUES (1, 'Gregory U. Coates', '1062728', 'Maitrya-2', 'Gregory@gmail.com', '373800222', 'ACTIVE', '');
INSERT INTO customer VALUES (2, 'Jeffrey R. Robles', '1062779', 'Serenity', 'jeffery@hotmail.com', '7736262405', 'ACTIVE', '');
INSERT INTO customer VALUES (3, 'Karen Stone', '1078322', 'Rohini', 'karen@gmail.com', '5803096553', 'ACTIVE', '');
INSERT INTO customer VALUES (4, 'Ann Lopez', '193367', 'Swayam', 'ann@gmail.com', '374174542', 'ACTIVE', '');


INSERT INTO product_category VALUES (1, 'Bread', 'Bread');
INSERT INTO product_category VALUES (2, 'Croissant', 'Croissant');
INSERT INTO product_category VALUES (3, 'Pastry', 'Pastry');

INSERT INTO product VALUES (1, 1, 'Rye Bread', 'Rye Bread', 'ACTIVE', 'ingredients', 'image url');
INSERT INTO product VALUES (2, 1, 'Sourdough', 'Sourdough', 'ACTIVE', 'ingredients', 'image_url');
INSERT INTO product VALUES (3, 1, 'Pumpernickel', 'Pumpernickel', 'ACTIVE', 'ingredients', 'image_url');
INSERT INTO product VALUES (4, 1, 'White Bread', 'White Bread', 'ACTIVE', 'ingredients', 'image_url');
INSERT INTO product VALUES (5, 1, 'Baguette Bread', 'Baguette Bread', 'INACTIVE', 'ingredients', 'image_url');
INSERT INTO product VALUES (6, 1, 'Whole Wheat Bread', 'Whole Wheat Bread', 'ACTIVE', 'ingredients', 'image_url');
INSERT INTO product VALUES (7, 1, 'Multigrain Bread', 'Multigrain Bread', 'ACTIVE', 'ingredients', 'image_url');
INSERT INTO product VALUES (8, 1, 'Brioche Bread', 'Brioche Bread', 'ACTIVE', 'ingredients', 'image_url');
INSERT INTO product VALUES (9, 1, 'Ciabatta Bread', 'Ciabatta Bread', 'ACTIVE', 'ingredients', 'image_url');
INSERT INTO product VALUES (10, 2, 'Chocolate Croissant', 'Chocolate Croissant', 'ACTIVE', 'ingredients', 'image_url');
INSERT INTO product VALUES (12, 2, 'Butter Croissant', 'Butter Croissant', 'ACTIVE', 'ingredients', 'image_url');
INSERT INTO product VALUES (13, 2, 'Almond Croissant', 'Almond Croissant', 'ACTIVE', 'ingredients', 'image_url');
INSERT INTO product VALUES (14, 3, 'Choclate Chip Cookie', 'Choclate Chip Cookie', 'ACTIVE', 'ingredients', 'image_url');
INSERT INTO product VALUES (15, 3, 'Bear claw', 'Bear claw', 'ACTIVE', 'ingredients', 'image_url');
INSERT INTO product VALUES (16, 3, 'Apple Pie', 'Apple Pie', 'ACTIVE', 'ingredients', 'image_url');
INSERT INTO product VALUES (17, 3, 'Baklava', 'Baklava', 'ACTIVE', 'ingredients', 'image_url');


INSERT INTO delivery_schedule VALUES (1, 1, 'One Time Delivery');
INSERT INTO delivery_schedule VALUES (2, 4, '1 Month Weekly Delivery');
INSERT INTO delivery_schedule VALUES (3, 8, '2 Month2 Weekly Delivery');
INSERT INTO delivery_schedule VALUES (4, 12, '3 Months Weekly Delivery');

INSERT INTO delivery_location VALUES (1, 'Auroville Bakery');
INSERT INTO delivery_location VALUES (2, 'PTDC');
INSERT INTO delivery_location VALUES (3, 'HERS');
