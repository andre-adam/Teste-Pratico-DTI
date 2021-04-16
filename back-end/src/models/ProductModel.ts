import { IProduct } from '../interfaces/IProduct';

export class Product {

    name: string;
    value: number;
    quantity: number;

    constructor({ name, value, quantity }: IProduct) {
        this.name = name;
        this.value = value;
        this.quantity = quantity;
    };

};
