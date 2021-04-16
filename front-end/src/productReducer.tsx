import * as actionProductTypes from "./productActionType";

const initialState: ProductsState = {
  products: [],
  currentProduct: undefined
};

const reducer = (state: ProductsState = initialState, action: ProductsAction): ProductsState => {
  switch (action.type) {
    case actionProductTypes.ADD_PRODUCT:
      const newProduct: IProduct = action.products[0];
      return {
        ...state,
        products: [ newProduct, ...state.products ]
      };
		case actionProductTypes.EDIT_PRODUCT:
			const editedProduct: IProduct = action.products[0];
			const index = state.products.findIndex(product => product.id === editedProduct.id);
			const products = state.products;
			const replacedProducts: IProduct[] = [
				...products.slice(0, index),
				editedProduct,
				...products.slice(index + 1)
			];
			return {
				...state,
				products: replacedProducts
			};
    case actionProductTypes.DELETE_PRODUCT:
      const updatedProducts: IProduct[] = state.products.filter(product => product.id !== action.products[0].id);
      return {
        ...state,
        products: updatedProducts
      };
    case actionProductTypes.SELECT_PRODUCT:
      return {
        ...state,
        currentProduct: action.products[0]
      };
    case actionProductTypes.SET_PRODUCTS:
      return {
        ...state,
        products: action.products
      };
    case actionProductTypes.RESET_CURRENT_PRODUCT:
      return {
        ...state,
        currentProduct: undefined
      };
  }
  return state;
};

export default reducer;
