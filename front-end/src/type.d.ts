interface IProduct {
	id?: number;
	name: string;
	value: number;
	quantity: number;
}

type ProductsState = {
	products: IProduct[];
	currentProduct?: IProduct;
};

type ProductAction = {
	type: string;
	product: IProduct;
};

type DispatchTypeProduct = (args: ProductAction) => ProductAction;

type ProductsAction = {
	type: string;
	products: IProduct[];
};

type DispatchTypeProducts = (args: ProductsAction) => ProductsAction;
