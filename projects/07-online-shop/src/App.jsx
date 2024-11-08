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
  const [cartProducts, setCartProducts] = useState([]);
  const [isNotAvailable, setIsNotAvailable] = useState(() => {
    const availability = {};
    products.forEach((product) => {
      const stock = product.stock || 0;
      const cartAmount =
        cartProducts.find((item) => item.objectID === product.objectID)
          ?.amount || 0;
      availability[product.objectID] = cartAmount >= stock;
    });
    return availability;
  });

  const handleQuantityChange = (itemID, newQuantity) => {
    const productStock =
      products.find((product) => product.objectID === itemID)?.stock || 0;
    const cartAmount =
      cartProducts.find((item) => item.objectID === itemID)?.amount || 0;
    const isAvailable = newQuantity + cartAmount <= productStock;

    setIsNotAvailable((prev) => ({
      ...prev,
      [itemID]: !isAvailable,
    }));

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
    event.preventDefault();
    const amount =
      quantities.find((item) => item.objectID === product.objectID)?.amount ||
      1;

    const cartAmount =
      cartProducts.find((item) => item.objectID === product.objectID)?.amount ||
      0;

    if (amount + cartAmount > product.stock) {
      setIsNotAvailable((prev) => ({
        ...prev,
        [product.objectID]: true,
      }));
      return; // Detener la ejecución si el stock es insuficiente
    }

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
  };

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
                  <button
                    type="submit"
                    disabled={isNotAvailable[product.objectID] || false}
                  >
                    Add to cart
                  </button>
                  {isNotAvailable[product.objectID] && <p>Not enough stock</p>}
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
