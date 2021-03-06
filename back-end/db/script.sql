CREATE DATABASE TEST_PRODUCT;

\c TEST_PRODUCT;

CREATE TABLE TB_PRODUCT (
	ID SERIAL PRIMARY KEY,
	"name" TEXT NOT NULL,
	DATE_DELETED TIMESTAMP
);

CREATE TABLE TB_PRODUCT_VALUE (
	ID SERIAL PRIMARY KEY,
	ID_PRODUCT INTEGER,
	VALUE NUMERIC(15, 2) NOT NULL,
	DATE_ADDED TIMESTAMP NOT NULL,
	DATE_DELETED TIMESTAMP,
	FOREIGN KEY (ID_PRODUCT) REFERENCES TB_PRODUCT(ID)
);

CREATE TABLE TB_PRODUCT_QTY (
	ID SERIAL PRIMARY KEY,
	ID_PRODUCT INTEGER,
	QUANTITY BIGINT NOT NULL,
	DATE_ADDED TIMESTAMP NOT NULL,
	DATE_DELETED TIMESTAMP,
	FOREIGN KEY (ID_PRODUCT) REFERENCES TB_PRODUCT(ID)
);

CREATE VIEW TB_PRODUCT_INFO AS 
SELECT p.ID, p."name", coalesce(pv.value, 0) as value, coalesce(pq.quantity, 0) as quantity
FROM TB_PRODUCT p
LEFT JOIN TB_PRODUCT_VALUE pv
	ON pv.ID_PRODUCT = p.ID
	AND pv.date_deleted is null
LEFT JOIN TB_PRODUCT_QTY pq
	ON pq.ID_PRODUCT = p.ID
	AND pq.date_deleted  is null
WHERE p.DATE_DELETED IS NULL;
