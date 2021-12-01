DROP TABLE admin_user;

CREATE TABLE admin_user (
    id int NOT NULL AUTO_INCREMENT,
    name varchar(100) NOT NULL,
    login_id varchar(20) NOT NULL,
    password varchar(100) NOT NULL,
    PRIMARY KEY (ID),
    UNIQUE (login_id)
);

INSERT INTO CUSTOMER VALUES (4, 'ptdc_om_admin', 'Super Admin User', );
