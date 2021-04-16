import { useEffect, useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import axios from "axios";

import {
  selectProduct,
  deleteProduct,
  setProducts,
} from "./productAction";
import "./App.css";
import { RootState } from "./combineReducers";
import { Subject } from "rxjs";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";
import { apiURL } from './constants';

function Table() {
  const [searchName, setSearchName] = useState("");

  const products: IProduct[] = useSelector(
    (state: RootState) => state.products.products
  );

  const [$onSearch] = useState(() => new Subject<string>());

  const dispatch = useDispatch();

  const searchProductByNameToAPI = async (
    name: string
  ): Promise<{ success: boolean; products: IProduct[] }> => {
    try {
      const url = name?.trim()
        ? `${apiURL}/products/search/${name}`
        : `${apiURL}/products`;
      const response = await axios.get(url);
      return { success: response.status === 200, products: response.data };
    } catch (error) {
      console.log(error);
      return { success: false, products: [] };
    }
  };

  const deleteProductToAPI = async (
    product: IProduct
  ): Promise<{ success: boolean }> => {
    try {
      const response = await axios.delete(
        `${apiURL}/products/delete/${product.id}`
      );
      return { success: response.status === 204 };
    } catch (error) {
      console.log(error);
      return { success: false };
    }
  };

  const handleEditProduct = (product: IProduct) => {
    dispatch(selectProduct(product));
  };

  const handleDelete = async (product: IProduct) => {
    // eslint-disable-next-line no-restricted-globals
    const confirmedDelete = confirm("Are you sure ?");
    if (confirmedDelete) {
      const { success } = await deleteProductToAPI(product);
      if (success) {
        dispatch(deleteProduct(product));
      }
    }
  };

  const handleSearch = async (event: any) => {
    const name = event.target.value;
    setSearchName(name);
    $onSearch.next(name);
  };

  const getAllProducts = async () => {
    const response = await axios.get(`${apiURL}/products`);
    let products: IProduct[] = [];
    if (response.statusText === "OK") {
      products = response.data;
    }
    dispatch(setProducts(products));
  };

  useEffect(() => {
    getAllProducts();
    $onSearch
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe(async (name) => {
        const { success, products } = await searchProductByNameToAPI(name);
        if (success) {
          dispatch(setProducts(products));
        }
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ ]);

  return (
    <>
      <div className="actions">
        <input
          className="search-input"
          value={searchName}
          onInput={handleSearch}
          placeholder="Search by name..."
          type="search"
        />
        <button
          className="add-action"
          onClick={() =>
            dispatch(selectProduct({ id: 0, name: "", value: 0, quantity: 0 }))
          }
        >
          Add Product
        </button>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Value</th>
            <th>Quantity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={index}>
              <td>{product.name}</td>
              <td>{product.value}</td>
              <td>{product.quantity}</td>
              <td className="actions-cell">
                <button
                  className="edit"
                  onClick={() => handleEditProduct(product)}
                  title="Edit"
                >
                  <span>&#9998;</span>
                </button>
                <button
                  className="delete"
                  onClick={() => handleDelete(product)}
                  title="Delete"
                >
                  <span>&times;</span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default connect()(Table);
