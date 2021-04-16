import express from 'express';
import cors from 'cors';

import ProductController from './controllers/ProductController';

const app = express();
app.use(express.urlencoded({ extended:true }));
app.use(express.json({ limit: '1mb' }));
app.use(cors());


const productController = new ProductController();

app.get('/', (req, res) => res.json({ msg: 'Hello World!' }));

app.get('/products', productController.getAll);

app.get('/products/search/:productName', productController.searchByName);

app.post('/products/add', productController.add);

app.patch('/products/edit/:id', productController.edit);

app.delete('/products/delete/:id', productController.delete);

app.get('/products/:id', productController.getById);

app.listen(3000);