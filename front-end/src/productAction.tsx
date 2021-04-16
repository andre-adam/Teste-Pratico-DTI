import * as actionProductTypes from "./productActionType";

export const setProducts = (products: IProduct[]) => {
  const action: ProductsAction = {
    type: actionProductTypes.SET_PRODUCTS,
    products
  };
  return action;
}

export const selectProduct = (product: IProduct) => {
  const action: ProductsAction = {
    type: actionProductTypes.SELECT_PRODUCT,
    products: [ product ]
  };  
  return action;
}

export const resetSelectedProduct = () => {
  const action: ProductsAction = {
    type: actionProductTypes.RESET_CURRENT_PRODUCT,
    products: []
  };
  return action;
}

export const addProduct = (product: IProduct) => {
  const action: ProductsAction = {
    type: actionProductTypes.ADD_PRODUCT,
    products: [ product ]
  };
  return action;
}

export const editProduct = (product: IProduct) => {
  const action: ProductsAction = {
    type: actionProductTypes.EDIT_PRODUCT,
    products: [ product ]
  };
  return action;
}

export const deleteProduct = (product: IProduct) => {
  const action: ProductsAction = {
    type: actionProductTypes.DELETE_PRODUCT,
    products: [ product ]
  };
  return action;
}
