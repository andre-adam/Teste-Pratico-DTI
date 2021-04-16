import { connect, useSelector } from "react-redux";

import "./App.css";
import { RootState } from "./combineReducers";
import Table from "./Table";
import Form from "./Form";

function App() {
  const currentProduct: IProduct | undefined = useSelector(
    (state: RootState) => state.products.currentProduct
  );

  return (
    <div className="app">
      <h1 className="title">Stock</h1>
      <hr />
      <div className="content">{currentProduct ? <Form /> : <Table />}</div>
    </div>
  );
}

export default connect()(App);
