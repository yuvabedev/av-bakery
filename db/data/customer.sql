DROP TABLE customer;

CREATE TABLE customer (
    id int NOT NULL AUTO_INCREMENT,
    name varchar(100) NOT NULL,
    account varchar(10),
    community varchar(100),
    email varchar(100),
    phone varchar(20),
    status varchar(10) NOT NULL,
    notes varchar(200),
    PRIMARY KEY (ID),
    UNIQUE (account)
);

INSERT INTO CUSTOMER VALUES (1, 'Gregory U. Coates', '1062728', 'Maitrya-2', 'Gregory@gmail.com', '373800222', 'ACTIVE', '');
INSERT INTO CUSTOMER VALUES (2, 'Jeffrey R. Robles', '1062778', 'Serenity', 'jeffery@hotmail.com', '7736262405', 'ACTIVE', '');
INSERT INTO CUSTOMER VALUES (3, 'Karen Stone', '1078322', 'Rohini', 'karen@gmail.com', '5803096553', 'ACTIVE', '');
INSERT INTO CUSTOMER VALUES (4, 'Ann Lopez', '193367', 'Swayam', 'ann@gmail.com', '374174542', 'ACTIVE', '');