import { connect, useDispatch, useSelector } from "react-redux";
import axios from "axios";

import {
  addProduct,
  selectProduct,
  resetSelectedProduct,
  editProduct
} from "./productAction";
import "./App.css";
import { RootState } from "./combineReducers";
import { apiURL } from './constants';

function Form() {
  const defaultNewProduct: IProduct = { name: "", value: 0, quantity: 0 };
  const currentProduct: IProduct | undefined = useSelector(
    (state: RootState) => state.products.currentProduct
  );

  const dispatch = useDispatch();

  const handleSave = async () => {
    if (!currentProduct) {
      return;
    }
    if (
      !currentProduct.name?.trim() ||
      (!+currentProduct.value && currentProduct.value !== 0) ||
      (!+currentProduct.quantity && currentProduct.quantity !== 0)
    ) {
      return alert("Please fill all required fields.");
    }
    if (!currentProduct?.id) {
      const { success, id } = await addProductToAPI(currentProduct);
      if (success) {
        dispatch(addProduct({ ...currentProduct, id }));
        dispatch(resetSelectedProduct());
      }
    } else {
      const { success } = await saveEdittedProductToAPI(currentProduct);
      if (success) {
        dispatch(editProduct(currentProduct));
        dispatch(resetSelectedProduct());
      }
    }
  };

  const addProductToAPI = async (
    product: IProduct
  ): Promise<{ success: boolean; id?: number }> => {
    try {
      const response = await axios.post(`${apiURL}/products/add`, product);
      return {
        success: response.statusText === "Created",
        id: +response.data?.id,
      };
    } catch (error) {
      console.log(error);
      return { success: false };
    }
  };

  const saveEdittedProductToAPI = async (
    product: IProduct
  ): Promise<{ success: boolean }> => {
    try {
      const response = await axios.patch(
        `${apiURL}/products/edit/${product.id}`,
        product
      );
      return { success: response.status === 204 };
    } catch (error) {
      console.log(error);
      return { success: false };
    }
  };

  const handleInput = (event: any) => {
    const value = event.target.value;
    dispatch(
      selectProduct({
        ...(currentProduct || defaultNewProduct),
        [event.target.name]:
          value === "0" ? 0 : +event.target.value || event.target.value,
      })
    );
  };

  const goBack = () => {
    dispatch(resetSelectedProduct());
  };

  return (
    <>
      <div className="form">
        <div className="input-group">
					<label>Name *</label>
          <input
            type="text"
            value={currentProduct?.name}
            name="name"
            placeholder="Name"
            onInput={handleInput}
          />
        </div>
        <div className="input-group">
					<label>Value *</label>
          <input
            type="number"
            value={currentProduct?.value}
            name="value"
            placeholder="Value"
            onInput={handleInput}
          />
        </div>
        <div className="input-group">
					<label>Quantity *</label>
          <input
            type="number"
            value={currentProduct?.quantity}
            name="quantity"
            placeholder="Quantity"
            onInput={handleInput}
          />
        </div>
      </div>
      <div className="actions-form">
        <button onClick={goBack}>Go Back</button>
        <button onClick={handleSave}>Save</button>
      </div>
    </>
  );
}

export default connect()(Form);
