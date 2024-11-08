import data from "./data/data.json";
import "./App.css";
import { useEffect, useState } from "react";

const addItemId = (list) => {
  const newList = list.map((item) => ({
    ...item,
    objectID: crypto.randomUUID(),
  }));

  return newList;
};

const products = addItemId(data.products);

function App() {
  const [quantities, setQuantities] = useState([]);
  const [cartProducts, setCartProducts] = useState(() => {
    return JSON.parse(localStorage.getItem("cart")) || [];
  });
  const [isNotAvailable, setIsNotAvailable] = useState(false);

  const handleQuantityChange = (itemID, newQuantity) => {
    console.log(newQuantity);
    const newList = quantities.find((item) => item.objectID === itemID)
      ? quantities.map((item) =>
          item.objectID === itemID
            ? { objectID: itemID, amount: newQuantity }
            : item
        )
      : [
          ...quantities,
          {
            objectID: itemID,
            amount: newQuantity,
          },
        ];

    setQuantities(newList);
  };

  const handleAddCart = (product, event) => {
    const amount =
      quantities.find((item) => item.objectID === product.objectID)?.amount ||
      1;

    const newCartList = cartProducts.find(
      (item) => item.objectID === product.objectID
    )
      ? cartProducts.map((item) =>
          item.objectID === product.objectID
            ? {
                objectID: product.objectID,
                amount: item.amount + amount,
                name: product.name,
              }
            : item
        )
      : [
          ...cartProducts,
          {
            objectID: product.objectID,
            amount: amount,
            name: product.name,
          },
        ];

    setCartProducts(newCartList);
    event.preventDefault();
  };

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartProducts));
  }, [cartProducts]);

  return (
    <>
      <h1>Alternova Shop</h1>
      <div>
        <section>
          {products.map((product, index) => (
            <article className="productCard" key={index}>
              <img
                className="productCover"
                src={product.image}
                alt={`Image: ${product.name}`}
              />
              <div>
                <h2>{product.name}</h2>
                <form onSubmit={(event) => handleAddCart(product, event)}>
                  <label htmlFor="quantity">Quantity: </label>
                  <input
                    type="number"
                    value={
                      quantities.find(
                        (item) => item.objectID === product.objectID
                      )?.amount || 1
                    }
                    id="quantity"
                    min={1}
                    onChange={(event) =>
                      handleQuantityChange(
                        product.objectID,
                        parseInt(event.target.value)
                      )
                    }
                  />
                  <button type="submit" disabled={isNotAvailable}>
                    Add to cart
                  </button>
                  {isNotAvailable && <p>Not enough stock</p>}
                </form>
              </div>
            </article>
          ))}
        </section>
        <aside>
          <h2>Cart</h2>
          <div>
            {cartProducts.map((item, index) => (
              <div key={index}>
                <p>{item.name}</p>
                <p>{item.amount}</p>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </>
  );
}

export default App;
