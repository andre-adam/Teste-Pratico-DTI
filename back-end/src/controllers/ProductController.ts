
import { Request, Response } from 'express';
import pool from '../db-config/db-connector';

import { IProduct } from '../interfaces/IProduct';

class ProductController {

    constructor() {
        this.getById = this.getById.bind(this);
        this.edit = this.edit.bind(this);
        this.add = this.add.bind(this);
        this.searchByName = this.searchByName.bind(this);
    }

    public async getAll(req: Request, res: Response) {
        try {
            const client = await pool.connect();
            const sql = 'SELECT * FROM TB_PRODUCT_INFO ORDER BY ID DESC';
            const { rows } = await client.query(sql);
            const products = rows;
            client.release();
            res.send(products);
        } catch (error) {
            res.status(400).send(error);
        }
    }

    public async getById(req: Request, res: Response) {
        try {
            const client = await pool.connect();
            const idProduct = +req.params?.id;
            if (!idProduct) {
                throw Error('Invalid product ID.')
            }
            const product = await this.getProductById(idProduct);
            client.release();
            res.send(product);
        } catch ({ message }) {
            res.status(400).send({ error: message });
        }
    }

    public async searchByName(req: Request, res: Response) {
        try {
            const client = await pool.connect();
            const productName = req.params?.productName;
            if (!productName?.trim()) {
                throw Error('Invalid product name.')
            }
            const products = await this.getProductsByName(productName);
            client.release();
            res.send(products);
        } catch ({ message }) {
            res.status(400).send({ error: message });
        }
    }

    public async add(req: Request, res: Response) {
        try {
            const product = req.body as IProduct;
            if (!product.name?.trim()) {
                throw Error('Invalid name for a product.');
            }
            if (!+product.value && product.value !== 0) {
                throw Error('Invalid value for a product.');
            }
            if (!+product.quantity && product.quantity !== 0) {
                throw Error('Invalid quantity for a product.');
            }
            const client = await pool.connect();
            
            const sqlInsertProduct = 'INSERT INTO TB_PRODUCT ("name") VALUES ($1) RETURNING ID;';
            const { rows: productResult } = await client.query(sqlInsertProduct, [ product.name ]);
            const { id: idProduct } = productResult[0];

            await this.insertProductValue(idProduct, product.value);
            await this.insertProductQuantity(idProduct, product.quantity);

            client.release();
            res.status(201).send({ id: idProduct });
        } catch ({ message }) {
            res.status(400).send({ error: message });
        }
    }

    public async edit(req: Request, res: Response) {
        try {
            const idProduct = +req.params?.id;
            const newProduct = req.body as IProduct;
            if (!newProduct.name?.trim()) {
                throw Error('Invalid name for a product.');
            }
            const client = await pool.connect();
            const currentProduct = await this.getProductById(idProduct);
            
            if (!currentProduct) {
                throw Error('Invalid product.')
            }

            if (currentProduct.name !== newProduct.name) {
                const sqlUpdateNameProduct = 'UPDATE TB_PRODUCT SET "name" = $1 WHERE ID = $2';
                await client.query(sqlUpdateNameProduct, [ newProduct.name, idProduct ]);
            }

            if (+currentProduct.value !== +newProduct.value) {
                await this.deletePreviousValue(idProduct);
                await this.insertProductValue(idProduct, newProduct.value);
            }

            if (+currentProduct.quantity !== +newProduct.quantity) {
                await this.deletePreviousQuantity(idProduct);
                await this.insertProductQuantity(idProduct, newProduct.quantity);
            }
            client.release();
            res.status(204).send();
        } catch ({ message }) {
            res.status(400).send({ error: message });
        }
    }

    public async delete(req: Request, res: Response) {
        try {
            const idProduct = +req.params.id;
            if (!idProduct) {
                throw Error('Invalid ID product.');
            }
            const client = await pool.connect();
            const sql = 'UPDATE TB_PRODUCT SET DATE_DELETED = CURRENT_TIMESTAMP WHERE ID = $1;';
            await client.query(sql, [ idProduct ]);
            client.release();
            res.status(204).send();
        } catch ({ message }) {
            res.status(400).send({ error: message || 'Error deleting product.' });
        }
    }

    private async getProductById(idProduct: number): Promise<IProduct> {
        try {
            const client = await pool.connect();
            const sql = 'SELECT * FROM TB_PRODUCT_INFO WHERE ID = $1;';
            const { rows } = await client.query(sql, [ idProduct ]);
            client.release();
            return rows[0] as IProduct;
        } catch (error) {
            return null;
        }
    }

    private async getProductsByName(productName: string): Promise<IProduct[]> {
        try {
            productName = productName.toUpperCase();
            const client = await pool.connect();
            const sql = `SELECT * FROM TB_PRODUCT_INFO WHERE UPPER(name) LIKE CONCAT('%', CAST($1 as TEXT), '%');`;
            const { rows } = await client.query(sql, [ productName ]);
            client.release();
            return rows as IProduct[];
        } catch (error) {
            throw Error('Error searching for the product by name.');
        }
    }

    private async insertProductValue(idProduct: number, valueProduct: number): Promise<boolean> {
        try {
            if (!idProduct || (!valueProduct && valueProduct !== 0)) {
                throw Error();
            }
            const client = await pool.connect();
            const sqlInsertProductValue = 'INSERT INTO TB_PRODUCT_VALUE (id_product, value, date_added) VALUES ($1, $2, current_timestamp);';
            await client.query(sqlInsertProductValue, [ idProduct, valueProduct ]);
            client.release();
            return true;
        } catch (error) {
            throw Error('Error adding value to the product.');
        }
    }

    private async insertProductQuantity(idProduct: number, quantityProduct: number): Promise<boolean> {
        try {
            if (!idProduct || (!quantityProduct && quantityProduct !== 0)) {
                throw Error();
            }
            const client = await pool.connect();
            const sqlInsertProductValue = 'INSERT INTO TB_PRODUCT_QTY (id_product, quantity, date_added) VALUES ($1, $2, current_timestamp);';
            await client.query(sqlInsertProductValue, [ idProduct, quantityProduct ]);
            client.release();
            return true;
        } catch (error) {
            throw Error('Error adding quantity to the product.');;
        }
    }

    private async deletePreviousValue(idProduct: number): Promise<boolean> {
        try {
            if (!idProduct) {
                throw Error();
            }
            const client = await pool.connect();
            const sql = 'UPDATE TB_PRODUCT_VALUE SET DATE_DELETED = CURRENT_TIMESTAMP WHERE ID_PRODUCT = $1 AND DATE_DELETED IS NULL;';
            await client.query(sql, [ idProduct ]);
            client.release();
            return true;
        } catch (error) {
            throw Error('Error deleting previous value of product.');
        }
    }

    private async deletePreviousQuantity(idProduct: number): Promise<boolean> {
        try {
            if (!idProduct) {
                throw Error();
            }
            const client = await pool.connect();
            const sql = 'UPDATE TB_PRODUCT_QTY SET DATE_DELETED = CURRENT_TIMESTAMP WHERE ID_PRODUCT = $1 AND DATE_DELETED IS NULL;';
            await client.query(sql, [ idProduct]);
            client.release();
            return true;
        } catch (error) {
            throw Error('Error deleting previous quantity of product.');
        }
    }
}

export default ProductController;