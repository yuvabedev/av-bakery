INSERT INTO CUSTOMER VALUES (1, 'Gregory U. Coates', '1062728', 'Maitrya-2', 'Gregory@gmail.com', '373800222', 'ACTIVE', '');
INSERT INTO CUSTOMER VALUES (2, 'Jeffrey R. Robles', '1062779', 'Serenity', 'jeffery@hotmail.com', '7736262405', 'ACTIVE', '');
INSERT INTO CUSTOMER VALUES (3, 'Karen Stone', '1078322', 'Rohini', 'karen@gmail.com', '5803096553', 'ACTIVE', '');
INSERT INTO CUSTOMER VALUES (4, 'Ann Lopez', '193367', 'Swayam', 'ann@gmail.com', '374174542', 'ACTIVE', '');


INSERT INTO PRODUCT_CATEGORY VALUES (1, 'Bread', 'Bread');
INSERT INTO PRODUCT_CATEGORY VALUES (2, 'Croissant', 'Croissant');
INSERT INTO PRODUCT_CATEGORY VALUES (3, 'Pastry', 'Pastry');

INSERT INTO PRODUCT VALUES (1, 1, 'Rye Bread', 'Rye Bread', 'ACTIVE', 'ingredients', 'image url');
INSERT INTO PRODUCT VALUES (2, 1, 'Sourdough', 'Sourdough', 'ACTIVE', 'ingredients', 'image_url');
INSERT INTO PRODUCT VALUES (3, 1, 'Pumpernickel', 'Pumpernickel', 'ACTIVE', 'ingredients', 'image_url');
INSERT INTO PRODUCT VALUES (4, 1, 'White Bread', 'White Bread', 'ACTIVE', 'ingredients', 'image_url');
INSERT INTO PRODUCT VALUES (5, 1, 'Baguette Bread', 'Baguette Bread', 'INACTIVE', 'ingredients', 'image_url');
INSERT INTO PRODUCT VALUES (6, 1, 'Whole Wheat Bread', 'Whole Wheat Bread', 'ACTIVE', 'ingredients', 'image_url');
INSERT INTO PRODUCT VALUES (7, 1, 'Multigrain Bread', 'Multigrain Bread', 'ACTIVE', 'ingredients', 'image_url');
INSERT INTO PRODUCT VALUES (8, 1, 'Brioche Bread', 'Brioche Bread', 'ACTIVE', 'ingredients', 'image_url');
INSERT INTO PRODUCT VALUES (9, 1, 'Ciabatta Bread', 'Ciabatta Bread', 'ACTIVE', 'ingredients', 'image_url');
INSERT INTO PRODUCT VALUES (10, 2, 'Chocolate Croissant', 'Chocolate Croissant', 'ACTIVE', 'ingredients', 'image_url');
INSERT INTO PRODUCT VALUES (12, 2, 'Butter Croissant', 'Butter Croissant', 'ACTIVE', 'ingredients', 'image_url');
INSERT INTO PRODUCT VALUES (13, 2, 'Almond Croissant', 'Almond Croissant', 'ACTIVE', 'ingredients', 'image_url');
INSERT INTO PRODUCT VALUES (14, 3, 'Choclate Chip Cookie', 'Choclate Chip Cookie', 'ACTIVE', 'ingredients', 'image_url');
INSERT INTO PRODUCT VALUES (15, 3, 'Bear claw', 'Bear claw', 'ACTIVE', 'ingredients', 'image_url');
INSERT INTO PRODUCT VALUES (16, 3, 'Apple Pie', 'Apple Pie', 'ACTIVE', 'ingredients', 'image_url');
INSERT INTO PRODUCT VALUES (17, 3, 'Baklava', 'Baklava', 'ACTIVE', 'ingredients', 'image_url');


INSERT INTO delivery_schedule VALUES (1, 1, 'One Time Delivery');
INSERT INTO delivery_schedule VALUES (2, 4, '1 Month Weekly Delivery');
INSERT INTO delivery_schedule VALUES (3, 8, '2 Month2 Weekly Delivery');
INSERT INTO delivery_schedule VALUES (4, 12, '3 Months Weekly Delivery');

INSERT INTO delivery_location VALUES (1, 'Auroville Bakery');
INSERT INTO delivery_location VALUES (2, 'PTDC');
INSERT INTO delivery_location VALUES (3, 'HERS');